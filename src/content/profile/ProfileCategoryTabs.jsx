import React from 'react';
import {
  Nav, NavItem,
} from 'react-bootstrap';

export default function ProfileCategoryTabs() {
  return (
    <Nav bsStyle="pills" stacked>
      <NavItem eventKey="first">Arts</NavItem>
      <NavItem eventKey="second">Photos</NavItem>
      <NavItem eventKey="third">Posters</NavItem>
      <NavItem eventKey="fourth">Tools</NavItem>
      <NavItem eventKey="fifth">Fossils</NavItem>
    </Nav>
  );
}
