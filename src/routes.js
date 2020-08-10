import About from './content/About.jsx';
import Profile from './content/profile/Profile.jsx';
import Art from './content/product/Art.jsx';
import Photos from './content/product/Photos.jsx';
import Posters from './content/product/Posters.jsx';
import Tools from './content/product/Tools.jsx';
import Fossils from './content/product/Fossils.jsx';
import ProductDetail from './content/product/ProductDetail.jsx';
import LatestListings from './content/listing/LatestListings.jsx';
import NotFound from './content/NotFound.jsx';
import Home from './content/Home.jsx';

const routes = [
  { path: '/products/details/:id', component: ProductDetail },
  { path: '/products/art', component: Art },
  { path: '/products/photos', component: Photos },
  { path: '/products/posters', component: Posters },
  { path: '/products/tools', component: Tools },
  { path: '/products/fossils', component: Fossils },
  { path: '/listings/latest', component: LatestListings },
  { path: '/profile', component: Profile },
  { path: '/about', component: About },
  { path: '/', component: Home },
  { path: '*', component: NotFound },
];

export default routes;
