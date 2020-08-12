import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Panel, Row, Col, Grid, Image, Button,
} from 'react-bootstrap';

import UserContext from '../../script/UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class ListingPanelPlain extends React.Component {
  render() {
    const {
      listing,
    } = this.props;

    const selectLocation = { pathname: `/listings/details/${listing.id}` };
    const title = `${listing.productCount} x ${listing.productName}`;

    return (
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title>{title}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Row>
            <Col xs={6} md={4} lg={3}>
              <Image src={listing.thumbnail} className="img-responsive" />
            </Col>
            <Col xs={6} md={8} lg={9}>
              <p>{listing.sellerName}</p>
              <p>{listing.note}</p>
              <p>{listing.created.toDateString()}</p>
            </Col>
          </Row>
        </Panel.Body>
        <Panel.Footer>
          <Button bsStyle="primary" href={selectLocation.pathname}>View Detail</Button>
        </Panel.Footer>
      </Panel>
    );
  }
}

ListingPanelPlain.contextType = UserContext;
const ListingPanel = withRouter(ListingPanelPlain);
delete ListingPanel.contextType;

export default function ListingPanelGrid({ listings }) {
  const listingPanels = listings.map((listing, index) => (
    <Col xs={12} md={6} lg={4}>
      <ListingPanel
        key={listing.id}
        listing={listing}
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
