import { Button, ButtonToolbar, Grid } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import React from 'react';

function CategoryNavBar() {
  return (
    <Grid fluid>
      <ButtonToolbar id="category-button-toolbar">
        <LinkContainer to="/listings/latest">
          <Button>Latest Listing</Button>
        </LinkContainer>
        <LinkContainer to="/products/art">
          <Button>Art</Button>
        </LinkContainer>
        <LinkContainer to="/products/photos">
          <Button>Photos</Button>
        </LinkContainer>
        <LinkContainer to="/products/posters">
          <Button>Posters</Button>
        </LinkContainer>
        <LinkContainer to="/products/tools">
          <Button>Tools</Button>
        </LinkContainer>
        <LinkContainer to="/products/fossils">
          <Button>Fossils</Button>
        </LinkContainer>
      </ButtonToolbar>
    </Grid>
  );
}

export default CategoryNavBar;
