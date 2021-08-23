"use strict"

require("./config/config")

const express = require('express');
const fs = require('fs');
const routePath = './pollo-backend/routes/';
const app = express();
const path = require('path');
const http = require('http');
const swaggerUi = require('./node_modules/swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');

var port = process.env.PORT || 3000;
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.listen(port, process.env.HOST, function(){
    console.log("The server is listening at http://" + process.env.HOST + ":" + port)
});

//Used internally while devlopement as forntend run on different port
//app.use(cors({origin: 'http://localhost:3001'}));

// Settings
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './pollo-frontend/build')));
app.use('/', express.static(path.join(__dirname, './pollo-frontend/build')));


//Swagger
app.use('/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument));

// Load Routes Dynamically
fs
  .readdirSync(routePath).forEach(function(file) {
    try{
      var routeFile = require(routePath + file);
      app.use('/api', routeFile) ;
    } catch(ex){
      console.log(file,"----err",ex);
    }
});

module.exports = app;
