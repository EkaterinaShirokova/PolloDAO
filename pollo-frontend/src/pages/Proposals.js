import React from 'react'
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { grey} from '@material-ui/core/colors';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { RoutePaths } from '../App';

import { connect } from "react-redux";
import { getAllProposals } from "redux/Proposal/proposalCrud";
import * as proposalRedux from "redux/Proposal/proposalRedux";
import { getBalance } from 'redux/Pofi/pofiCrud'
import { getGlobalSettings } from 'redux/GlobalSetting/globalCrud'

import { isUserModerateOrLeader, formatProposalTitle } from '../utils';
import { STATUS } from '../utils/constants';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    info: {
        marginTop: '20px',
        marginBottom: '20px',
        padding: '24px 20px 20px',
        borderRadius: '10px',
        backgroundColor: 'rgb(248, 248, 248)',
        display: 'flex',
    },
    card: {
        maxWidth: 400,
        minHeight: 240,
        borderRadius: 20,
        padding: 10,
        border: '1.2px solid #E7EDF3',
        boxShadow: '1px 1px 4px rgb(0 0 0 / 7%)',
        '&:hover': {

            borderColor: '#5B9FED',
            cursor: 'pointer',
        }
    },
    finishedHeading: {

    },
    cloud: {
        fontSize: '28px',
        marginRight: '18px',
    },
    infoText: {
        lineHeight: '1',
    },
    lighttext: {
        color: 'rgb(136, 136, 136)',
    },
    activeCards: {
        paddingTop: '28px',
    },
    tag: {

        color: '#fff',
        background: '#4f6dbd',
        border: 'solid 1px #3f5797',
        fontSize: 10,
        fontWeight: 'bold',
        padding: 2,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: '10px',
    },
    taghead: {
        paddingTop: 10,
    },
    cardContent: {
        paddingTop: 4,

    },
}));



function Proposals(props) {
    
    const classes = useStyles();
    const [showBtnCreate, setShowBtnCreate] = React.useState(false);

    React.useEffect(() => {
        getAllProposals().then(({ data }) => {
            if (data.success)
                props.StoreAllProposals(data.result);
            else console.log("data error");
        })
        .catch((exc) => {
            console.log(exc);
        });

    }, []);

    React.useEffect(() => {
        if (props.currentUser && props.currentUser.userModel && props.currentToken && props.currentToken.token) {
            getBalance(props.currentToken.token, props.currentUser.userModel.address).then(({ data }) => {
                let userBalance = data.result.totalUserBalance;
                getGlobalSettings(props.currentToken.token).then(({ data }) => {
                if (userBalance < data.result[0].proposalRequirement) {
                    setShowBtnCreate(false);
                } else {
                    setShowBtnCreate(true);
                }
                })
            })
        } else {
            setShowBtnCreate(false);
        }
    }, [props]);

    const goToProposalForm = () => {
        props.history.push(RoutePaths.ProposalCreate);
    }

    const HeadingText = ({ text }) => {
        return (
            <strong>{text}</strong>
        );
    };  

    const proposalCard = function (proposal) {
        return <Grid key={proposal._id} item xs={12} sm={4}>
            <Link to={ isUserModerateOrLeader(props.currentUser)? RoutePaths.ProposalDetails.replace(':id', proposal._id) : RoutePaths.ProposalVote.replace(':id', proposal._id)}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardlayout}>
                        <div className={classes.content}>
                            <span className={classes.tag}>#{proposal._id}</span>
                        </div>
                        <div className={classes.taghead} >
                            <HeadingText text={formatProposalTitle(proposal.title, 25)} ></HeadingText>
                        </div>

                        {proposal.options.map((option, index) =>
                            <div className={classes.cardContent} key={index}>
                                <Typography style={{ color: grey[500], fontWeight: 'bold' }} variant="body2" component="p">
                                    {option.label}
                                </Typography>
                            </div>
                        )}

                    </CardContent>

                    <CardContent>
                        <HeadingText text={proposal.status.toUpperCase()}></HeadingText>
                    </CardContent>

                    <Divider />

                    <CardActions></CardActions>
                </Card></Link>
        </Grid>;
    }

    const Introduction = (
        <div className={classes.info}>
            <div className={classes.cloud}>💭</div>
            <div className={classes.infoText}>
                <div><HeadingText text={'Democracy Proposals'}></HeadingText><span> can be introduced by anyone. At a regular interval, the top ranked proposal will become a supermajority-required referendum.</span><p>
                    <HeadingText text={'Council Motions'}></HeadingText><span> can be introduced by councillors. They can directly approve/reject treasury proposals, propose simple-majority referenda.</span></p>
                </div>
                <div className={classes.lighttext}>Next proposal or motion becomes a referendum:
          <span className="Countdown">1d 7h 25m </span>
                    </div>
                    <br />{showBtnCreate? <Button variant="contained" color="primary" size="small" onClick={goToProposalForm}>Create a proposal now</Button> : ''}
            </div>
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.information}>
                {Introduction}
            </div>
            <div className={classes.activeProposal} style={{ paddingTop: '10px' }}>
                <HeadingText text={'Active Proposals'}></HeadingText>
                {props.proposals && props.proposals.filter(f => f.status === STATUS.ACTIVE).length ? 
                    <div className={classes.activeCards} >
                        <Grid container spacing={3}>
                            {props.proposals.filter(f => f.status === STATUS.ACTIVE).map((proposal) =>
                                proposalCard(proposal)
                            )}
                        </Grid>
                    </div>
                    : <div className={classes.lighttext} style={{ paddingTop: '10px' }}>No active proposals</div>
                }
            </div>
            
            <div className={classes.finishedProposal} style={{ paddingTop: '40px' }}>
                <HeadingText text={'Finished Proposals'} className={classes.finishedHeading}></HeadingText>
                {props.proposals && props.proposals.filter(f => f.status === STATUS.FINISHED).length ? 
                    <div className={classes.activeCards} >
                        <Grid container spacing={3}>
                            {props.proposals.filter(f => f.status === STATUS.FINISHED).map((proposal) =>
                                proposalCard(proposal)
                            )}
                        </Grid>
                    </div>
                    : <div className={classes.lighttext} style={{ paddingTop: '10px' }}>No finished proposals</div>
                }
            </div>
            { isUserModerateOrLeader(props.currentUser)? <div className={classes.pendingProposal} style={{ paddingTop: '40px' }}>
                <HeadingText text={'Pending Proposals'}></HeadingText>
                {props.proposals && props.proposals.filter(f => f.status === STATUS.PENDING).length ?
                    <div className={classes.activeCards} >
                        <Grid container spacing={3}>
                            {props.proposals.filter(f => f.status === STATUS.PENDING).map((proposal) =>
                                proposalCard(proposal)
                            )}
                        </Grid>
                    </div>
                    : <div className={classes.lighttext} style={{ paddingTop: '10px' }}>No pending proposals</div>
                }
            </div> : ''
            }
        </div>
    )
}
export default connect( ({ auth, proposal }) => 
    ({ currentUser: auth.currentUser, currentToken: auth.currentToken, proposals: proposal.items }), proposalRedux.actions)(Proposals);