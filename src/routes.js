import About from './content/About.jsx';
import Art from './content/product/Art.jsx';
import Photos from './content/product/Photos.jsx';
import Latest from './content/Latest.jsx';
import NotFound from './content/NotFound.jsx';
import Home from './content/Home.jsx';

const routes = [
  { path: '/products/art', component: Art },
  { path: '/products/photos', component: Photos },
  { path: '/about', component: About },
  { path: '/latest', component: Latest },
  { path: '/', component: Home },
  { path: '*', component: NotFound },
];

export default routes;
