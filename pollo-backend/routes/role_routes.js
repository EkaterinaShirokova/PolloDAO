const express = require('express');
const roleController = require('../api/controllers/roles.controller');
const accountController = require('../api/controllers/account.controller');

const apiRole = express.Router();

apiRole.get('/role-info/:role', roleController.getRole);
apiRole.get('/role-info-all/', roleController.getRoles);
apiRole.post('/new-role', accountController.authenticateToken, roleController.newRole);
apiRole.put('/update-role', accountController.authenticateToken, roleController.updateRole);

module.exports = apiRole;
