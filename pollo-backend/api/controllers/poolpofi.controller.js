var PoolPoFiService = require('../../services/poolpofi.service');
var AppError = require('../../models/appError.model');

class PoolPoFiController {
    constructor() {
        this.poolPoFiService = new PoolPoFiService();
    }

    async getUserBalance(req, res) {
        try {
            let userBalance = await this.poolPoFiService.getUserBalance(req.params.userAddress);
            res.status(userBalance.success ? 200 : 400).send(userBalance);
        } catch (e) {
            console.log(e);
            res.status(500).json({ code: AppError.UNKNOWN, message: "An internal server error has occurred" });
        }

    }

    async createProposal(req, res) {
        try {
            await this.poolPoFiService.createProposal(req, res);
        } catch (e) {
            console.log(e);
            res.status(500).json({ code: AppError.UNKNOWN, message: "An internal server error has occurred" });
        }
    }

    async castVote(req, res) {
        try {
            await this.poolPoFiService.castVote(req, res);
        } catch (e) {
            console.log(e);
            res.status(500).json({ code: AppError.UNKNOWN, message: "An internal server error has occurred" });
        }
    }

    async finishProposal(req, res) {
        try {
            await this.poolPoFiService.finishProposal(req, res);
        } catch (e) {
            console.log(e);
            res.status(500).json({ code: AppError.UNKNOWN, message: "An internal server error has occurred" });
        }
    }

    async resumeProposal(req, res) {
        try {
            await this.poolPoFiService.resumeProposal(req, res);
        } catch (e) {
            console.log(e);
            res.status(500).json({ code: AppError.UNKNOWN, message: "An internal server error has occurred" });
        }
    }
}

var poolPoFiController = new PoolPoFiController();
module.exports = {
    getUserBalance: function (req, res) { poolPoFiController.getUserBalance(req, res); },
    castVote: function (req, res) { poolPoFiController.castVote(req, res); },
    createProposal: function (req, res) { poolPoFiController.createProposal(req, res); },
    finishProposal: function (req, res) { poolPoFiController.finishProposal(req, res); },
    resumeProposal: function (req, res) { poolPoFiController.resumeProposal(req, res); }
}
