import About from './content/About.jsx';
import Art from './content/product/Art.jsx';
import Photos from './content/product/Photos.jsx';
import Posters from './content/product/Posters.jsx';
import Tools from './content/product/Tools.jsx';
import Fossils from './content/product/Fossils.jsx';
import Latest from './content/Latest.jsx';
import NotFound from './content/NotFound.jsx';
import Home from './content/Home.jsx';

const routes = [
  { path: '/products/art', component: Art },
  { path: '/products/photos', component: Photos },
  { path: '/products/posters', component: Posters },
  { path: '/products/tools', component: Tools },
  { path: '/products/fossils', component: Fossils },
  { path: '/about', component: About },
  { path: '/latest', component: Latest },
  { path: '/', component: Home },
  { path: '*', component: NotFound },
];

export default routes;
