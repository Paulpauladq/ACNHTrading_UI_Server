import React from 'react';
import {
  Col, Panel, Image, Thumbnail,
  ButtonToolbar, Button, Row,
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

  constructor() {
    super();
    const listing = store.initialData ? store.initialData.listing : null;
    delete store.initialData;
    this.state = {
      listing,
    };
  }

  componentDidMount() {
    const { listing } = this.state;
    if (listing == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await ListingDetail.fetchData(match, null, showError);
    this.setState({ listing: data ? data.listing : {} });
  }

  render() {
    const { listing } = this.state;
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
    const title = `${listing.productCount} x ${listing.productName}`;
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
            <Panel.Title>{`${title}`}</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <Row>
              <Col xs={6} md={4} lg={3}>
                <Image src={listing.thumbnail} responsive />
              </Col>
              <Col xs={6} md={8} lg={9}>
                <p>{listing.sellerName}</p>
                <p className="text-muted">{listing.created.toDateString()}</p>
                <p>{listing.note}</p>
                <p className="text-muted">Price: </p>
                <Row>
                  {price}
                </Row>
              </Col>
            </Row>
          </Panel.Body>
          <Panel.Footer>
            <ButtonToolbar>
              <Button disabled={!user.signedIn} bsStyle="primary">Make an Offer</Button>
            </ButtonToolbar>
          </Panel.Footer>
        </Panel>

        <ListingOffers listingId={id} />
      </React.Fragment>
    );
  }
}

ListingDetail.contextType = UserContext;

const ListingDetailWithToast = withToast(ListingDetail);
ListingDetailWithToast.fetchData = ListingDetail.fetchData;

export default ListingDetailWithToast;
