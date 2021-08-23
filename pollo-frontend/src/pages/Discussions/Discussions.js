import React from 'react'
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import Pagination from '@material-ui/lab/Pagination';
import { getUserByAddress } from 'redux/Auth/authCrud';

// material core
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// material icons
import SearchIcon from '@material-ui/icons/Search';
import FormGroup from '@material-ui/core/FormGroup';

// misc
import FadeIn from "react-fade-in";

import 'assests/css/discussion.css'
import { themeColor } from 'constant'
import DiscussionItem from './DiscussionItem'
import * as post from "redux/Post/postRedux";
import { searchPost, getallpostByPageNumber} from 'redux/Post/postCrud'
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 30,
    minWidth: 'auto',
  },
  actions: {
    display: 'flex',
    paddingBottom: 40,
  },
  cards: {
    width: '80%'
  },
  search: {
    borderRadius: 100,
    boxShadow: 'none',
    border: '1px solid #ADADAD',
    padding: 0,
    width:'auto !important',
    display: 'flex',
    [theme.breakpoints.down('sm')]:{
      width:'90vw !important',
    }
    
  },
  iconButton: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 25,
  },
  input: {
    width: '600px',
    fontSize: '20px',
    position:'relative'
  },
  pagination:{
    display:'flex',
    justifyContent: 'center',
    paddingTop: '40px',
    [theme.breakpoints.up('sm')]:{
      float: 'left'
    }
  },
  searchButton:{
    [theme.breakpoints.down('sm')]:{
      width:'300px !important',
    }
  },
  cards:{

    [theme.breakpoints.down('sm')]:{
      width:'fit-content',
    }

  }
}));

function Discussions(props) {
  const classes = useStyles();
  const [limitPost, setlimitPost] = React.useState(props.posts);
  const [page, setPage] = React.useState(1);
  const postonpage = 30;
  
  const [loading, setLoading] = React.useState(false);
  const displayPost = limitPost
  .map((post) => {
      return (
        <DiscussionItem history={props.history} post={post} key={post._id} userids={props.allUserIds} token={props.currentToken ? props.currentToken.token : null} />
             )
    });


  const [pageCount, setPageCount] = React.useState();

  const handleChangePage = (event, value) => {
    setLoading(true)
    var pageCount = value ;
    setPage(value);
    props.SetPageNumber(value);
    getallpostByPageNumber(pageCount, postonpage)
    .then(function(res){
      setlimitPost(res.data.result);
      setLoading(false)

    })
  };

  
  const serachPost = (e) =>{
    setLoading(true)
    var query = document.querySelector('#searchquery').value;
    searchPost(query)
    .then(function(res){
      setlimitPost(res.data.result);
      setLoading(false)
    })
    .catch((e) =>{
        if(e.response.status == 500 || e){
          alert('Post Not Found');
          setLoading(true)
      setPage(0);
      getallpostByPageNumber(1, postonpage)
      .then(({ data }) => {
        if (data.success) {
          setPageCount(data.total_page);
          setlimitPost(data.result);
          setLoading(false)
          
        } else {
          console.log("Readin posts failed!");
        }
      })
      .catch(() => {
        console.log("Reading posts error!");
      });
          
        }
    })
     
  };

  const resetSearch = (e) =>{
    if(e.target.value.length > 0 ){
      return;
    }else{ 
      setLoading(true)
      setPage(0);
      getallpostByPageNumber(1, postonpage)
      .then(({ data }) => {
        if (data.success) {
          setPageCount(data.total_page);
          setlimitPost(data.result);
          setLoading(false)
          
        } else {
          console.log("Readin posts failed!");
        }
      })
      .catch(() => {
        console.log("Reading posts error!");
      });

    }
  }

  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  React.useEffect(() => {

    setLoading(true)
    if(props.pageNumber != null){
      setPage(props.pageNumber);
      getallpostByPageNumber(props.pageNumber, postonpage)
      .then(({ data }) => {
        if (data.success) {
          setPageCount(data.total_page);
          setlimitPost(data.result);
          setLoading(false)
          
        } else {
          console.log("Readin posts failed!");
        }
      })
      .catch(() => {
        console.log("Reading posts error!");
      });

    }else{
      getallpostByPageNumber(1, postonpage)
      .then(({ data }) => {
        if (data.success) {
          setPageCount(data.total_page);
          setlimitPost(data.result);
          setLoading(false)
          
        } else {
          console.log("Readin posts failed!");
        }
      })
      .catch(() => {
        console.log("Reading posts error!");
      });

    }

    

  }, [props.posts]);

  
  return (
    <FadeIn>
      <div className={classes.root}>
        <div className={classes.actions}>
       
          <div >
           
            <Paper component="form" className={classes.search}>
              <IconButton className={classes.iconButton} aria-label="menu">
                <SearchIcon style={{ color: themeColor }} />
              </IconButton>
              <InputBase
                className={classes.input}
                placeholder="Type to search"
                id="searchquery"
                onChange={resetSearch}
                inputProps={{ 'aria-label': 'search' }}
              />
              <Button onClick={serachPost} className={classes.searchButton} style={{background: themeColor, borderRadius:'100px', height:'42px',width:'120px', color:'white'}}>Search</Button>

            </Paper>
            
          </div>
          
          
        </div>

        <div className={classes.cards}>
          {loading==false ? displayPost : <div>

            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />

          </div> }
          
          {loading==false ?
          <div className={classes.pagination}>
            {pageCount == 0 || pageCount == 1 ? null : <Pagination page={page} count={pageCount} color="primary" onChange={handleChangePage} /> }
          
          </div> : null}
        </div>

      </div>
    </FadeIn>
  )
}
export default connect(
  ({ auth, post }) => ({ currentUser: auth.currentUser, currentToken: auth.currentToken ,posts: post.posts, pageNumber: post.pageNumber, }),
  post.actions
)(Discussions);