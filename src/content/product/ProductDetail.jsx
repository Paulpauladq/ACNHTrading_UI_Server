import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Col, Panel, Image, Modal, Form, FormGroup, ControlLabel,
  FormControl, ButtonToolbar, Button, Row,
} from 'react-bootstrap';

import graphQLFetch from '../../script/graphQLFetch.js';
import withToast from '../../component/withToast.jsx';
import store from '../../script/store.js';
import UserContext from '../../script/UserContext.js';
import ProductListings from '../listing/ProductListings.jsx';

class ProductDetail extends React.Component {
  static async fetchData(match, showError) {
    const query = `query item($uniqueEntryId: String!) {
      item(uniqueEntryId: $uniqueEntryId) {
        name 
        sourceSheet 
        variants { 
          uniqueEntryId 
          image 
        }
      }
    }`;

    const { params: { id } } = match;
    const result = await graphQLFetch(query, { uniqueEntryId: id }, showError);
    return result;
  }

  static async getAcnher(userContext) {
    const query = `query acnher(
      $lookup: String! 
      $lookupType: AcnherLookupType!
    ) {
      acnher(
        lookup: $lookup 
        lookupType: $lookupType
      ) {
        id email nickname switchId 
        islandName villagerList created 
        wishlist {
          uniqueEntryId itemName thumbnail
        }
      }
    }`;

    const result = await graphQLFetch(query, { lookup: `${userContext.email}`, lookupType: 'email' }, null);
    return result;
  }

  constructor() {
    super();
    const item = store.initialData ? store.initialData.item : null;
    const acnher = store.initialData ? store.initialData.acnher : null;
    delete store.initialData;
    this.state = {
      item, showing: false, acnher,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.createNewListing = this.createNewListing.bind(this);
    this.saveItemToWishlist = this.saveItemToWishlist.bind(this);
  }

  componentDidMount() {
    const { item, acnher } = this.state;
    if (item == null || acnher == null) this.loadData(this.context);
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData(this.context);
    }
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async createNewListing(e) {
    e.preventDefault();
    this.hideModal();
    const { item, acnher } = this.state;
    const { showError, showSuccess } = this.props;
    const form = document.forms.listingAdd;

    if (!form.productCount.value) {
      showError('Number of product must be specified...');
      return;
    }

    const priceList = [];
    const bellPrice = form.bellPrice.value;
    if (bellPrice && bellPrice > 0) priceList.push({ productId: 'bell', productCount: parseInt(bellPrice, 10) });
    const nmtPrice = form.nmtPrice.value;
    if (nmtPrice && nmtPrice > 0) priceList.push({ productId: 'nmt', productCount: parseInt(nmtPrice, 10) });
    const wishlistPrice = form.wishlistPrice.value;
    if (wishlistPrice && wishlistPrice > 0) priceList.push({ productId: 'wishlist', productCount: parseInt(wishlistPrice, 10) });

    if (priceList.length === 0) {
      showError('At least one price must be specified...');
      return;
    }

    const listing = {
      sellerId: acnher.id,
      sellerName: acnher.nickname,
      productId: item.variants[0].uniqueEntryId,
      productName: item.name,
      productCount: parseInt(form.productCount.value, 10),
      note: form.note.value,
      thumbnail: item.variants[0].image,
      priceList,
    };
    const query = `mutation listingAdd($listing: ListingInputs!) {
      listingAdd(listing: $listing) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { listing }, showError);
    if (data) {
      showSuccess('Create new listing successfully');
      window.location.reload(false);
    }
  }

  async saveItemToWishlist() {
    const { item, acnher } = this.state;
    const { showError, showSuccess } = this.props;

    const changes = {
      wishlist: acnher.wishlist,
    };
    changes.wishlist.push(
      {
        uniqueEntryId: item.variants[0].uniqueEntryId,
        itemName: item.name,
        thumbnail: item.variants[0].image,
      },
    );

    const query = `mutation acnherUpdate(
      $id: Int!
      $changes: AcnherUpdateInputs!
    ) {
      acnherUpdate(
        id: $id
        changes: $changes
      ) {
        id email nickname switchId
        islandName villagerList created
        wishlist {
          uniqueEntryId itemName thumbnail
        }
      }
    }`;

    const data = await graphQLFetch(query, { id: parseInt(acnher.id, 10), changes }, showError);

    if (data) {
      this.setState({ acnher: data.acnherUpdate });
      showSuccess('Add to wishlist successfully');
    }
  }

  async loadData(userContext) {
    const { match, showError } = this.props;
    const itemData = await ProductDetail.fetchData(match, showError);
    this.setState({ item: itemData ? itemData.item : {} });
    const acnherData = await ProductDetail.getAcnher(userContext, showError);
    this.setState({ acnher: acnherData ? acnherData.acnher : {} });
  }

  render() {
    const { item, showing, acnher } = this.state;
    if (item == null || acnher == null) return null;

    const { match: { params: { id } }, location: { search } } = this.props;
    const user = this.context;

    return (
      <React.Fragment>
        <Panel>
          <Panel.Heading>
            <Panel.Title>{`${item.name}`}</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <Row>
              <Col xs={6} md={4} lg={3}>
                <Image src={item.variants[0].image} responsive />
              </Col>
              <Col xs={6} md={8} lg={9}>
                <p>{item.variants[0].uniqueEntryId}</p>
                <p>{item.sourceSheet}</p>
              </Col>
            </Row>
          </Panel.Body>
          <Panel.Footer>
            <ButtonToolbar id="product-detail-button-bar">
              <Button disabled={!user.signedIn} bsStyle="primary" onClick={this.showModal}>Post New Listing</Button>
              <Button disabled={!user.signedIn} bsStyle="primary" onClick={this.saveItemToWishlist}>Save to Wishlist</Button>
            </ButtonToolbar>
          </Panel.Footer>
        </Panel>
        <ProductListings productId={id} location={search} />

        <Modal id="product-detail-modal" keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Post New Listing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={6} md={4} lg={3}>
                <Image src={item.variants[0].image} responsive />
              </Col>
              <Col xs={6} md={8} lg={9}>
                <p>{item.variants[0].uniqueEntryId}</p>
                <p>{item.name}</p>
                <p>{item.sourceSheet}</p>
              </Col>
            </Row>
            <Form name="listingAdd">
              <FormGroup>
                <ControlLabel>Amount</ControlLabel>
                <FormControl name="productCount" type="number" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Note</ControlLabel>
                <FormControl name="note" />
              </FormGroup>
              <h3>Pricing</h3>
              <FormGroup>
                <ControlLabel>Bell</ControlLabel>
                <FormControl name="bellPrice" type="number" />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Nook Miles Ticket</ControlLabel>
                <FormControl name="nmtPrice" type="number" />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Wishlist Items</ControlLabel>
                <FormControl name="wishlistPrice" type="number" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                type="button"
                bsStyle="primary"
                disabled={!user.signedIn}
                onClick={this.createNewListing}
              >
                Post
              </Button>
              <Button bsStyle="primary" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

ProductDetail.contextType = UserContext;

const ProductDetailWithToast = withToast(withRouter(ProductDetail));
ProductDetailWithToast.fetchData = ProductDetail.fetchData;
ProductDetailWithToast.getAcnher = ProductDetail.getAcnher;

export default ProductDetailWithToast;
