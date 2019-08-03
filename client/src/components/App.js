import React from 'react';
import { Query } from 'react-apollo';
import './App.css';
import { GET_ALL_RECIPES } from '../queries';

const App = () => (
  <div className="App">
    <h1>Home</h1>
    <Query query={GET_ALL_RECIPES}>
      {({ data, loading, error }) => {
        if (loading) return <div className="">Loading</div>;
        if (error) return <div className="">Error</div>;
        console.log(data);
        return <p>Recipes</p>;
      }}
    </Query>
  </div>
);

export default App;
