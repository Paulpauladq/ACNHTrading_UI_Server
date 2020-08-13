import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Panel, Row, Col, Grid, Button, Thumbnail,
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

import UserContext from '../../script/UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class WishlistPanelPlain extends React.Component {
  render() {
    const {
      wishlist, showEditButton,
    } = this.props;

    const editButtonVisibility = showEditButton ? 'visible' : 'invisible';
    const selectLocation = { pathname: `/products/details/${wishlist.uniqueEntryId}` };

    return (
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title>{wishlist.itemName}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Thumbnail href={selectLocation.pathname} src={wishlist.thumbnail} />
        </Panel.Body>
        <Panel.Footer>
          {/* TODO: add onclick and verify user */}
          <Button bsStyle="primary" onClick={null} className={editButtonVisibility}>Delete</Button>
        </Panel.Footer>
      </Panel>
    );
  }
}

WishlistPanelPlain.contextType = UserContext;
const WishlistPanel = withRouter(WishlistPanelPlain);
delete WishlistPanel.contextType;

export default function WishlistPanelGrid({ acnher, showEditButton }) {
  const wishlistsPanels = acnher.wishlist.map((wishlist, index) => (
    <Col key={uuidv4()} xs={12} md={6} lg={4}>
      <WishlistPanel
        wishlist={wishlist}
        showEditButton={showEditButton}
        index={index}
      />
    </Col>
  ));

  if (acnher.wishlist.length === 0) return <h3>There is currently nothing in your wishlist</h3>;

  return (
    <React.Fragment>
      <h3>Current Wishlist Items</h3>
      <Grid>
        <Row>
          {wishlistsPanels}
        </Row>
      </Grid>
    </React.Fragment>
  );
}
