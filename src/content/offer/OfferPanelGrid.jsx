import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Panel, Row, Col, Grid, Thumbnail,
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

    return (
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title>{offer.id}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Row>
            <Col xs={1}>
              <Thumbnail src={image} alt="10x10" />
              {` x ${offer.productCount}`}
            </Col>
            <Col xsOffset={3} xs={8}>
              <p>{`Status: ${offer.status}`}</p>
              <p>{`BuyerId: ${offer.buyerId}`}</p>
            </Col>
          </Row>
        </Panel.Body>
        <Panel.Footer>
          <p>{offer.created.toDateString()}</p>
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
    <OfferPanel
      key={offer.id}
      offer={offer}
      index={index}
    />
  ));

  return (
    <Grid>
      <Row>
        {offerPanels}
      </Row>
    </Grid>
  );
}
