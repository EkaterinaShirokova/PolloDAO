var VoteService = require('../../services/vote.service');
var AppError = require('../../models/appError.model');

class VoteController {
    constructor() {
        this.voteService = new VoteService();
    }

    async getVotes(req, res) {
        try{
            let voteInfo = await this.voteService.getVotes()
            res.status(200).send(voteInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async getVote(req, res) {
        try{
            let voteInfo = await this.voteService.getVote(req.params.id)
            res.status(200).send(voteInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async newVote(req, res) {
        try{
            let createdVote = await this.voteService.newVote(req);
            res.status(200).send(createdVote);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async updateVote(req, res) {
        try{
            let voteInfo = await this.voteService.updateVote(req.params.id, req.body);
            res.status(200).send(voteInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async updateEndDate(req, res) {
        try{
            let voteInfo = await this.voteService.updateEndDate(req.params.id, req.body);
            res.status(200).send(voteInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async activateVote(req, res) {
        try{
            let voteInfo = await this.voteService.activateVote(req.params.id, req.body);
            res.status(200).send(voteInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async finishVote(req, res) {
        try{
            let voteInfo = await this.voteService.finishVote(req.params.id, req.body);
            res.status(200).send(voteInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async updateVoteDetails(req, res) {
        try{
            let voteInfo = await this.voteService.updateVoteDetails(req.params.id, req);
            res.status(200).send(voteInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async deleteVote(req, res) {
        try{
            let voteInfo = await this.voteService.deleteVote(req.params.id);
            res.status(200).send(voteInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async downloadProposalAttachment(req, res) {
        try{
            let filepath = await this.voteService.getAttachedProposalFile(req.params.id);
            if(filepath != ""){
              res.download(filepath);
            } else {
              res.status(400).send({sucess: false});
            }
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }
}

var voteController = new VoteController();
module.exports = {
    getVote: function(req, res) { voteController.getVote(req, res); },
    getVotes: function(req, res) { voteController.getVotes(req, res); },
    newVote: function(req, res) { voteController.newVote(req, res); },
    updateVote: function(req, res) { voteController.updateVote(req, res); },
    updateEndDate: function(req, res) { voteController.updateEndDate(req, res); },
    activateVote: function(req, res) { voteController.activateVote(req, res); },
    finishVote: function(req, res) { voteController.finishVote(req, res)},
    updateVoteDetails: function(req, res) { voteController.updateVoteDetails(req, res); },
    deleteVote: function(req, res) { voteController.deleteVote(req, res); },
    downloadProposalAttachment: function(req, res) { voteController.downloadProposalAttachment(req, res); }
}
