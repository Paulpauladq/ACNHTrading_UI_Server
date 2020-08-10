import { Button, ButtonGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import React from 'react';

function ProfileNavBar() {
  return (
    <ButtonGroup>
      <LinkContainer to="/profile/listings">
        <Button>
          <i className="fas fa-list" />
          {' '}
          Listings
        </Button>
      </LinkContainer>
      <LinkContainer to="/profile/offers">
        <Button>
          <i className="fas fa-user-tag" />
          {' '}
          Offers
        </Button>
      </LinkContainer>
      <LinkContainer to="/profile/wishlists">
        <Button>
          <i className="fas fa-grin-hearts" />
          {' '}
          WishList
        </Button>
      </LinkContainer>
    </ButtonGroup>
  );
}

export default ProfileNavBar;
