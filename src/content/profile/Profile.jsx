import React from 'react';
import {
  Button, ButtonToolbar, Col, Panel, Row, OverlayTrigger, Modal, Tooltip,
  Form, FormGroup, ControlLabel, FormControl,
} from 'react-bootstrap';
import store from '../../script/store.js';
import withToast from '../../component/withToast.jsx';
import graphQLFetch from '../../script/graphQLFetch.js';
import UserContext from '../../script/UserContext.js';

class Profile extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query acnher(
      $lookup: String! 
      $lookupType: AcnherLookupType!
    ) {
      acnher(
        lookup: $lookup 
        lookupType: $lookupType
      ) {
        id email nickname switchId islandName
        villagerList wishlist created
      }
    }`;

    const { params: { id } } = match;
    const data = await graphQLFetch(query, { lookup: `${id}`, lookupType: 'id' }, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const acnher = store.initialData ? store.initialData.acnher : null;
    delete store.initialData;
    this.state = {
      acnher,
      showing: false,
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { acnher } = this.state;
    if (acnher == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal();
    const form = document.forms.ProfileEdit;
    const changes = {
      nickname: form.nickname.value,
      switchId: form.switchId.value,
      islandName: form.islandName.value,
    };
    const { acnher: { id } } = this.state;
    const query = `mutation acnherUpdate(
      $id: Int!
      $changes: AcnherUpdateInputs!
    ) {
      acnherUpdate(
        id: $id
        changes: $changes
      ) {
        id email nickname switchId
        islandName villagerList wishlist created
      }
    }`;

    const data = await graphQLFetch(query, { id: parseInt(id, 10), changes });

    if (data) {
      this.setState({ acnher: data.acnherUpdate });
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await Profile.fetchData(match, null, showError);
    this.setState({ acnher: data ? data.acnher : {} });
  }

  render() {
    const { acnher } = this.state;
    const { showing } = this.state;
    if (acnher == null) return null;

    const { acnher: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    // TODO: Fix here!!!
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Acnher with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const user = this.context;
    const disabled = !user.signedIn || (user.email !== acnher.email);

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>User Profile Page</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Row>
            <Col xs={6} md={4} lg={3}>
              <p>{acnher.id}</p>
              <p>{acnher.email}</p>
              <p>{acnher.created.toDateString()}</p>
            </Col>
            <Col xs={6} md={8} lg={9}>
              <p className="text-muted">Editable: </p>
              <p>{acnher.nickname}</p>
              <p>{acnher.switchId}</p>
              <p>{acnher.islandName}</p>
              <p>{acnher.villagerList}</p>
              <p>{acnher.wishlist}</p>
            </Col>
          </Row>
        </Panel.Body>
        <Panel.Footer>
          <OverlayTrigger
            placement="right"
            delayShow={1000}
            overlay={<Tooltip id="create-issue">Edit Profile</Tooltip>}
          >
            <Button disabled={disabled} bsStyle="primary" onClick={this.showModal}>
              Edit
            </Button>
          </OverlayTrigger>

          <Modal keyboard show={showing} onHide={this.hideModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form name="ProfileEdit">
                <FormGroup>
                  <ControlLabel>
                    <i className="fas fa-swimmer" />
                    {' '}
                    Nickname
                  </ControlLabel>
                  <FormControl name="nickname" autoFocus />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    <i className="fab fa-nintendo-switch fa-spin" />
                    {' '}
                    SwitchId
                  </ControlLabel>
                  <FormControl name="switchId" />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    <i className="fas fa-tree" />
                    {' '}
                    IslandName
                  </ControlLabel>
                  <FormControl name="islandName" />
                </FormGroup>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <ButtonToolbar>
                <Button
                  type="button"
                  bsStyle="primary"
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
                <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
              </ButtonToolbar>
            </Modal.Footer>
          </Modal>
        </Panel.Footer>
      </Panel>
    );
  }
}

Profile.contextType = UserContext;

const ProfileWithToast = withToast(Profile);
ProfileWithToast.fetchData = Profile.fetchData;

export default ProfileWithToast;
