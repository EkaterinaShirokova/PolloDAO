import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Alert from '@material-ui/lab/Alert'
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import Link from '@material-ui/core/Link';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { connect } from "react-redux";
import { getProposal, vote, deleteProposal, finishVote, downloadFile, activateProposal, updateEndDate } from "redux/Proposal/proposalCrud";
import * as proposalRedux from "redux/Proposal/proposalRedux";
import { RoutePaths } from 'App';
import { postNotification } from 'redux/Notification/notificationCrud'
import { createProposalPoFi, finishProposalPoFi } from 'redux/Pofi/pofiCrud'

import fileDownload from 'js-file-download'
import { castVotePoFi } from 'redux/Pofi/pofiCrud'

import { getUserId, getTotalVoteCount, getSelectedOption, removeZSeconds, 
    getFileName, getOptionIdx, formatProposalTitle, getCurrentDate} from '../utils'
import { STATUS } from '../utils/constants'
import { BASE_URL } from 'redux/config'
import { updatepost } from 'redux/Post/postCrud';
import { themeColor } from 'constant';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    info: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    contract: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'grey'
    },
    text_danger: {
        color: 'red'
    },
    mt_3: {
        marginTop: '1rem'
    },
    mr_3: {
        marginRight: '0.7rem'
    },
    description: {
        display: 'block',
        height: 'fit-content',
        width: '100%',
        borderRadius: '10px',
        border: '2px solid',
        marginBottom: '10px',
        borderColor: themeColor
    },
    multiline: {
        whiteSpace: 'pre-line'
    }
}));



