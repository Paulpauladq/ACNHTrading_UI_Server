import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Panel, Row, Col, Grid, Button, Thumbnail,
} from 'react-bootstrap';

import UserContext from '../../script/UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class ListingPanelPlain extends React.Component {
  render() {
    const {
      listing, hidden,
    } = this.props;

    const editButtonVisibility = hidden ? 'invisible' : 'visible';
    const listingLocation = { pathname: `/listings/details/${listing.id}` };
    const productLocation = { pathname: `/products/details/${listing.productId}` };
    const title = `${listing.productCount} x ${listing.productName}`;

    return (
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title>{title}</Panel.Title>
        </Panel.Heading>
        <Panel.Body id="listing-panel-body">
          <Row>
            <Col xs={6} md={4} lg={3}>
              <Thumbnail className="img-fluid img-thumbnail" href={productLocation.pathname} src={listing.thumbnail} />
            </Col>
            <Col xs={6} md={8} lg={9}>
              <p>{`Seller: ${listing.sellerName}`}</p>
              <p>{`Notes: ${listing.note}`}</p>
              <p>{`Created: ${listing.created.toDateString()}`}</p>
            </Col>
          </Row>
        </Panel.Body>
        <Panel.Footer>
          <Button id="listing-detail-button" href={listingLocation.pathname}>Listing Detail</Button>
          {' '}
          {/* TODO: add remove function */}
          <Button id="listing-delete-button" className={editButtonVisibility} href={listingLocation.pathname}>Remove</Button>
        </Panel.Footer>
      </Panel>
    );
  }
}

ListingPanelPlain.contextType = UserContext;
const ListingPanel = withRouter(ListingPanelPlain);
delete ListingPanel.contextType;

export default function ListingPanelGrid({ listings, hidden }) {
  const listingPanels = listings.map((listing, index) => (
    <Col xs={12} md={6} lg={4}>
      <ListingPanel
        key={listing.id}
        listing={listing}
        hidden={hidden}
        index={index}
      />
    </Col>
  ));

  return (
    <Grid>
      <Row>
        {listingPanels}
      </Row>
    </Grid>
  );
}
