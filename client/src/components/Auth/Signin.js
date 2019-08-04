import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Error from '../Error';
import { SIGNIN_USER } from '../../queries';

const INITTIAL_STATE = {
  username: '',
  password: ''
};

class Signin extends Component {
  state = { ...INITTIAL_STATE };

  clearState = () => {
    this.setState({ ...INITTIAL_STATE });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  validateForm = () => {
    const { username, password } = this.state;

    const isInvalid = !username || !password;
    return isInvalid;
  };

  handleSubmit = (e, signinUser) => {
    e.preventDefault();
    signinUser().then(async ({ data }) => {
      console.log(data);
      localStorage.setItem('token', data.signinUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push('/');
    });
  };

  render() {
    const { username, password } = this.state;
    return (
      <div className="App">
        <h2 className="App">Signin</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {(signinUser, { data, loading, error }) => {
            return (
              <form
                className="form"
                onSubmit={e => this.handleSubmit(e, signinUser)}
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={this.handleChange}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />

                <button
                  type="submit"
                  className="button-primary"
                  disabled={loading || this.validateForm()}
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signin);
