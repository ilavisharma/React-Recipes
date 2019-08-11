import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo'; // we need to do the query on demand
import { SEARCH_RECIPES } from '../../queries';
import SearchItem from './SearchItem';

class Search extends Component {
  state = {
    searchResults: []
  };

  handleChange = ({ searchRecipes }) => {
    this.setState({
      searchResults: searchRecipes
    });
  };

  render() {
    const { searchResults } = this.state;
    return (
      <ApolloConsumer>
        {client => (
          <div className="App">
            <input
              type="text"
              placeholder="Search for Recipes"
              onChange={async event => {
                event.persist();
                const { data } = await client.query({
                  query: SEARCH_RECIPES,
                  variables: {
                    searchTerm: event.target.value
                  }
                });
                this.handleChange(data);
              }}
            />
            <ul>
              {searchResults.map(recipe => (
                <SearchItem key={recipe._id} {...recipe} />
              ))}
            </ul>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default Search;
