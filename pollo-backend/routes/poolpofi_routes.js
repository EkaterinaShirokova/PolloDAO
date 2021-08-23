const express = require('express');
const poolpofiController = require('../api/controllers/poolpofi.controller');
const accountController = require('../api/controllers/account.controller');

const apiPoolPofi = express.Router();

apiPoolPofi.get('/balance/:userAddress',accountController.authenticateToken, poolpofiController.getUserBalance);
apiPoolPofi.post('/cast-vote',accountController.authenticateToken, poolpofiController.castVote);
apiPoolPofi.post('/create-proposal',accountController.authenticateToken, poolpofiController.createProposal);
apiPoolPofi.post('/finish-proposal',accountController.authenticateToken, poolpofiController.finishProposal);

module.exports = apiPoolPofi;
