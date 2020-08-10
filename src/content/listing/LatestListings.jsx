import React from 'react';
import URLSearchParams from 'url-search-params';
import { Pagination } from 'react-bootstrap';

import ListingPanelGrid from './ListingPanelGrid.jsx';

import graphQLFetch from '../../script/graphQLFetch.js';
import withToast from '../../component/withToast.jsx';
import store from '../../script/store.js';
import PageLink from '../../util/PageLink.jsx';

const SECTION_SIZE = 24;

class LatestListings extends React.Component {
  static async fetchData(search, showError) {
    const params = new URLSearchParams(search);
    const vars = { status: 'New' };

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const query = `query listingList(
      $status: ListingStatus
      $search: String
      $page: Int
    ) {
      listingList(
        status: $status
        search: $search
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

  constructor() {
    super();
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
    const {
      location: { search: prevSearch },
    } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, showError } = this.props;
    const data = await LatestListings.fetchData(search, showError);
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
        <ListingPanelGrid
          listings={listings}
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

const LatestListingsWithToast = withToast(LatestListings);
LatestListingsWithToast.fetchData = LatestListings.fetchData;

export default LatestListingsWithToast;
