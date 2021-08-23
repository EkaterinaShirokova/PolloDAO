"use strict"

var AppError = require('../models/appError.model');
var voteModel = require('../models/vote.model');
const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const fs = require('fs');
const saltRounds = 10;

module.exports = class VoteService {

    constructor() {
    }

    async newVote(data) {
      let modelData = JSON.parse(data.body.proposal);
      modelData.filePath = data.file?data.file.path:'';
      modelData.dateCreated = new Date();
      modelData.contract = '';
      let result = await voteModel.create(modelData);
      return {
        success: true,
        result: result
      }
    }

    async updateVoteDetails(id, data) {
      let voteData = await voteModel.findOne({
        _id: ObjectID(id)
      });
      let modelData = JSON.parse(data.body.proposal);
      voteData.title = modelData.title;
      voteData.status = modelData.status;
      // voteData.dateEnd = new Date(modelData.dateEnd);
      voteData.description = modelData.description;
      voteData.forum = modelData.forum;
      voteData.options = modelData.options;
      if(data.file){
        if(fs.existsSync(voteData._doc.filePath)){
          fs.unlinkSync(voteData._doc.filePath);
        } else {

        }
        voteData.filePath = data.file.path;
      }

      let result = await voteData.save();
      return {
        success: result != null,
        result: result
      }
    }

    async updateVote(id, data) {
      let voteData = await voteModel.findOne({
        _id: ObjectID(id)
      });
      let isVoted = false;
      voteData.options.forEach((item, _) => {
        let voterIdx = item.votersId.indexOf(data.userId);
        if (voterIdx != -1) {
          isVoted = true;
          return false;
        }
        if (!isVoted && voterIdx == -1 && item.label == data.optionLabel) {
          isVoted = true;
          item.votersId.push(data.userId);
        }
      })
      let result = await voteData.save();
      return {
        success: result != null,
        result: result
      }
    }

    async updateEndDate(id, data) {
      let voteData = await voteModel.findOne({
        _id: ObjectID(id)
      });
      voteData.dateEnd = new Date(data.endDate);
      let result = await voteData.save();
      return {
        success: result != null,
        result: result
      }
    }

    async activateVote(id, data) {
      let voteData = await voteModel.findOne({
        _id: ObjectID(id)
      });

      voteData.status = 'active';
      voteData.contract = data.contract;
      let result = await voteData.save();
      return {
        success: result != null,
        result: result
      }
    }

    async finishVote(id, data) {
      let voteData = await voteModel.findOne({
        _id: ObjectID(id)
      });

      voteData.dateEnd = Date.now();
      voteData.status = data.status;
      voteData.winningOption = data.winningOption;
      let result = await voteData.save();
      return {
        success: result != null,
        result: result
      }
    }

    async deleteVote(id) {
      let result = await voteModel.findOneAndDelete({
        _id: ObjectID(id)
      });
      if(result){
        try{
          fs.unlinkSync(result._doc.filePath);
        } catch(e){
        }
      }
      return {
        success: result != null,
        result: result
      }
    }

    async getVote(id) {
      let result = await voteModel.findOne({_id: new ObjectID(id)});
      return {
        success: result != null,
        result: result
      }
    }

    async getVotes() {
      let result = await voteModel.find();
      return {
        success: result != null,
        result: result
      }
    }

    async getAttachedProposalFile(id) {
      let result = await voteModel.findOne({_id: new ObjectID(id)});
      if(result != null && result._doc.filePath && result._doc.filePath != "" && fs.existsSync(result._doc.filePath)) {
        return result._doc.filePath
      }
      return "";
    }
}
