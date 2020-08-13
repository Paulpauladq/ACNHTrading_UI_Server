import React from 'react';
import {
  Jumbotron, Button, Carousel, Image, Grid, Row, Col,
} from 'react-bootstrap';

function Home() {
  return (
    <React.Fragment>
      <Jumbotron id="home-jumb">
        <h1>
          Welcome To ACNH Trading
        </h1>
        <p>
          This is a platform where you could trade Animal Crossing items! Please enjoy! : )
        </p>
        <p>
          <Button>Learn more</Button>
        </p>
      </Jumbotron>
      <div>
        <h1 id="landing-page-h1">
          Browse by Category
        </h1>
        <Grid align="center">
          <Row>
            <Col lg={2} xs={6} md={4}>
              <Image src="https://acnhcdn.com/latest/FtrIcon/FtrBearS_Remake_0_3.png" circle />
              <h3 id="latest-h3">Latest</h3>
            </Col>
            <Col id="art-col" lg={2} xs={6} md={4}>
              <Image id="art-img" src="https://acnhcdn.com/latest/FtrIcon/FtrSculptureDiskobolos.png" circle />
              <h3 id="art-h3">Arts</h3>
            </Col>
            <Col lg={2} xs={6} md={4}>
              <Image id="photo-img" src="https://acnhcdn.com/latest/FtrIcon/BromideNpcNmlCat19_Remake_3_0.png" circle />
              <h3 id="photo-h3">Photos</h3>
            </Col>
            <Col lg={2} xs={6} md={4}>
              <Image id="poster-img" src="https://acnhcdn.com/latest/FtrIcon/PosterNpcNmlSqu17.png" circle />
              <h3 id="poster-h3">Posters</h3>
            </Col>
            <Col lg={2} xs={6} md={4}>
              <Image id="tool-img" src="https://acnhcdn.com/latest/FtrIcon/ToolNetPattern_Remake_4_0.png" circle />
              <h3 id="tool-h3">Tools</h3>
            </Col>
            <Col lg={2} xs={6} md={4}>
              <Image id="fossil-img" src="https://acnhcdn.com/latest/FtrIcon/FtrFossilTRexA.png" circle />
              <h3 id="fossil-h3">Fossils</h3>
            </Col>
          </Row>
        </Grid>
      </div>
      <div>
        <h1 id="landing-showcase-h1">
          Showcase Islands
        </h1>
        <Carousel>
          <Carousel.Item>

            <Image
              width={900}
              height={500}
              alt="900x500"
              src="https://i.ytimg.com/vi/Y1RGAktgTpw/maxresdefault.jpg"
              onClick={() => window.open('https://www.youtube.com/watch?v=FukxbM4iM4M', '_blank')}
            />

            <Carousel.Caption>
              <h3>Kalani Island Tour by Tagback TV</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Image
              width={900}
              height={500}
              alt="900x500"
              src="https://i.ytimg.com/vi/ldmYoPLKiWo/maxresdefault.jpg"
              onClick={() => window.open('https://www.youtube.com/watch?v=ldmYoPLKiWo', '_blank')}
            />
            <Carousel.Caption>
              <h3>5-Star Island Tour by Tagback TV</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Image
              width={900}
              height={500}
              alt="900x500"
              src="https://i.ytimg.com/vi/FukxbM4iM4M/maxresdefault.jpg"
              onClick={() => window.open('https://www.youtube.com/watch?v=FukxbM4iM4M', '_blank')}
            />
            <Carousel.Caption>
              <h3>No Time Travel Island Tour by Tagback TV</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </React.Fragment>
  );
}

export default Home;
