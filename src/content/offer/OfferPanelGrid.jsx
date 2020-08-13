import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Panel, Row, Col, Grid, Thumbnail, Button,
} from 'react-bootstrap';

import listingPriceImage from '../../script/listingPriceImage.js';
import UserContext from '../../script/UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class OfferPanelPlain extends React.Component {
  render() {
    const {
      offer,
    } = this.props;

    let image;
    if (offer.productId === 'bell') {
      image = listingPriceImage.bell;
    } else if (offer.productId === 'nmt') {
      image = listingPriceImage.nmt;
    } else {
      image = listingPriceImage.wishlist;
    }

    const buyerLocation = { pathname: `/profile/${offer.buyerId}` };
    const listingLocation = { pathname: `/listings/details/${offer.listingId}` };

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
              <p>{`Status: ${offer.status}`}</p>
              <p>{`Created: ${offer.created.toDateString()}`}</p>
            </Col>
          </Row>
        </Panel.Body>
        <Panel.Footer>
          <Button href={buyerLocation.pathname}>Buyer Information</Button>
        </Panel.Footer>
      </Panel>
    );
  }
}

OfferPanelPlain.contextType = UserContext;
const OfferPanel = withRouter(OfferPanelPlain);
delete OfferPanel.contextType;

export default function OfferPanelGrid({ offers }) {
  const offerPanels = offers.map((offer, index) => (
    <Col key={offer.id} xs={12} md={6} lg={4}>
      <OfferPanel
        offer={offer}
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
