import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER,
  UPDATE_USER_RECIPE
} from '../../queries';
import Spinner from '../Spinner';

class UserRecipes extends Component {
  state = {
    _id: '',
    name: '',
    imageUrl: '',
    category: '',
    description: '',
    modal: false
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleDelete = deleteUserRecipe => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this recipe?'
    );
    if (confirmDelete) {
      deleteUserRecipe().then(({ data }) => {
        // console.log(data);
      });
    }
  };

  loadRecipe = recipe => {
    // console.log(recipe);
    this.setState({ ...recipe, modal: true });
  };

  handleSubmit = (event, updateUserRecipe) => {
    event.preventDefault();
    updateUserRecipe().then(({ data }) => {
      // console.log(data);
      this.closeModal();
    });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { username } = this.props;
    const { modal } = this.state;
    return (
      <Query query={GET_USER_RECIPES} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div>Error</div>;
          return (
            <ul>
              {modal && (
                <EditRecipeModal
                  closeModal={this.closeModal}
                  handleChange={this.handleChange}
                  handleSubmit={this.handleSubmit}
                  recipe={this.state}
                />
              )}
              <h3>Your Recipes</h3>
              {!data.getUserRecipes.length && (
                <p>
                  <strong>You have not added any recipes yet!</strong>
                </p>
              )}
              {data.getUserRecipes.map(recipe => (
                <li key={recipe._id}>
                  <Link to={`/recipes/${recipe._id}`}>
                    <p>{recipe.name}</p>
                  </Link>
                  <p style={{ marginBottom: '0' }}>{recipe.likes}</p>
                  <Mutation
                    mutation={DELETE_USER_RECIPE}
                    variables={{ _id: recipe._id }}
                    update={(cache, { data: { deleteUserRecipe } }) => {
                      const { getUserRecipes } = cache.readQuery({
                        query: GET_USER_RECIPES,
                        variables: { username }
                      });
                      cache.writeQuery({
                        query: GET_USER_RECIPES,
                        variables: { username },
                        data: {
                          getUserRecipes: getUserRecipes.filter(
                            recipe => recipe._id !== deleteUserRecipe._id
                          )
                        }
                      });
                    }}
                    // below we can specify all the queries that we wanna reissue
                    refetchQueries={() => [
                      { query: GET_ALL_RECIPES },
                      { query: GET_CURRENT_USER }
                    ]}
                  >
                    {(deleteUserRecipe, attrs = {}) => (
                      <div>
                        <button
                          onClick={() => this.loadRecipe(recipe)}
                          className="button-primary"
                        >
                          Update
                        </button>
                        <p
                          className="delete-button"
                          onClick={() => this.handleDelete(deleteUserRecipe)}
                        >
                          {attrs.loading ? 'Deleting...' : 'X'}
                        </p>
                      </div>
                    )}
                  </Mutation>
                </li>
              ))}
            </ul>
          );
        }}
      </Query>
    );
  }
}

const EditRecipeModal = ({
  handleSubmit,
  handleChange,
  closeModal,
  recipe
}) => (
  <Mutation
    mutation={UPDATE_USER_RECIPE}
    variables={{
      _id: recipe._id,
      name: recipe.name,
      category: recipe.category,
      imageUrl: recipe.imageUrl,
      description: recipe.description
    }}
  >
    {updateUserRecipe => (
      <div className="modal modal-open">
        <div className="modal-inner">
          <div className="modal-content">
            <form
              onSubmit={e => handleSubmit(e, updateUserRecipe)}
              className="modal-content-inner"
            >
              <h4>Edit Recipe</h4>

              <label htmlFor="name">Recipe Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={recipe.name}
              />

              <label htmlFor="imageUrl">Recipe Image</label>
              <input
                type="text"
                name="imageUrl"
                onChange={handleChange}
                value={recipe.imageUrl}
              />

              <label htmlFor="category">Category of Recipe</label>
              <select
                name="category"
                onChange={handleChange}
                value={recipe.category}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>

              <label htmlFor="description">Recipe Description</label>
              <input
                type="text"
                name="description"
                onChange={handleChange}
                value={recipe.description}
              />
              <hr />
              <div className="modal-buttons">
                <button className="button-primary">Update</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </Mutation>
);

export default UserRecipes;
