const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

// Connect to database
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));

// Initialise the app
const app = express();

const port = process.env.PORT || 4444;

app.listen(port, () => console.log(`Server listening on port ${port}`));
