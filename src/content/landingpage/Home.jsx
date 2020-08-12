import React from 'react';
import {
  Jumbotron, Button, Carousel, Image,
} from 'react-bootstrap';
import {
  Link,
} from 'react-router-dom';

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
            <h3>5-Star Design Showcase 1</h3>
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
            <h3>5-Star Design Showcase 2</h3>
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
            <h3>5-Star Design Showcase 3</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      ;
    </React.Fragment>
  );
}

export default Home;
