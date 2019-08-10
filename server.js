const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: 'variables.env' });
const jwt = require('jsonwebtoken');
const Recipe = require('./models/Recipe');
const User = require('./models/User');

// Bring in GraphQL-Express middleware
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

// Create Schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Connect to database
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));

// Initialise the app
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);

// Set up JWT Authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  if (token !== 'null') {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (e) {
      if (e.name === 'TokenExpiredError')
        console.log(e.message + ' at: ' + Date(e.expiredAt));
      else console.log('Error', e.message);
    }
  }
  next();
});

// Create graphiql application
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
);

// Connect schemas with GraphQL
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
      Recipe,
      User,
      currentUser
    }
  }))
);

const port = process.env.PORT || 4444;

app.listen(port, () => console.log(`Server listening on port ${port}`));
