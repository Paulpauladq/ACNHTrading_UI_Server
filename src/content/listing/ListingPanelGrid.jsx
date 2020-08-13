import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Panel, Row, Col, Grid, Button, Thumbnail, ButtonToolbar,
} from 'react-bootstrap';

import UserContext from '../../script/UserContext.js';
import withToast from '../../component/withToast.jsx';
import graphQLFetch from '../../script/graphQLFetch.js';

// eslint-disable-next-line react/prefer-stateless-function
class ListingPanelPlain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: props.listing.status,
    };
    this.changeListingStatus = this.changeListingStatus.bind(this);
  }

  async changeListingStatus(newStatus) {
    const { showError, showSuccess, listing } = this.props;

    const changes = {
      status: newStatus,
    };
    const query = `mutation listingUpdate(
      $id: Int!
      $changes: ListingUpdateInputs!
    ) {
      listingUpdate(
        id: $id
        changes: $changes
      ) {
        id status
      }
    }`;

    const data = await graphQLFetch(query, { id: parseInt(listing.id, 10), changes }, showError);

    if (data) {
      this.setState({ status: data.listingUpdate.status });
      showSuccess('Change listing status successfully');
    }
  }

  render() {
    const {
      listing, showEditButton,
    } = this.props;

    const { status } = this.state;

    const editButtonVisibility = showEditButton ? 'visible' : 'invisible';
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
              <p>{`Status: ${status}`}</p>
              <p>{`Created: ${listing.created.toDateString()}`}</p>
            </Col>
          </Row>
        </Panel.Body>
        <Panel.Footer>
          <ButtonToolbar>
            <Button id="listing-detail-button" href={listingLocation.pathname}>Listing Detail</Button>
            <Button id="listing-close-button" className={editButtonVisibility} onClick={() => this.changeListingStatus('Closed')}>Close</Button>
            <Button id="listing-reopen-button" className={editButtonVisibility} onClick={() => this.changeListingStatus('New')}>Reopen</Button>
          </ButtonToolbar>
        </Panel.Footer>
      </Panel>
    );
  }
}

ListingPanelPlain.contextType = UserContext;
const ListingPanel = withRouter(withToast(ListingPanelPlain));
delete ListingPanel.contextType;

export default function ListingPanelGrid({ listings, showEditButton }) {
  const listingPanels = listings.map((listing, index) => (
    <Col key={listing.id} xs={12} md={6} lg={4}>
      <ListingPanel
        listing={listing}
        showEditButton={showEditButton}
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