function ProposalDetails(props) {
    const classes = useStyles();
    const socket = props.socket;

    const [state, setState] = React.useState({
        showStats: false,
        currentOption: null,
        alertText: '',
        endDate: '',
        showAlert: false,
        isAlreadyVoted: false,
        finishLoading: false,
        deleteLoading: false,
        activeLoading: false,
        changeLoading: false,
        voteLoading: false
    });

    React.useEffect(() => {
        if(props.model){
            if(props.model._id !== props.match.params.id)
                getProposal(props.match.params.id).then(({ data }) => {
                    if(data.success) {
                        let curOption = getSelectedOption(getUserId(props.currentUser), data.result.options);
                        setState({...state, currentOption: curOption, isAlreadyVoted: curOption !== null, endDate: data.result.dateEnd});
                        props.StoreSingleProposal(data.result);
                    }
                    else console.log("data error");
                }).catch(exc => console.log(exc));
        }
    }, [props, state]);


    const doDelete = () => {
        setState({ ...state, deleteLoading: true});
        if (props.currentToken && props.currentToken.token && props.currentUser && props.currentUser.userModel) {
            if (props.model.status === STATUS.ACTIVE) {
                finishProposalPoFi(props.currentToken.token, props.model.contract).then( ({ data }) => {
                        deleteProposal(props.currentToken.token, props.model._id).then(({ data }) => {
                            if(data.success) {
                                let notificationTitle = `An admin deleted your proposal - ${formatProposalTitle(props.model.title, 5)}`;
                                let link = `/proposal/vote/${props.model._id}`;
                                postNotification(props.currentToken.token, props.model.createdBy, notificationTitle, link, props.currentUser.userModel.userId);
                                socket.emit("newThread",
                                {
                                    userList: [props.model.createdBy],
                                    content: notificationTitle,
                                    from: props.currentUser.userModel.userId,
                                    link: link
                                });
                                props.history.push(RoutePaths.Proposals);
                            }
                            setState({ ...state, deleteLoading: false, showAlert: false });
                        })
                        .catch(err => {
                            setState({ ...state, deleteLoading: false, showAlert: true, alertText: 'Deleting Proposal Failed.'});
                        })
                    })
                .catch(err => {
                        setState({ ...state, showAlert: true, alertText: 'Finish Proposal in Blockchain Failed.', deleteLoading: false});
                });
            }
            else {
                deleteProposal(props.currentToken.token, props.model._id).then(({ data }) => {
                    if(data.success) {
                        let notificationTitle = `An admin deleted your proposal - ${formatProposalTitle(props.model.title, 5)}`;
                        let link = `/proposal/vote/${props.model._id}`;
                        postNotification(props.currentToken.token, props.model.createdBy, notificationTitle, link, props.currentUser.userModel.userId);
                        socket.emit("newThread",
                        {
                            userList: [props.model.createdBy],
                            content: notificationTitle,
                            from: props.currentUser.userModel.userId,
                            link: link
                        });
                        props.history.push(RoutePaths.Proposals);
                    }
                    setState({ ...state, deleteLoading: false, showAlert: false });
                })
                .catch(err => {
                    setState({ ...state, deleteLoading: false, showAlert: true, alertText: 'Deleting Proposal Failed.'});
                })
            }
        }   
    }

    const doFinish = () => {
        if (props.model.status === STATUS.PENDING) {
            setState({ ...state, showAlert: true, alertText: 'Please activate proposal first.'})
        }
        else if (state.currentOption === null) {
            setState({ ...state, showAlert: true, alertText: 'Please select winning option.'});
        } else {
            setState({ ...state, showAlert: false, finishLoading: true });
            let proposal = props.model;
            proposal.status = STATUS.FINISHED;
            proposal.winningOption = state.currentOption;
            setState({ ...state, finishLoading: true });
            if (props.currentToken && props.currentToken.token && props.currentUser && props.currentUser.userModel) {
                finishProposalPoFi(props.currentToken.token, props.model.contract).then( ({ data }) => {
                    finishVote(props.currentToken.token, proposal._id, proposal)
                    .then( ({ data }) => {
                        if(data.success) {
                            let notificationTitle = `An admin finished your proposal - ${formatProposalTitle(proposal.title, 5)}`;
                            let link = `/proposal/vote/${proposal._id}`;
                            postNotification(props.currentToken.token, proposal.createdBy, notificationTitle, link, props.currentUser.userModel.userId);
                            socket.emit("newThread",
                            {
                                userList: [proposal.createdBy],
                                content: notificationTitle,
                                from: props.currentUser.userModel.userId,
                                link: link
                            });
                            props.history.push(RoutePaths.Proposals);
                        }
                        setState({ ...state, finishLoading: false, showAlert: false });
                    }).catch((exc) => {
                        console.log(exc);
                        setState({ ...state, finishLoading: false, showAler: true, alertText: 'Finish Proposal Failed' });
                    });
                })
                .catch(err => {
                    setState({ ...state, showAlert: true, alertText: 'Finish Proposal in Blockchain Failed.', finishLoading: false});             
                })
            }
        }
    }

    const doActive = (e) => {
        setState({ ...state, activeLoading: true, showAlert: false });
        if (props.currentToken && props.currentToken.token && props.currentUser && props.currentUser.userModel) {
            createProposalPoFi(props.currentToken.token, props.model.title,
                props.model.options, props.currentUser.userModel.address).then( ({ data }) => {
                    props.model.status = STATUS.ACTIVE;    
                    activateProposal(props.currentToken.token, props.model._id, data.toString()).then(({ data }) => {
                        if (data.success) {
                            let notificationTitle = `An admin activated your proposal - ${formatProposalTitle(props.model.title)}`;
                            let link = `/proposal/vote/${props.model._id}`;
                            postNotification(props.currentToken.token, props.model.createdBy, notificationTitle, link, props.currentUser.userModel.userId);
                            socket.emit("newThread",
                            {
                                userList: [props.model.createdBy],
                                content: notificationTitle,
                                from: props.currentUser.userModel.userId,
                                link: link
                            });
                            getProposal(props.model._id).then(({ data }) => {
                                if(data.success) {
                                    props.StoreSingleProposal(data.result);
                                }
                                else console.log("data error");
                            }).catch(exc => console.log(exc));
                        }
                        setState({ ...state, activeLoading: false, showAlert: false });
                    }).catch((exc) => {
                        setState({ ...state, activeLoading: false, showAlert: true, alertText: 'Activating Proposal Failed.'});
                    })
            }).catch((exc) => {
                console.log(exc);
                setState({ ...state, showAlert: true, alertText: 'Writing Proposal to Blockchain Failed.', activeLoading: false});
            });
        }
    }

    const doVote = (event) => {
        if (state.currentOption === null) {
            setState({ ...state, showAlert: true, alertText: 'Please select voting option.'});
        } else {
            setState({ ...state, voteLoading: true, showAlert: false });
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

    const doChange = (e) => {
        setState({ ...state, showAlert: false, changeLoading: true });
        let nowDate = new Date(state.endDate);
        let endDate = nowDate.toUTCString().slice(0, -4)
        updateEndDate(props.currentToken.token, props.model._id, endDate)
        .then( ({ data }) => {
            if(data.success) {
                getProposal(props.model._id).then(({ data }) => {
                    if(data.success) {
                        let curOption = getSelectedOption(getUserId(props.currentUser), data.result.options);
                        setState({...state, currentOption: curOption, isAlreadyVoted: curOption !== null, endDate: data.result.dateEnd });
                        props.StoreSingleProposal(data.result);
                        let notificationTitle = `An admin changed your proposal - ${formatProposalTitle(props.model.title, 5)}`;
                        let link = `/proposal/vote/${props.model._id}`;
                        postNotification(props.currentToken.token, props.model.createdBy, notificationTitle, link, props.currentUser.userModel.userId);
                        socket.emit("newThread",
                        {
                            userList: [props.model.createdBy],
                            content: notificationTitle,
                            from: props.currentUser.userModel.userId,
                            link: link
                        });
                    }
                    else console.log("data error");
                }).catch(exc => console.log(exc));
                setState({ ...state, changeLoading: false, showAlert: false });
            }
            setState({ ...state, changeLoading: false });
        }).catch((exc) => {
            console.log(exc);
            setState({ ...state, changeLoading: false, showAlert: true, alertText: "Failed to change end date." });
        });
    }

    const saveFile = (e) => {
        if(props.model && props.model.filePath){
            downloadFile(props.model._id)
            .then(function(res){
                fileDownload(res.data, getFileName(props.model.filePath) )
            })

        }
    }

    const handleRadioChange = (event) => {
        setState({ ...state, showStats: true, currentOption: event.target.value });
    }

    const handleEndDateChange = (date, value) => {
        setState({ ...state, endDate: value });
    }

    const VotedUsers = () => {
        let votedComponents = props.model.options.map((option, index) => {
            return (<Accordion key={`details-accordion ${index}`} defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        >
                        <Typography><strong>{option.label}</strong> - {option.votersId?option.votersId.length:''}</Typography>
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
                    <span><strong>Date Created:</strong> {removeZSeconds(props.model.dateCreated)}</span>
                    <span><strong>By:</strong> {props.model.createdBy}</span>
                    <span><strong>Date Approved:</strong> {removeZSeconds(props.model.dateApproved)}</span>
                    <span><strong>Date End:</strong> {removeZSeconds(props.model.dateEnd)}</span>
                    <span><strong>Total Votes:</strong> {getTotalVoteCount(props.model.options)}</span>
                </p>
                {props.model.status !== STATUS.PENDING ? <p className={classes.contract}>
                    <span><strong>Contract:</strong> {props.model.contract}</span>
                </p>:''}
                <div className={classes.description}><center><h5 className={classes.multiline}>{props.model.description}</h5></center></div>
                <Grid container className={classes.container} direction='row' justify='center' spacing={2}>    
                    <Grid item xs={12} md={7}>
                        {VotedUsers()}
                    </Grid>
                    <Grid item xs={12} md={5}>
                        {props.model.status !== STATUS.FINISHED ? <RadioGroup aria-label="option" name="option" onChange={handleRadioChange}>
                            {props.model.options.map((o, i) => 
                                <FormControlLabel key={`details-radio ${i}`} value={o.label} control={<Radio />} label={`${o.label} ${state.showStats && o.voterIds ? o.voterIds.length : ''}`} />
                            )}
                        </RadioGroup>: <RadioGroup aria-label="option" name="option" onChange={handleRadioChange}>
                            {props.model.options.map((o, i) => 
                                <FormControlLabel key={`details-radio ${i}`} value={o.label} disabled control={<Radio />} checked={props.model.winningOption === o.label} label={`${o.label} ${state.showStats && o.voterIds ? o.voterIds.length : ''}`} />
                            )}
                        </RadioGroup>}
                        {props.model && props.model.filePath ? <Button
                            variant="outlined"
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                            onClick={saveFile }    
                        >
                            {props.model && props.model.filePath  ?  getFileName(props.model.filePath): null}
                        </Button> : null}
                        {props.model.status === STATUS.ACTIVE? <div className={classes.mt_3}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDateTimePicker
                                variant="inline"
                                ampm={false}
                                label="With keyboard"
                                value={state.endDate !== ''?new Date(state.endDate): ''}
                                onChange={handleEndDateChange}
                                format="yyyy/MM/dd HH:mm"
                            /></MuiPickersUtilsProvider>
                        </div>:''}
                        <div className={classes.mt_3}>
                            {props.model.status === STATUS.PENDING? <Button variant="contained" color="primary" size="small" disabled={props.model.status === STATUS.FINISHED}
                            className={classes.mr_3} onClick={() => props.history.push(RoutePaths.ProposalEdit.replace(':id', props.model._id))}>Edit</Button>: ''}
                            {props.model.status === STATUS.ACTIVE? <Button variant="contained" color="primary" size="small" disabled={state.changeLoading}
                            className={classes.mr_3} onClick={() => doChange()}>Change{state.changeLoading?<CircularProgress size="15px"/> : ''}</Button> : ''}
                            <Button variant="contained" color="secondary" size="small" disabled={state.deleteLoading}
                            className={classes.mr_3} onClick={() => doDelete()}>Delete {state.deleteLoading?<CircularProgress size="15px"/> : ''}</Button>
                            <Button variant="contained" color="primary" size="small" disabled={state.finishLoading || props.model.status === STATUS.FINISHED || props.model.status === STATUS.PENDING}
                            className={classes.mr_3} onClick={() => doFinish()}>Finish {state.finishLoading?<CircularProgress size="15px"/> : ''}</Button>
                            <Button variant="contained" color="secondary" disabled={state.voteLoading || props.model.status !== STATUS.ACTIVE || state.isAlreadyVoted }
                             className={classes.mr_3} size="small" onClick={() => doVote()}>Vote {state.voteLoading?<CircularProgress size="15px"/> : ''}</Button>                        
                        </div>
                        <div className={classes.mt_3}>
                            {props.model.status === STATUS.PENDING ? <Button variant="outlined" fullWidth color="primary" size="small" disabled={state.activeLoading || 
                                    props.model.status === STATUS.ACTIVE || props.model.status === STATUS.FINISHED} onClick={() => doActive()}>Set to Active {state.activeLoading?<CircularProgress size="15px"/> : ''}</Button>
                                    :''
                            }
                        </div>
                        {state.showAlert?<Alert severity="error">{state.alertText}</Alert>:''}
                        {props.model.forum && props.model.forum !== ''?<div className={classes.mt_3}>
                            <Link target="_blank" rel="noopener noreferer" href={`${BASE_URL}` + 'DiscussionInfo/' + props.model.forum}>Please follow to the Forum Link.<ArrowForwardIcon fontSize="inherit"></ArrowForwardIcon></Link>
                        </div>:''}
                    </Grid>
                </Grid></>
            }

        </div>
    )
}
export default connect(
    ({ auth, proposal }) => ({ currentUser: auth.currentUser, currentToken: auth.currentToken, model: proposal.single }), proposalRedux.actions
)(ProposalDetails);