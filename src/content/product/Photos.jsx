import React from 'react';
import URLSearchParams from 'url-search-params';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import ProductPanelGrid from './ProductPanelGrid.jsx';

import graphQLFetch from '../../script/graphQLFetch.js';
import withToast from '../../component/withToast.jsx';
import store from '../../script/store.js';

const SECTION_SIZE = 24;

function PageLink({
  params, page, activePage, children,
}) {
  params.set('page', page);
  if (page === 0) return React.cloneElement(children, { disabled: true });
  return (
    <LinkContainer
      isActive={() => page === activePage}
      to={{ search: `?${params.toString()}` }}
    >
      {children}
    </LinkContainer>
  );
}

class Photos extends React.Component {
  static async fetchData(search, showError) {
    const params = new URLSearchParams(search);
    const vars = { sourceSheet: 'Photos' };

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const query = `query itemList(
      $sourceSheet: String
      $search: String
      $page: Int
    ) {
      itemList(
        sourceSheet: $sourceSheet
        search: $search
        page: $page
      ) {
        items {
          name 
          sourceSheet 
          variants { 
            uniqueEntryId 
            image 
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
    const initialData = store.initialData || { itemList: {} };
    const {
      itemList: { items, pages },
    } = initialData;
    delete store.initialData;
    this.state = {
      items,
      pages,
    };
  }

  componentDidMount() {
    const { items } = this.state;
    if (items == null) this.loadData();
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
    const data = await Photos.fetchData(search, showError);
    if (data) {
      this.setState({
        items: data.itemList.items,
        pages: data.itemList.pages,
      });
    }
  }

  render() {
    const { items } = this.state;
    if (items == null) return null;

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
        <ProductPanelGrid
          products={items}
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

const ArtWithToast = withToast(Photos);
ArtWithToast.fetchData = Photos.fetchData;

export default ArtWithToast;
