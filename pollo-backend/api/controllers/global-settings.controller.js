var GlobalSettingsService = require('../../services/global-settings.service');
var AppError = require('../../models/appError.model');

class GlobalSettingsController {
    constructor() {
        this.globalSettingsService = new GlobalSettingsService();
    }

    async getGlobalSettings(req, res) {
        try{
            let globalSettingsInfo = await this.globalSettingsService.getGlobalSettings()
            res.status(200).send(globalSettingsInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async updateGlobalSettings(req, res) {
        try{
            let globalSettingsInfo = await this.globalSettingsService.updateGlobalSettings(req.body);
            res.status(200).send(globalSettingsInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

}

var globalSettingsController = new GlobalSettingsController();
module.exports = {
    getGlobalSettings: function(req, res) { globalSettingsController.getGlobalSettings(req, res); },
    updateGlobalSettings: function(req, res) { globalSettingsController.updateGlobalSettings(req, res); }
}
