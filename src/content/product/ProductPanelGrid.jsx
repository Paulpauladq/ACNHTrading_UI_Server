import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Panel, Row, Col, Grid, Image, Button, Thumbnail,
} from 'react-bootstrap';

import UserContext from '../../script/UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class ProductPanelPlain extends React.Component {
  render() {
    const {
      product,
    } = this.props;

    const selectLocation = { pathname: `/products/details/${product.variants[0].uniqueEntryId}` };

    return (
      <Panel id="ProductPanelOutter" bsStyle="primary">
        <Panel.Heading id="ProductPanelHeading">
          <Panel.Title>{product.name}</Panel.Title>
        </Panel.Heading>
        <Panel.Body id="ProductPanel">
          <Thumbnail id="ProductImg" className="img-fluid img-thumbnail" href={selectLocation.pathname} src={product.variants[0].image} />
        </Panel.Body>
        <Panel.Footer id="ProductPanelFooter" className="text-center">
          {`Variation Count: ${product.variants.length}`}
        </Panel.Footer>
      </Panel>
    );
  }
}

ProductPanelPlain.contextType = UserContext;
const ProductPanel = withRouter(ProductPanelPlain);
delete ProductPanel.contextType;

export default function ProductPanelGrid({ products }) {
  const productPanels = products.map((product, index) => (
    <Col xs={6} md={4} lg={3}>
      <ProductPanel
        key={product.variants[0].uniqueEntryId}
        product={product}
        index={index}
      />
    </Col>
  ));

  return (
    <Grid>
      <Row>
        {productPanels}
      </Row>
    </Grid>
  );
}
