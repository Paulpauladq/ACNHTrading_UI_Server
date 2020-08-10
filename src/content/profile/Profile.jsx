import React from 'react';
import { Redirect } from 'react-router-dom';
import store from '../../script/store.js';
import withToast from '../../component/withToast.jsx';
import graphQLFetch from '../../script/graphQLFetch.js';
import UserContext from '../../script/UserContext.js';

class Profile extends React.Component {
  static async fetchData(email, showError) {
    const query = `query acnher($email: String!) {
      acnher(email: $email) {
        id email nickname switchId islandName
        villagerList wishlist created
      }
    }`;

    const data = await graphQLFetch(query, { email: `${email}` }, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const acnher = store.initialData ? store.initialData.acnher : null;
    delete store.initialData;
    this.state = { acnher };
  }

  async componentDidMount() {
    const user = this.context;
    const { acnher } = this.state;
    if (acnher == null) this.loadData(user.email);
  }

  async loadData(email) {
    const { showError } = this.props;
    const data = await Profile.fetchData(email, showError);
    if (data) {
      this.setState({ acnher: data.acnher });
    }
  }

  render() {
    const user = this.context;

    if (!user.signedIn) {
      return (
        <Redirect to="/" />
      );
    }

    const { acnher } = this.state;
    if (acnher == null) return null;

    return (
      <div className="text-center">
        <h3>User Profile Page</h3>
        <h4>
          {acnher.id}
        </h4>
        <p>{user.givenName}</p>
        <p>{user.email}</p>
      </div>
    );
  }
}

Profile.contextType = UserContext;

const ProfileWithToast = withToast(Profile);
ProfileWithToast.fetchData = Profile.fetchData;

export default ProfileWithToast;
