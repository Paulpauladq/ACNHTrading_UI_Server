import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Panel, Row, Col, Grid, Thumbnail, Button, ButtonToolbar,
} from 'react-bootstrap';

import listingPriceImage from '../../script/listingPriceImage.js';
import UserContext from '../../script/UserContext.js';
import withToast from '../../component/withToast.jsx';
import graphQLFetch from '../../script/graphQLFetch.js';

// eslint-disable-next-line react/prefer-stateless-function
class OfferPanelPlain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: props.offer.status,
    };
    this.changeOfferStatus = this.changeOfferStatus.bind(this);
  }

  async changeOfferStatus(newStatus) {
    const { showError, showSuccess, offer } = this.props;

    const changes = {
      status: newStatus,
    };
    const query = `mutation offerUpdate(
      $id: Int!
      $changes: OfferUpdateInputs!
    ) {
      offerUpdate(
        id: $id
        changes: $changes
      ) {
        id status
      }
    }`;

    const data = await graphQLFetch(query, { id: parseInt(offer.id, 10), changes }, showError);

    if (data) {
      this.setState({ status: data.offerUpdate.status });
      showSuccess('Change offer status successfully');
    }
  }

  render() {
    const {
      offer, showEditButton,
    } = this.props;

    const { status } = this.state;

    const editButtonVisibility = showEditButton ? 'visible' : 'invisible';
    const buyerLocation = { pathname: `/profile/${offer.buyerId}` };
    const listingLocation = { pathname: `/listings/details/${offer.listingId}` };

    let image;
    if (offer.productId === 'bell') {
      image = listingPriceImage.bell;
    } else if (offer.productId === 'nmt') {
      image = listingPriceImage.nmt;
    } else {
      image = listingPriceImage.wishlist;
    }

    return (
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title>
            <a href={listingLocation.pathname}>
              {`Listing id: ${offer.listingId}`}
            </a>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Row>
            <Col xs={6} md={4} lg={3}>
              <Thumbnail src={image} alt="10x10" />
              {` x ${offer.productCount}`}
            </Col>
            <Col xs={6} md={8} lg={9}>
              <p>{`Status: ${status}`}</p>
              <p>{`Created: ${offer.created.toDateString()}`}</p>
            </Col>
          </Row>
        </Panel.Body>
        <Panel.Footer>
          <ButtonToolbar>
            <Button id="buyer-detail-button" href={buyerLocation.pathname}>Buyer Information</Button>
            <Button id="offer-accept-button" className={editButtonVisibility} onClick={() => this.changeOfferStatus('Accepted')}>Accepted</Button>
            <Button id="offer-reject-button" className={editButtonVisibility} onClick={() => this.changeOfferStatus('Rejected')}>Rejected</Button>
          </ButtonToolbar>
        </Panel.Footer>
      </Panel>
    );
  }
}

OfferPanelPlain.contextType = UserContext;
const OfferPanel = withRouter(withToast(OfferPanelPlain));
delete OfferPanel.contextType;

export default function OfferPanelGrid({ offers, showEditButton }) {
  const offerPanels = offers.map((offer, index) => (
    <Col key={offer.id} xs={12} md={6} lg={4}>
      <OfferPanel
        offer={offer}
        showEditButton={showEditButton}
        index={index}
      />
    </Col>
  ));

  return (
    <Grid>
      <Row>
        {offerPanels}
      </Row>
    </Grid>
  );
}
