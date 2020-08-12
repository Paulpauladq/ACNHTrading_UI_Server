import {
  Tabs, Tab,
} from 'react-bootstrap';
import React from 'react';
import AcnherListing from '../listing/AcnherListing.jsx';

function ProfileTabBar(props) {
  const { id } = props;

  return (
    <React.Fragment>
      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Listings">
          <AcnherListing id={id} />
        </Tab>
        <Tab eventKey={2} title="Offers">
          Tab 2 content
        </Tab>
        <Tab eventKey={3} title="Wishlist">
          Tab 3 content
        </Tab>
      </Tabs>
    </React.Fragment>

  );
}

export default ProfileTabBar;
