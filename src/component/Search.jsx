import React from 'react';
import SelectAsync from 'react-select/lib/Async'; // eslint-disable-line
import { withRouter } from 'react-router-dom';

import graphQLFetch from '../script/graphQLFetch.js';
import withToast from './withToast.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeSelection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  onChangeSelection({ value }) {
    const { history } = this.props;
    if (value) {
      history.push(`/products/details/${value}`);
    }
  }

  async loadOptions(term) {
    if (term.length < 3) return [];

    let source;
    const { location: { pathname } } = this.props;
    if (pathname === '/products/art') {
      source = 'Art';
    } else if (pathname === '/products/fossils') {
      source = 'Fossils';
    } else if (pathname === '/products/photos') {
      source = 'Photos';
    } else if (pathname === '/products/posters') {
      source = 'Posters';
    } else if (pathname === '/products/tools') {
      source = 'Tools';
    } else {
      return [{ label: 'Not in a product page...', value: null }];
    }

    const query = `query itemList(
      $search: String
      $sourceSheet: String
    ) {
      itemList(
        search: $search
        sourceSheet: $sourceSheet
      ) {
        items {
          name 
          sourceSheet 
          variants { 
            uniqueEntryId 
            image 
          }
        }
      }
    }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { search: term, sourceSheet: source }, showError);
    return data.itemList.items.map(item => ({
      label: `#${item.name} [${item.sourceSheet}]`, value: item.variants[0].uniqueEntryId,
    }));
  }

  render() {
    return (
      <SelectAsync
        instanceId="search-select"
        value=""
        loadOptions={this.loadOptions}
        filterOption={() => true}
        onChange={this.onChangeSelection}
        components={{ DropdownIndicator: null }}
      />
    );
  }
}

export default withRouter(withToast(Search));
