import React from 'react';
import {
  Grid,
} from 'react-bootstrap';

import Contents from './Contents.jsx';
import UserContext from './script/UserContext.js';
import graphQLFetch from './script/graphQLFetch.js';
import store from './script/store.js';
import Footer from './component/Footer.jsx';
import CategoryNavBar from './component/CategoryNavBar.jsx';
import AcnhNavBar from './component/AcnhNavBar.jsx';

export default class Page extends React.Component {
  static async fetchData(cookie) {
    const query = `query { user {
      signedIn givenName name email
    }}`;
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  constructor(props) {
    super(props);
    const user = store.userData ? store.userData.user : null;
    delete store.userData;
    this.state = { user };

    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const { user } = this.state;
    if (user == null) {
      const data = await Page.fetchData();
      this.setState({ user: data.user });
    }
  }

  onUserChange(user) {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    if (user == null) return null;

    return (
      <div>
        <AcnhNavBar user={user} onUserChange={this.onUserChange} />
        <CategoryNavBar />
        <br />
        <Grid fluid>
          <UserContext.Provider value={user}>
            <Contents />
          </UserContext.Provider>
        </Grid>
        <Footer />
      </div>
    );
  }
}
