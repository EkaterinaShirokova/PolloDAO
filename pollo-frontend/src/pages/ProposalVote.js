import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import Link from '@material-ui/core/Link';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Alert from '@material-ui/lab/Alert'

import { connect } from "react-redux";
import { getProposal, vote, downloadFile } from "redux/Proposal/proposalCrud";
import { castVotePoFi } from 'redux/Pofi/pofiCrud'
import * as proposalRedux from "redux/Proposal/proposalRedux";

import fileDownload from 'js-file-download'

import { getUserId, getTotalVoteCount, getSelectedOption, removeZSeconds, getFileName, getOptionIdx } from '../utils'
import { STATUS } from '../utils/constants'
import { drawerWidth, themeColor } from 'constant'
import { BASE_URL } from 'redux/config'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: '1rem 1rem 1rem 1rem'
    },
    info: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '1rem 2rem 1rem 2rem'
    },
    contract: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'grey'
    },
    voters: {
        width: '100%',
    },
    votesheading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    winningheading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        color: themeColor
    },
    vote: {
        display: 'flex',
        direction: 'column',
        justifyContent: 'center',
        position: 'fixed',
        padding: "20px"
    },
    text_danger: {
        color: 'red'
    },
    mt_3: {
        marginTop: '1rem'
    },
    mr_3: {
        marginRight: '1rem'
    },
    description: {
        display: 'block',
        height: 'fit-content',
        width: '100%',
        borderRadius: '10px',
        border: '2px solid',
        borderColor: themeColor
    },
    multiline: {
        whiteSpace: 'pre-line'
    }
}));



function ProposalVote(props) {
    const classes = useStyles();

    const [state, setState] = React.useState({
        currentOption: '',
        loading: false,
        alertText: '',
        showAlert: false,
        isAlreadyVoted: false
    });
    React.useEffect(() => {
        if(props.model){
            if(props.model._id !== props.match.params.id)
                getProposal(props.match.params.id).then(({ data }) => {
                    if(data.success) {
                        let curOption = getSelectedOption(getUserId(props.currentUser), data.result.options);
                        setState({...state, currentOption: curOption, isAlreadyVoted: curOption !== null});
                        props.StoreSingleProposal(data.result);
                    }
                    else console.log("data error");
                }).catch(exc => console.log(exc));
        }
    }, [props, state]);

    const handleRadioChange = (event) => {
        setState({ ...state, currentOption: event.target.value });
    }

    const doVote = (event) => {
        if (state.currentOption === null) {
            setState({ ...state, showAlert: true, alertText: 'Please select voting option.'});
        } else {
            setState({ ...state, loading: true, showAlert: false });
            if (props.currentToken && props.currentToken.token && props.currentUser && props.currentUser.userModel && props.model.contract !== '') {
                castVotePoFi(props.currentToken.token, props.model.contract, props.currentUser.userModel.address, getOptionIdx(props.model.options, state.currentOption))
                .then(({ data }) => {
                    vote(props.currentToken.token, props.model._id, state.currentOption, getUserId(props.currentUser)).then( ({ data }) => {
                        if(data.success) {
                            getProposal(props.model._id).then(({ data }) => {
                                if(data.success) {
                                    let curOption = getSelectedOption(getUserId(props.currentUser), data.result.options);
                                    setState({...state, currentOption: curOption, isAlreadyVoted: curOption !== null});
                                    props.StoreSingleProposal(data.result);
                                }
                                else console.log("data error");
                            }).catch(exc => console.log(exc));
                            setState({ ...state, loading: false, showAlert: false });
                        }
                    }).catch((exc) => {
                        setState({ ...state, loading: false, showAlert: true, alertText: 'Voting Failed.' });
                        console.log(exc);
                    })
                }).catch((err)=> {
                    setState({ ...state, loading: false, showAlert: true, alertText: 'Writing Vote to Blockchain Failed.' });
                    console.log(err);
                })
            }
        }
    }

    const saveFile = (e) => {
        if(props.model && props.model.filePath){
            downloadFile(props.model._id)
            .then(function(res){
                fileDownload(res.data, getFileName(props.model.filePath) )
            })

        }
    }

    const VotedUsers = () => {
        let votedComponents = props.model.options.map((option, index) => {
            return (<Accordion key={`vote-accordion ${index}`} className={classes.voters} defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        >
                        <Typography className={(props.model.status === STATUS.FINISHED && props.model.winningOption === option.label)?classes.winningheading:classes.votesheading}><strong>{option.label}</strong> - {option.votersId?option.votersId.length:''}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {option.votersId && option.votersId.map((voter, _) => {
                            return (<Chip label={voter} clickable color="primary"/>)
                        })}
                    </AccordionDetails>
            </Accordion>)
        });
        return votedComponents;
    }

    return (
        <div className={classes.root}>
            {props.model && 
                <><center><h1>{props.model.title}</h1></center>
                <p className={classes.info}>
                    <span><strong>By:</strong> {props.model.createdBy}</span>
                    <span><strong>Date Approved:</strong> {removeZSeconds(props.model.dateApproved)}</span>
                    <span><strong>Date End:</strong> {removeZSeconds(props.model.dateEnd)}</span>
                    <span><strong>Total Votes:</strong> {getTotalVoteCount(props.model.options)}</span>
                </p>
                {props.model.status !== STATUS.PENDING ? <p className={classes.contract}>
                    <span><strong>Contract:</strong> {props.model.contract}</span>
                </p>:''}
                <div className={classes.description}><center><h5 className={classes.multiline}>{props.model.description}</h5></center></div>
                <Grid container className={classes.container} spacing={2}>    
                    <Grid item xs={8}>
                        {VotedUsers()}
                    </Grid>
                    <Grid item xs={4}>
                        {props.currentUser != null?<div>
                            <RadioGroup aria-label="option" name="option" onChange={handleRadioChange}>
                                {props.model.options.map((o, i) => 
                                    <FormControlLabel key={`vote-radio ${i}`} disabled={props.model.status === STATUS.FINISHED || state.isAlreadyVoted } 
                                    value={o.label} checked={state.currentOption === o.label} control={<Radio />} label={o.label} />
                                )}
                            </RadioGroup>
                            {props.model && props.model.filePath ? <Button
                                variant="outlined"
                                className={classes.button}
                                startIcon={<SaveIcon/>}
                                onClick={saveFile }    
                            >
                                {props.model && props.model.filePath  ?  getFileName(props.model.filePath): null}
                            </Button> : null}
                            <div className={classes.mt_3}>
                                {!state.isAlreadyVoted ? <Button variant="contained" color="secondary" disabled={state.loading || props.model.status !== STATUS.ACTIVE} size="small" onClick={() => doVote()}>Vote {state.loading?<CircularProgress size="15px"/> : ''}</Button> : ''}
                            </div>
                            {state.showAlert?<Alert severity="error">{state.alertText}</Alert>:''}
                            {props.model.forum && props.model.forum !== ''?<div className={classes.mt_3}>
                                <Link target="_blank" rel="noopener noreferer" href={`${BASE_URL}` + 'DiscussionInfo/' + props.model.forum}>Please follow to the Forum Link.<ArrowForwardIcon fontSize="inherit"></ArrowForwardIcon></Link>
                            </div>:''}
                        </div>:''}
                    </Grid>
                </Grid></>
            }
        </div>
    )
}
export default connect(
    ({ auth, proposal }) => ({ currentUser: auth.currentUser, currentToken: auth.currentToken, model: proposal.single }), proposalRedux.actions
)(ProposalVote);