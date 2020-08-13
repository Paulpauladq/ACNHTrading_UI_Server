import React from 'react';
import { withRouter } from 'react-router-dom';
import URLSearchParams from 'url-search-params';
import { Pagination } from 'react-bootstrap';

import ListingPanelGrid from './ListingPanelGrid.jsx';

import graphQLFetch from '../../script/graphQLFetch.js';
import withToast from '../../component/withToast.jsx';
import store from '../../script/store.js';
import PageLink from '../../util/PageLink.jsx';

const SECTION_SIZE = 5;

class AcnherListings extends React.Component {
  static async fetchData(sellerId, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { sellerId };

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const query = `query listingList(
      $status: ListingStatus
      $sellerId: Int
      $page: Int
    ) {
      listingList(
        status: $status
        sellerId: $sellerId
        page: $page
      ) {
        listings {
          id status sellerId sellerName 
          productId productName productCount 
          thumbnail created note 
          priceList {
            productId productCount
          }
        }
        pages
      }
    }`;

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const initialData = store.initialData || { listingList: {} };
    const {
      listingList: { listings, pages },
    } = initialData;
    delete store.initialData;
    this.state = {
      listings,
      pages,
    };
  }

  componentDidMount() {
    const { listings } = this.state;
    if (listings == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  async loadData() {
    const { showError, acnher } = this.props;
    const data = await AcnherListings.fetchData(parseInt(acnher.id, 10), null, showError);
    if (data) {
      this.setState({
        listings: data.listingList.listings,
        pages: data.listingList.pages,
      });
    }
  }

  render() {
    const { listings } = this.state;
    if (listings == null) return null;

    if (listings.length === 0) return <h3>There is currently no listing</h3>;

    const { pages } = this.state;
    const { location: { search }, showEditButton } = this.props;

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
        <h3>Current Listings</h3>
        <ListingPanelGrid
          listings={listings}
          showEditButton={showEditButton}
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

const AcnherListingWithToast = withToast(withRouter(AcnherListings));
AcnherListingWithToast.fetchData = AcnherListings.fetchData;

export default AcnherListingWithToast;
