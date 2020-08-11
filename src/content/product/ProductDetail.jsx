import React from 'react';
import {
  Col, Panel, Image,
  ButtonToolbar, Button, Row,
} from 'react-bootstrap';

import graphQLFetch from '../../script/graphQLFetch.js';
import withToast from '../../component/withToast.jsx';
import store from '../../script/store.js';
import UserContext from '../../script/UserContext.js';
import ProductListings from '../listing/ProductListings.jsx';

class ProductDetail extends React.Component {
  static async fetchData(match, showError) {
    const query = `query item($uniqueEntryId: String!) {
      item(uniqueEntryId: $uniqueEntryId) {
        name 
        sourceSheet 
        variants { 
          uniqueEntryId 
          image 
        }
      }
    }`;

    const { params: { id } } = match;
    const result = await graphQLFetch(query, { uniqueEntryId: id }, showError);
    return result;
  }

  constructor() {
    super();
    const item = store.initialData ? store.initialData.issue : null;
    delete store.initialData;
    this.state = {
      item,
    };
  }

  componentDidMount() {
    const { item } = this.state;
    if (item == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await ProductDetail.fetchData(match, showError);
    this.setState({ item: data ? data.item : {} });
  }

  render() {
    const { item } = this.state;
    if (item == null) return null;

    const prevLocation = { pathname: `/products/${item.sourceSheet}` };
    const { match: { params: { id } }, location: { search } } = this.props;
    const user = this.context;

    return (
      <div>
        <Panel>
          <Panel.Heading>
            <Panel.Title>{`${item.name}`}</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <Row>
              <Col xs={6} md={4} lg={3}>
                <Image src={item.variants[0].image} responsive />
              </Col>
              <Col xs={6} md={8} lg={9}>
                <p>{item.variants[0].uniqueEntryId}</p>
                <p>{item.sourceSheet}</p>
              </Col>
            </Row>
          </Panel.Body>
          <Panel.Footer>
            <ButtonToolbar>
              <Button disabled={!user.signedIn} bsStyle="primary">Add Listing</Button>
              <Button disabled={!user.signedIn} bsStyle="primary">Add to Wishlist</Button>
              <Button bsStyle="primary" href={prevLocation.pathname}>Back</Button>
            </ButtonToolbar>
          </Panel.Footer>
        </Panel>
        <ProductListings productId={id} location={search} />
      </div>
    );
  }
}

ProductDetail.contextType = UserContext;

const ProductDetailWithToast = withToast(ProductDetail);
ProductDetailWithToast.fetchData = ProductDetail.fetchData;

export default ProductDetailWithToast;
