import React from 'react';
import {
  Jumbotron, Button,
} from 'react-bootstrap';

function Home() {
  return (
    <React.Fragment>
      <Jumbotron id="home-jumb">
        <h1>
          Welcome To ACNH Trading
        </h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <Button bsStyle="primary">Learn more</Button>
        </p>
      </Jumbotron>
    </React.Fragment>
  );
}

export default Home;
