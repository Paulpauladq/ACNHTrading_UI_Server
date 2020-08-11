import {
  Button, ButtonGroup, Tabs, Tab,
} from 'react-bootstrap';
import React from 'react';
import AcnherListing from '../listing/AcnherListing.jsx';

function ProfileNavBar(props) {
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
      <ButtonGroup>
        <Button>
          <i className="fas fa-list" />
          {' '}
          Listings
        </Button>


        <Button>
          <i className="fas fa-user-tag" />
          {' '}
          Offers
        </Button>


        <Button>
          <i className="fas fa-grin-hearts" />
          {' '}
          WishList
        </Button>

      </ButtonGroup>
    </React.Fragment>

  );
}

export default ProfileNavBar;
