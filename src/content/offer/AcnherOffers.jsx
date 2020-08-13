import React from 'react';
import { withRouter } from 'react-router-dom';
import URLSearchParams from 'url-search-params';
import { Pagination } from 'react-bootstrap';

import OfferPanelGrid from './OfferPanelGrid.jsx';

import graphQLFetch from '../../script/graphQLFetch.js';
import withToast from '../../component/withToast.jsx';
import store from '../../script/store.js';
import PageLink from '../../util/PageLink.jsx';

const SECTION_SIZE = 5;

class AcnherOffers extends React.Component {
  static async fetchData(sellerId, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { sellerId };

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const query = `query offerList(
      $sellerId: Int
      $page: Int
    ) {
      offerList(
        sellerId: $sellerId
        page: $page
      ) {
        offers {
          id status listingId sellerId buyerId 
          productId productCount created
        }
        pages
      }
    }`;

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const initialData = store.initialData || { offerList: {} };
    const {
      offerList: { offers, pages },
    } = initialData;
    delete store.initialData;
    this.state = {
      offers,
      pages,
    };
  }

  componentDidMount() {
    const { offers } = this.state;
    if (offers == null) this.loadData();
  }

  async loadData() {
    const { showError, acnher } = this.props;
    const data = await AcnherOffers.fetchData(parseInt(acnher.id, 10), null, showError);
    if (data) {
      this.setState({
        offers: data.offerList.offers,
        pages: data.offerList.pages,
      });
    }
  }

  render() {
    const { offers } = this.state;
    if (offers == null) return null;

    if (offers.length === 0) return <h3>There is currently no offer</h3>;

    const { pages } = this.state;
    const { location: { search } } = this.props;

    const params = new URLSearchParams(search);
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
    const endPage = startPage + SECTION_SIZE - 1;
    const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
    const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;

    const pageItems = [];
    for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
      params.set('page', i);
      pageItems.push((
        <PageLink key={i} params={params} activePage={page} page={i}>
          <Pagination.Item>{i}</Pagination.Item>
        </PageLink>
      ));
    }

    return (
      <React.Fragment>
        <h3>Current Offers</h3>
        <OfferPanelGrid
          offers={offers}
        />
        <Pagination>
          <PageLink params={params} page={prevSection}>
            <Pagination.Item>{'<'}</Pagination.Item>
          </PageLink>
          {pageItems}
          <PageLink params={params} page={nextSection}>
            <Pagination.Item>{'>'}</Pagination.Item>
          </PageLink>
        </Pagination>
      </React.Fragment>
    );
  }
}

const AcnherOffersWithToast = withToast(withRouter(AcnherOffers));
AcnherOffersWithToast.fetchData = AcnherOffers.fetchData;

export default AcnherOffersWithToast;
