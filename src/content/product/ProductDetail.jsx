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

  constructor() {
    super();
    const item = store.initialData ? store.initialData.issue : null;
    delete store.initialData;
    this.state = {
      item, showing: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.createNewListing = this.createNewListing.bind(this);
  }

  componentDidMount() {
    const { item } = this.state;
    if (item == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
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
    const { item } = this.state;
    const form = document.forms.listingAdd;

    const priceList = [];
    const bellPrice = form.bellPrice.value;
    if (bellPrice && bellPrice > 0) priceList.push({ productId: 'bell', productCount: parseInt(bellPrice, 10) });
    const nmtPrice = form.nmtPrice.value;
    if (nmtPrice && nmtPrice > 0) priceList.push({ productId: 'nmt', productCount: parseInt(nmtPrice, 10) });
    const wishlistPrice = form.wishlistPrice.value;
    if (wishlistPrice && wishlistPrice > 0) priceList.push({ productId: 'wishlist', productCount: parseInt(wishlistPrice, 10) });

    const listing = {
      sellerId: 1,
      sellerName: 'ppt',
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

    const { showError, showSuccess } = this.props;
    const data = await graphQLFetch(query, { listing }, showError);
    if (data) {
      showSuccess('Create new listing successfully');
      window.location.reload(false);
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await ProductDetail.fetchData(match, showError);
    this.setState({ item: data ? data.item : {} });
  }

  render() {
    const { item, showing } = this.state;
    if (item == null) return null;

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
            <ButtonToolbar>
              <Button disabled={!user.signedIn} bsStyle="primary" onClick={this.showModal}>Post New Listing</Button>
              <Button disabled={!user.signedIn} bsStyle="primary">Save to Wishlist</Button>
            </ButtonToolbar>
          </Panel.Footer>
        </Panel>
        <ProductListings productId={id} location={search} />

        <Modal keyboard show={showing} onHide={this.hideModal}>
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

export default ProductDetailWithToast;
