import {
  Col, Glyphicon, MenuItem, Nav, Navbar, NavDropdown, NavItem,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import React from 'react';
import Search from './Search.jsx';
import SignInNavItem from './SignInNavItem.jsx';

export default function AcnhNavBar({ user, onUserChange }) {
  return (
    <Navbar id="user-navbar" fluid>
      <Navbar.Header>
        <Navbar.Brand id="brand-nav-item">ACNH Trading</Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer exact to="/">
          <NavItem id="home-nav-item">Home</NavItem>
        </LinkContainer>
      </Nav>
      <Col sm={5}>
        <Navbar.Form>
          <Search />
        </Navbar.Form>
      </Col>
      <Nav pullRight>
        <SignInNavItem user={user} onUserChange={onUserChange} />
        <NavDropdown
          id="user-dropdown"
          title={<Glyphicon glyph="option-vertical" />}
          noCaret
        >
          <LinkContainer to="/about">
            <MenuItem>About</MenuItem>
          </LinkContainer>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}
