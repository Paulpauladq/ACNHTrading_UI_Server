import {
  Tabs, Tab,
} from 'react-bootstrap';
import React from 'react';
import AcnherListings from '../listing/AcnherListings.jsx';
import AcnherOffers from '../offer/AcnherOffers.jsx';
import WishlistPanelGrid from '../wishlist/WishlistPanelGrid.jsx';

function ProfileTabBar(props) {
  const { acnher } = props;

  return (
    <React.Fragment>
      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Listings">
          <AcnherListings id={acnher.id} />
        </Tab>
        <Tab eventKey={2} title="Offers">
          <AcnherOffers id={acnher.id} />
        </Tab>
        <Tab eventKey={3} title="Wishlist">
          <WishlistPanelGrid wishlists={acnher.wishlist} />
        </Tab>
      </Tabs>
    </React.Fragment>
  );
}

export default ProfileTabBar;
