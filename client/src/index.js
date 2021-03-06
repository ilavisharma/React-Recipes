import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './index.css';
import App from './components/App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
// import { hot } from 'react-hot-loader/root';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import withSession from './components/withSession';
import Navbar from './components/Navbar';
import Search from './components/Recipe/Search';
import Addrecipe from './components/Recipe/AddRecipe';
import Profile from './components/Profile/Profile';
import RecipePage from './components/Recipe/RecipePage';

const client = new ApolloClient({
  uri: 'https://react-recipes-graphql.herokuapp.com/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.log('Network Error', networkError);

      if (networkError.statusCode === 401) {
        localStorage.removeItem('token');
      }
    }
  }
});

const Root = ({ refetch, session }) => (
  <Router>
    <>
      <Navbar session={session} />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/search" exact component={Search} />
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route
          path="/recipe/add"
          render={() => <Addrecipe session={session} />}
        />
        <Route path="/recipes/:_id" component={RecipePage} />
        <Route path="/profile" render={() => <Profile session={session} />} />
        <Redirect to="/" />
      </Switch>
    </>
  </Router>
);

const RootWithSession = withSession(Root);

// const RootHot =
//   process.env.NODE_ENV === 'development'
//     ? hot(RootWithSession)
//     : RootWithSession;

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById('root')
);
