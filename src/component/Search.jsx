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
    history.push(`/products/details/${value}`);
  }

  async loadOptions(term) {
    if (term.length < 3) return [];
    const query = `query itemList(
      $search: String
    ) {
      itemList(
        search: $search
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
    const data = await graphQLFetch(query, { search: term }, showError);
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
