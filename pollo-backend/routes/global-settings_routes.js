const express = require('express');
const globalSettingsController = require('../api/controllers/global-settings.controller');
const accountController = require('../api/controllers/account.controller');

const apiGlobalSettings = express.Router();

apiGlobalSettings.get('/global-setting',accountController.authenticateToken, globalSettingsController.getGlobalSettings);
apiGlobalSettings.post('/global-setting',accountController.authenticateToken, globalSettingsController.updateGlobalSettings);

module.exports = apiGlobalSettings;
