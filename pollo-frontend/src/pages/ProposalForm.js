import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { RoutePaths } from '../App';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextAreaAutosize from '@material-ui/core/TextareaAutosize'
import Modal from '@material-ui/core/Modal'

import {Delete, Add} from '@material-ui/icons';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { connect } from "react-redux";
import { getProposal, createProposal, updateProposal, downloadFile } from "redux/Proposal/proposalCrud";
import * as proposalRedux from "redux/Proposal/proposalRedux";
import { postNotification } from 'redux/Notification/notificationCrud'
import fileDownload from 'js-file-download'
import { useConfirm } from 'material-ui-confirm';

import { getBalance } from 'redux/Pofi/pofiCrud'
import { getGlobalSettings } from 'redux/GlobalSetting/globalCrud'
import { isUserModerateOrLeader, getCurrentDate, removeZSeconds, getFileName, formatProposalTitle } from '../utils'
import { STATUS, USER_TYPES, MAX_OPTIONS_COUNT } from '../utils/constants'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    info: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    text_danger: {
        color: 'red'
    },
    date_field: {
        marginTop: '1rem',
        width: 250
    },
    forumLink: {
        width: '50%'
    },
    inputs: {
        display: 'none'
    },
    mt_3: {
        marginTop: '1rem'
    },
    mr_3: {
        marginRight: '1rem'
    },
    full_width: {
        width: '100%'
    },
    upload: {
        marginTop: '1rem'
    },
    fileText: {
        marginRight: '0.5rem'
    },
    description: {
        borderRadius: '10px',
        padding: '10px',
        width: '100%',
        marginTop: "20px",
        marginBottom: '20px',
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ProposalForm(props) {
    const classes = useStyles();
    const socket = props.socket;
    const confirm = useConfirm();
    const [state, setState] = React.useState({
        showStats: false,
        loading: false
    });
    const [canAdd, setCanAdd] = React.useState(true);
    const [lowerProposal, setLowerProposal] = React.useState(false);
    const [file, setFile] = React.useState('')
    const [filename, setFileName] = React.useState(props.model ? getFileName(props.model.filePath):'');
    const [userBalance, setUserBalance] = React.useState(0);
    const [proposalRequired, setProposalRequired] = React.useState(0);

    

    React.useEffect(() => {
        if(props.match.path === RoutePaths.ProposalEdit) {
            if(props.model){
                if(props.model._id !== props.match.params.id)
                    getProposal(props.match.params.id).then(({ data }) => {
                        if(data.success) {
                            if (data.result.options.length >= MAX_OPTIONS_COUNT) setCanAdd(false);
                            props.StoreSingleProposal(data.result);
                        }
                        else console.log("data error");
                    }).catch(exc => console.log(exc));
            }
        }
        if(props.match.path === RoutePaths.ProposalCreate) {
            getBalance(props.currentToken.token, props.currentUser.userModel.address).then(({ data }) => {
                let userBalance = data.result.totalUserBalance;
                getGlobalSettings(props.currentToken.token).then(({ data }) => {
                    setUserBalance(userBalance);
                    setProposalRequired(data.result[0].proposalRequirement);
                    if (userBalance < data.result[0].proposalRequirement) {
                        setLowerProposal(true);
                        props.history.push(RoutePaths.Proposals);                  
                    }
                }).catch((exc) => {
                    console.log(exc);
                })
            }).catch((exc) => {
                console.log(exc);
            })
        }
    }, [props]);


    
    const addOption = () => {
        var proposal = props.model;
        proposal.options.push({});
        if (proposal.options.length >= MAX_OPTIONS_COUNT) {
            setCanAdd(false);
        }
        setState({ ...state, proposal: proposal});
    }
    

    const removeOption = (index) => {
        if(props.model.options.length > 1) {
            var proposal = props.model;
            proposal.options.splice(index, 1);
            setState({ ...state, proposal: proposal});
        }
        if (props.model.options.length < MAX_OPTIONS_COUNT) {
            setCanAdd(true);
        }
    }

    const handleInputChange = (event) => {
        const value = event.target.type === 'checkbox'? event.target.checked : event.target.value;
        setState({ ...state,
            proposal: Object.assign(props.model, {[event.target.name]: value})
        });
    }

    const handleDateChange = (date, value) => {
        setState({ ...state,
            proposal: Object.assign(props.model, {'dateEnd': value})});
    }

    const handleProposalStatusChange = (event) => {
        const value = event.target.checked? STATUS.ACTIVE : STATUS.PENDING;
        setState({ ...state,
            proposal: Object.assign(props.model, {[event.target.name]: value})});
    }

    const handleOptionChange = (event, index) => {
        var proposal = props.model;
        var option = proposal.options[index];
        Object.assign(option, {[event.target.name]: event.target.value});
        setState({ ...state, proposal: proposal});
    }

    const handleChangeFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const saveFile = (e) => {
        if(props.model && props.model.filePath){
            downloadFile(props.model._id)
            .then(function(res){
                fileDownload(res.data, getFileName(props.model.filePath) )
            })

        }
    }

    const confirmSave = () => {
        confirm({ title: `Would you like to submit this proposal?`})
        .then(() => { save(); } )
        .catch(() => { })
    }

    const save = () =>{
        
        if (!props.model.title && (props.model.title.length <= 0 || props.model.length > 80)) 
            return;
        if (!props.model._id) { //in case of create - set createdBy param to the user
            props.model.createdBy = props.currentUser? props.currentUser.userModel.userId : USER_TYPES.UNKNOWN;
        }
        if (!props.model.dateEnd) {
            return
        }
        let nowDate = new Date(props.model.dateEnd);
        props.model.dateEnd = nowDate.toUTCString().slice(0, -4);
        try {
            setState({ ...state, loading: true });
            if (!props.model._id) {
                getBalance(props.currentToken.token, props.currentUser.userModel.address).then(({ data }) => {
                    let userBalance = data.result.totalUserBalance;
                    getGlobalSettings(props.currentToken.token).then(({ data }) => {
                        setUserBalance(userBalance);
                        setProposalRequired(data.result[0].proposalRequirement);
                        if (userBalance < data.result[0].proposalRequirement) {
                            setLowerProposal(true);
                            setState({ ...state, loading: false });                      
                        } else {
                            var formdata = new FormData();
                            formdata.append('proposalfile', file);
                            let proposalData = JSON.stringify(props.model);
                            formdata.append('proposal', proposalData);
                            createProposal(props.currentToken.token, formdata)
                            .then( ({ data }) => {
                                if(data.success) {
                                    props.history.push(RoutePaths.Proposals); 
                                }
                                setState({ ...state, loading: false });
                            }).catch((exc) => {
                                console.log(exc);
                                setState({ ...state, loading: false });
                            });
                        }
                    }).catch((exc) => {
                        console.log(exc);
                        setState({ ...state, loading: false });
                    })
                }).catch((exc) => {
                    console.log(exc);
                    setState({ ...state, loading: false });
                })
            }
            else {
                var formdata = new FormData();
                formdata.append('proposalfile', file);
                let proposalData = JSON.stringify(props.model);
                formdata.append('proposal', proposalData);
                updateProposal(props.currentToken.token, props.model._id, formdata)
                .then( ({ data }) => {
                    if(data.success) {
                        let notificationTitle = `An admin edited your proposal - ${formatProposalTitle(props.model.title, 5)}`;
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
                    setState({ ...state, loading: false });
                }).catch((exc) => {
                    console.log(exc);
                    setState({ ...state, loading: false });
                });
            }
        }
        catch (error) {
        }
    }

    const closeLowerProposal = () => {
        setLowerProposal(false);
    }

    return (
        <div className={classes.root}>
            {props.model && 
                <><h1>{props.model._id ? `Edit ${props.model.title}` : 'Create a proposal'}</h1>
           
                <TextField className={classes.full_width} name="title" error={props.model.title? props.model.title.length > 80 : true} helperText="Title characters should be between 1 to 80." defaultValue={props.model.title} onChange={e => handleInputChange(e)} label="Put title here" />
                <TextAreaAutosize rowsMin={3} className={classes.description} name="description" defaultValue={props.model.description} onChange={e=> handleInputChange(e)} placeholder="Put description here"/>
                {/* <TextField className={classes.date_field} name="dateEnd" type="datetime-local" defaultValue={props.model._id?removeZSeconds(props.model.dateEnd):getCurrentDate()} onChange={e => handleInputChange(e)} label="End Date" InputLabelProps={{shrink: true,}}></TextField> */}
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                    variant="inline"
                    ampm={false}
                    value={props.model.dateEnd?new Date(props.model.dateEnd): ''}
                    onChange={handleDateChange}
                    format="yyyy/MM/dd HH:mm"
                /></MuiPickersUtilsProvider>
                <div className={classes.upload}>
                    {props.model && props.model.filePath ? <Button
                        variant="outlined"
                        className={classes.button}
                        startIcon={<SaveIcon/>}
                        onClick={saveFile }
                        
                    >
                        {props.model && props.model.filePath  ?  getFileName(props.model.filePath): null}
                    </Button> : null}
                    <div style={{position: "relative"}}>
                        <span className={classes.fileText}><strong>Attach a file here.</strong></span>
                        <input
                            className={classes.inputs}
                            id="proposal-file"
                            multiple
                            type="file"
                            onChange={handleChangeFile}
                        />
                        <label htmlFor="proposal-file">
                            <Button
                                variant="contained"
                                component="span"
                                color="default"
                                disabled                               
                            ><CloudUploadIcon />
                            </Button>
                            <span style={{position: "absolute", paddingLeft:'10px', top:'4px'}}>{filename}</span>
                        </label>
                    </div>
                </div>
                <div className={classes.mt_3}>
                    <TextField name="forum" className={classes.forumLink} defaultValue={props.model.forum} onChange={e => handleInputChange(e)} label="Put forum link here. (optional)" />
                </div>
                {/* <TextField name="deadline" onChange={e => handleInputChange(e)} defaultValue={props.model.deadline} label="Enter deadline"/> */}
                <br /><br />
                {/* <FormControlLabel control={<Checkbox name="allowAnonymous" checked={props.model.allowAnonymous} onChange={e => handleInputChange(e)}/>} label="Allow Anonymous Users to Vote" /> */}
                {/* { isUserModerateOrLeader(props.currentUser)?<FormControlLabel control={<Checkbox name="status" checked={ props.model.status === STATUS.ACTIVE } onChange={e => handleProposalStatusChange(e)}/>} label="Active Proposal" /> : '' } */}
                {props.model.options.map((o, i) => 
                    <div key={i} className={classes.mt_3}>
                        <TextField className={classes.mr_3} onChange={e => handleOptionChange(e, i)} defaultValue={o.label} name="label" label="Voting Option" />
                        {/* <TextField name="description" onChange={e => handleOptionChange(e, i)} defaultValue={o.description} label="Option description" /> */}
                        {i > 0 && <IconButton aria-label="remove" onClick={() => removeOption(i)}><Delete /></IconButton>}
                    </div>
                )}
  
                { canAdd ? <div className={classes.mt_3}>
                    <IconButton aria-label="add" onClick={() => addOption()}>
                        <Add />
                    </IconButton>
                </div>: <br/> }
    
                <div className={classes.mt_3}>
                    <Button variant="contained" disabled={!props.model.title || props.model.title.length > 80 || state.loading || (props.model.options && props.model.options.length < 2)} color="primary" onClick={() => confirmSave()}>Save & Submit {state.loading?<CircularProgress size="15px"/> : ''}</Button>
                </div>
                <Snackbar open={lowerProposal} autoHideDuration={6000} onClose={closeLowerProposal}>
                    <Alert onClose={closeLowerProposal} severity="warning">
                    Your PoFi balance {userBalance} is lower than minimum balance {proposalRequired} required for create Proposal 
                    </Alert>
                </Snackbar>
                </>
            }
            
        </div>
    )
}
export default connect(
    ({ auth, proposal }) => ({ currentUser: auth.currentUser, currentToken: auth.currentToken, model: proposal.single }), proposalRedux.actions)
    (ProposalForm);