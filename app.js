const express = require('express');
const router = require('./bookRouter');

//Define all constants
const app = express();
const port = process.env.PORT || 8080;

// Handle CORS Policy
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, PUT');
  next();
});

app.use('/', router);

app.listen(port, () => { console.log(`Listening on port ${port}`); });

