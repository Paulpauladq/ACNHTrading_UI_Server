import React from 'react';
import {
  NavItem, Modal, Button, NavDropdown, MenuItem, Image,
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';
import graphQLFetch from '../script/graphQLFetch.js';
import withToast from './withToast.jsx';
import store from '../script/store.js';

class SigninNavItem extends React.Component {
  static async getAcnher(user) {
    const query = `query acnher(
      $lookup: String! 
      $lookupType: AcnherLookupType!
    ) {
      acnher(
        lookup: $lookup 
        lookupType: $lookupType
      ) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { lookup: `${user.email}`, lookupType: 'email' }, null);
    return data;
  }

  static async createNewAcnher(user) {
    const acnher = {
      email: user.email,
      nickname: user.givenName,
      villagerList: [],
      wishlist: [],
    };
    const query = `mutation acnherAdd($acnher: AcnherInputs!) {
        acnherAdd(acnher: $acnher) {
          id
        }
      }`;

    await graphQLFetch(query, { acnher }, null);
  }

  constructor(props) {
    super(props);
    const currentAcnher = store.initialData ? store.initialData.currentAcnher : null;
    delete store.initialData;

    this.state = {
      showing: false,
      disabled: true,
      currentAcnher,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientId) return;
    window.gapi.load('auth2', () => {
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init({ client_id: clientId }).then(() => {
          this.setState({ disabled: false });
        });
      }
    });

    const { currentAcnher } = this.state;
    if (currentAcnher == null) this.loadData();
  }

  async loadData() {
    const { user } = this.props;
    const data = await SigninNavItem.getAcnher(user);
    this.setState({ currentAcnher: data ? data.acnher : {} });
  }

  async signIn() {
    this.hideModal();
    const { showError } = this.props;
    let googleToken;
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      googleToken = googleUser.getAuthResponse().id_token;
    } catch (error) {
      showError(`Error authenticating with Google: ${error.error}`);
    }

    try {
      const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
      const response = await fetch(`${apiEndpoint}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ google_token: googleToken }),
      });
      const body = await response.text();
      const result = JSON.parse(body);
      const {
        signedIn, givenName, name, email,
      } = result;

      const { onUserChange } = this.props;
      onUserChange({
        signedIn, givenName, name, email,
      });

      const achner = await SigninNavItem.getAcnher(result);
      if (!achner) {
        await SigninNavItem.createNewAcnher(result);
      }
      this.loadData();
    } catch (error) {
      showError(`Error signing into the app: ${error}`);
    }
  }

  async signOut() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const { showError } = this.props;
    try {
      await fetch(`${apiEndpoint}/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      const auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut();
      const { onUserChange } = this.props;
      onUserChange({
        signedIn: false, givenName: '', name: '', email: '',
      });
      this.setState({ currentAcnher: {} });
    } catch (error) {
      showError(`Error signing out: ${error}`);
    }
  }

  showModal() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    const { showError } = this.props;
    if (!clientId) {
      showError('Missing environment variable GOOGLE_CLIENT_ID');
      return;
    }
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  render() {
    const { user } = this.props;
    if (user.signedIn) {
      const { currentAcnher } = this.state;
      if (currentAcnher == null) return null;

      return (
        <NavDropdown title={user.email} id="user-email">
          <MenuItem onClick={this.signOut}>Sign out</MenuItem>
          <LinkContainer to={`/profile/${currentAcnher.id}`}>
            <MenuItem>Profile</MenuItem>
          </LinkContainer>
        </NavDropdown>
      );
    }

    const { showing, disabled } = this.state;
    return (
      <>
        <NavItem onClick={this.showModal}>
          Sign in
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal} bsSize="sm">
          <Modal.Header closeButton>
            <Modal.Title>Sign in</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button
              block
              disabled={disabled}
              bsStyle="primary"
              onClick={this.signIn}
            >
              <Image src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png" alt="Sign In" />
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default withToast(SigninNavItem);
