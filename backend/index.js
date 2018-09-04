const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const envVariables = require('./env-variables.json');

const app = express();

app.get('/public', (req, res) => res.send('Everyone in the world can read this message.'));

app.use(jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${envVariables.auth0Domain}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: envVariables.apiIdentifier,
  issuer: `https://${envVariables.auth0Domain}/`,
  algorithms: ['RS256']
}));

app.get('/private', (req, res) => res.send('Only authenticated users can read this message.'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
