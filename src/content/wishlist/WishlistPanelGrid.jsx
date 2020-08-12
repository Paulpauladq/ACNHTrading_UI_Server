import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Panel, Row, Col, Grid, Button, Thumbnail,
} from 'react-bootstrap';

import UserContext from '../../script/UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class WishlistPanelPlain extends React.Component {
  render() {
    const {
      wishlist, disabled,
    } = this.props;

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
          <Button bsStyle="primary" onClick={null} disabled={disabled}>Delete</Button>
        </Panel.Footer>
      </Panel>
    );
  }
}

WishlistPanelPlain.contextType = UserContext;
const WishlistPanel = withRouter(WishlistPanelPlain);
delete WishlistPanel.contextType;

export default function WishlistPanelGrid({ wishlists, disabled }) {
  const wishlistsPanels = wishlists.map((wishlist, index) => (
    <Col xs={12} md={6} lg={4}>
      <WishlistPanel
        key={wishlist.uniqueEntryId}
        wishlist={wishlist}
        disabled={disabled}
        index={index}
      />
    </Col>
  ));

  if (wishlists.length === 0) return <h3>There is currently nothing in your wishlist</h3>;

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
