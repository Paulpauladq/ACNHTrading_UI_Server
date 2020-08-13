import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Panel, Row, Col, Grid, Button, Thumbnail,
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

import UserContext from '../../script/UserContext.js';
import withToast from '../../component/withToast.jsx';
import graphQLFetch from '../../script/graphQLFetch.js';

// eslint-disable-next-line react/prefer-stateless-function
class WishlistPanelPlain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
    };
    this.deleteWishlistItem = this.deleteWishlistItem.bind(this);
  }

  async deleteWishlistItem() {
    const {
      showError, showSuccess, wishlist, acnher,
    } = this.props;

    const index = acnher.wishlist.findIndex(item => item.uniqueEntryId === wishlist.uniqueEntryId);
    const newWishlist = [...acnher.wishlist];
    newWishlist.splice(index, 1);

    const changes = {
      wishlist: newWishlist,
    };
    const query = `mutation acnherUpdate(
      $id: Int!
      $changes: AcnherUpdateInputs!
    ) {
      acnherUpdate(
        id: $id
        changes: $changes
      ) {
        id email nickname switchId 
        islandName villagerList created 
        wishlist {
          uniqueEntryId itemName thumbnail
        }
      }
    }`;

    const data = await graphQLFetch(query, { id: parseInt(acnher.id, 10), changes }, showError);

    if (data) {
      this.setState({ deleted: true });
      showSuccess('Delete item successfully...');
    }
  }

  render() {
    const { deleted } = this.state;
    if (deleted) {
      return null;
    }

    const { wishlist, showEditButton } = this.props;
    const editButtonVisibility = showEditButton ? 'visible' : 'invisible';
    const selectLocation = { pathname: `/products/details/${wishlist.uniqueEntryId}` };

    return (
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title>{wishlist.itemName}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Thumbnail
            href={selectLocation.pathname}
            src={wishlist.thumbnail}
          />
        </Panel.Body>
        <Panel.Footer>
          <Button bsStyle="primary" onClick={this.deleteWishlistItem} className={editButtonVisibility}>Delete</Button>
        </Panel.Footer>
      </Panel>
    );
  }
}

WishlistPanelPlain.contextType = UserContext;
const WishlistPanel = withRouter(withToast(WishlistPanelPlain));
delete WishlistPanel.contextType;

export default function WishlistPanelGrid({ acnher, showEditButton }) {
  const wishlistsPanels = acnher.wishlist.map((wishlist, index) => (
    <Col key={uuidv4()} xs={12} md={6} lg={4}>
      <WishlistPanel
        acnher={acnher}
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
