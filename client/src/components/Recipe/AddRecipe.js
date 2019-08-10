import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { ADD_RECIPE, GET_ALL_RECIPES } from '../../queries';
import Error from '../Error';

const INTITAL_STATE = {
  name: '',
  instructions: '',
  category: 'Breakfast',
  description: '',
  username: ''
};

class Addrecipe extends Component {
  state = { ...INTITAL_STATE };

  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username
    });
  }

  clearState = () => {
    this.setState({ ...INTITAL_STATE });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  validateForm = () => {
    const { name, category, description, instructions } = this.state;
    const isInvalid = !name || !category || !description || !instructions;
    return isInvalid;
  };

  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      console.log(data);
      this.clearState();
      this.props.history.push('/');
    });
  };

  updateCache = (cache, { data: { addRecipe } }) => {
    // Update the cache so that it the recent recipe is also shown on the App component
    // read the query
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
    // update the cache with the new data
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: { getAllRecipes: [addRecipe, ...getAllRecipes] }
    });
  };

  render() {
    const { name, category, description, instructions, username } = this.state;

    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, category, description, instructions, username }}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App">Add Recipe</h2>
              <form
                className="form"
                onSubmit={e => this.handleSubmit(e, addRecipe)}
              >
                <input
                  type="text"
                  name="name"
                  onChange={this.handleChange}
                  placeholder="Recipe Name"
                  value={name}
                />
                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <input
                  type="text"
                  name="description"
                  onChange={this.handleChange}
                  placeholder="Add Description"
                  value={description}
                />
                <textarea
                  name="instructions"
                  onChange={this.handleChange}
                  placeholder="Add Instructions"
                  value={instructions}
                />
                <button
                  disabled={loading || this.validateForm()}
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(Addrecipe);
