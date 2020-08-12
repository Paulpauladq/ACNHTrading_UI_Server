import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Col, Panel, Image, Thumbnail, Radio,
  ButtonToolbar, Button, Row, Modal, Form,
  FormGroup, ControlLabel, FormControl,
} from 'react-bootstrap';

import graphQLFetch from '../../script/graphQLFetch.js';
import withToast from '../../component/withToast.jsx';
import listingPriceImage from '../../script/listingPriceImage.js';
import store from '../../script/store.js';
import UserContext from '../../script/UserContext.js';
import ListingOffers from '../offer/ListingOffers.jsx';

class ListingDetail extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query listing($id: Int!) {
      listing(id: $id) {
        id status sellerId sellerName 
        productId productName productCount 
        thumbnail created note 
        priceList {
          productId productCount
        }
      }
    }`;

    const { params: { id } } = match;
    const result = await graphQLFetch(query, { id: parseInt(id, 10) }, showError);
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
        id email nickname switchId islandName
        villagerList created
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
    const listing = store.initialData ? store.initialData.listing : null;
    const acnher = store.initialData ? store.initialData.acnher : null;
    delete store.initialData;
    this.state = {
      listing, showing: false, acnher,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.createNewOffer = this.createNewOffer.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  componentDidMount() {
    const { listing, acnher } = this.state;
    if (listing == null || acnher == null) this.loadData(this.context);
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData(this.context);
    }
  }

  onValueChange(event) {
    this.setState({
      offerType: event.target.value,
    });
  }

  showModal() {
    this.setState({ showing: true, offerType: 'bell' });
  }

  hideModal() {
    this.setState({ showing: false, offerType: null });
  }

  async createNewOffer(e) {
    e.preventDefault();
    this.hideModal();
    const { listing, offerType, acnher } = this.state;
    const { showError, showSuccess } = this.props;
    const form = document.forms.offerAdd;

    if (!form.productCount.value) {
      showError('Number of product must be specified...');
      return;
    }

    const offer = {
      listingId: listing.id,
      sellerId: listing.sellerId,
      buyerId: acnher.id,
      productId: offerType,
      productCount: parseInt(form.productCount.value, 10),
    };
    const query = `mutation offerAdd($offer: OfferInputs!) {
      offerAdd(offer: $offer) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { offer }, showError);
    if (data) {
      showSuccess('Create new offer successfully');
      window.location.reload(false);
    }
  }

  async loadData(userContext) {
    const { match, showError } = this.props;
    const data = await ListingDetail.fetchData(match, null, showError);
    this.setState({ listing: data ? data.listing : {} });
    const acnherData = await ListingDetail.getAcnher(userContext, showError);
    this.setState({ acnher: acnherData ? acnherData.acnher : {} });
  }

  render() {
    const { listing, showing } = this.state;
    if (listing == null) return null;

    const { listing: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Listing with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const user = this.context;
    const price = listing.priceList.map((p) => {
      switch (p.productId) {
        case 'bell':
          return (
            <Col xs={1}>
              <Thumbnail src={listingPriceImage.bell} alt="10x10" />
              {` x ${p.productCount}`}
            </Col>
          );
        case 'nmt':
          return (
            <Col xs={1}>
              <Thumbnail src={listingPriceImage.nmt} alt="10x10" />
              {` x ${p.productCount}`}
            </Col>
          );
        case 'wishlist':
          return (
            <Col xs={1}>
              <Thumbnail src={listingPriceImage.wishlist} alt="10x10" />
              {` x ${p.productCount}`}
            </Col>
          );
        default:
          return null;
      }
    });

    return (
      <React.Fragment>
        <Panel>
          <Panel.Heading>
            <Panel.Title>{`${listing.productCount} x ${listing.productName}`}</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <Row>
              <Col xs={6} md={4} lg={3}>
                <Image src={listing.thumbnail} responsive />
              </Col>
              <Col xs={6} md={8} lg={9}>
                <p>{`Seller Name: ${listing.sellerName}`}</p>
                <p className="text-muted">{`Created: ${listing.created.toDateString()}`}</p>
                <p>{`Note: ${listing.note}`}</p>
                <p className="text-muted">Price: </p>
                <Row>
                  {price}
                </Row>
              </Col>
            </Row>
          </Panel.Body>
          <Panel.Footer>
            <ButtonToolbar>
              <Button disabled={!user.signedIn} bsStyle="primary" onClick={this.showModal}>Make an Offer</Button>
            </ButtonToolbar>
          </Panel.Footer>
        </Panel>
        <ListingOffers listingId={id} />

        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Post New Offer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={6} md={4} lg={3}>
                <Image src={listing.thumbnail} responsive />
              </Col>
              <Col xs={6} md={8} lg={9}>
                <p>{`Listing Id: ${listing.id}`}</p>
                <p>{`Listing Product: ${listing.productName}`}</p>
                <p>{`Product Count: ${listing.productCount}`}</p>
              </Col>
            </Row>
            <Form name="offerAdd">
              <h3>Offers</h3>
              <FormGroup>
                <Radio
                  name="offerType"
                  value="bell"
                  inline
                  onChange={this.onValueChange}
                  defaultChecked
                >
                  Bell
                </Radio>
                {' '}
                <Radio
                  name="offerType"
                  value="nmt"
                  inline
                  onChange={this.onValueChange}
                >
                  Nook Miles Ticket
                </Radio>
                {' '}
                <Radio
                  name="offerType"
                  value="wishlist"
                  inline
                  onChange={this.onValueChange}
                >
                  Wishlist Items
                </Radio>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Amount</ControlLabel>
                <FormControl name="productCount" type="number" autoFocus />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                type="button"
                bsStyle="primary"
                onClick={this.createNewOffer}
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

ListingDetail.contextType = UserContext;

const ListingDetailWithToast = withToast(withRouter(ListingDetail));
ListingDetailWithToast.fetchData = ListingDetail.fetchData;
ListingDetailWithToast.getAcnher = ListingDetail.getAcnher;

export default ListingDetailWithToast;
