const express = require('express');
const voteController = require('../api/controllers/vote.controller');
const accountController = require('../api/controllers/account.controller');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});
var upload = multer({ storage: storage });

const apiVote = express.Router();

apiVote.get('/proposal/:id', voteController.getVote);
apiVote.get('/proposal', voteController.getVotes);
apiVote.post('/proposal',upload.single('proposalfile'), accountController.authenticateToken, voteController.newVote);
apiVote.patch('/proposal/:id/vote', accountController.authenticateToken, voteController.updateVote);//for voting
apiVote.patch('/proposal/:id/activate', accountController.authenticateToken, voteController.activateVote);//for voting
apiVote.patch('/proposal/:id/finish',accountController.authenticateToken, voteController.finishVote);//for finish Voting
apiVote.patch('/proposal/:id/enddate', accountController.authenticateToken, voteController.updateEndDate);
apiVote.put('/proposal/:id',upload.single('proposalfile'), accountController.authenticateToken, voteController.updateVoteDetails);//for update proposal
apiVote.post('/proposal/:id',accountController.authenticateToken, voteController.deleteVote);
apiVote.get('/proposal/file/:id', voteController.downloadProposalAttachment);

module.exports = apiVote;
