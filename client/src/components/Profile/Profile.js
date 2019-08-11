import React from 'react';
import UserInfo from './UserInfo';
import UserRecipes from './UserRecipes';
// This is a protected route so we will use withAuth
import withAuth from '../withAuth';

const Profile = ({ session }) => (
  <div className="App">
    <UserInfo session={session} />
    <UserRecipes username={session.getCurrentUser.username} />
  </div>
);

export default withAuth(session => session && session.getCurrentUser)(Profile);
