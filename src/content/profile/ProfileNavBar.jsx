import { Button, ButtonGroup } from 'react-bootstrap';
import React from 'react';

function ProfileNavBar() {
  return (
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
  );
}

export default ProfileNavBar;
