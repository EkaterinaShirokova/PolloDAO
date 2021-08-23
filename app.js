"use strict"

require("./pollo-backend/config/config")

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const routePath = './pollo-backend/routes/';
const app = express();
const path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http/*, {
  cors: {
    origin: 'https://pollodao.finance',
  }
}*/);
const swaggerUi = require('./pollo-backend/node_modules/swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');

var port = process.env.PORT || 3000;

//console.log(fs.readFileSync(process.env.SSL_KEY))
// if(typeof process.env.SSL_KEY != "undefined" && typeof process.env.SSL_CERT != "undefined" ){
//   http = require('https').createServer({
//     key: fs.readFileSync(process.env.SSL_KEY),
//     cert: fs.readFileSync(process.env.SSL_CERT),
//   }, app)
//   io = require('socket.io')(http);
// }

var cookieParser = require('cookie-parser');
app.use(cookieParser());

// app.listen(port, process.env.HOST, function() {
//   console.log("The main server is running at http://" + process.env.HOST + ":" + port);
// })
//Used internally while devlopement as forntend run on different port
//app.use(cors({origin: 'http://localhost:3001'}));

// Settings
// app.use(cors({ origin: 'https://pollodao.finance' }));
app.use(cors({origin: 'http://localhost:3001'}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './pollo-frontend/build/static')));
app.use('/', express.static(path.join(__dirname, './pollo-frontend/build')));
app.use((req, res, next) => {
    if(!req.headers.host.startsWith("localhost") && !req.headers.host.startsWith("pollodao.finance")){
      res.sendStatus(403);
      return;
    }
    next();
});


//Swagger
app.use('/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument));


// Load Routes Dynamically
fs
  .readdirSync(routePath).forEach(function (file) {
    try {
      var routeFile = require(routePath + file);
      app.use('/api', routeFile);
    } catch (ex) {
      console.log(file, "----err", ex);
    }
  });

app.get('/*', function (req, res) {
  res.sendFile(path.resolve(__dirname, './pollo-frontend/build/index.html'));
});

var clients = {};

io.on("connection", function (client) {
  client.on("sign-in", e => {
    //console.log(" new user >>>>> ", e);
    let user_id = e.userId.toLowerCase();
    if (!user_id) return;
    client.user_id = user_id;
    if (clients[user_id]) {
      clients[user_id].push(client);
    } else {
      clients[user_id] = [client];
    }
    console.log("sign-in clients => ", clients);
  });

  client.on("newThread", data => {
    console.log(data,"---data");
    data.userList.map(userId => {
      let targetId = userId.toLowerCase();
      let message = data.content;
      let from = data.from;
      // let sourceId = client.user_id;
      console.log(message);
      if (targetId && clients[targetId]) {
        console.log(targetId);
        clients[targetId].forEach(cli => {
          console.log(cli);
          cli.emit("newThread", message, from);
        });
      }

      // if (sourceId && clients[sourceId]) {
      //   clients[sourceId].forEach(cli => {
      //     cli.emit("message", e);
      //   });
      // }

    })
  });

  client.on("disconnect", function () {
    if (!client.user_id || !clients[client.user_id]) {
      return;
    }
    let targetClients = clients[client.user_id];
    for (let i = 0; i < targetClients.length; ++i) {
      if (targetClients[i] == client) {
        targetClients.splice(i, 1);
      }
    }
  });
});

http.listen(port, function () {
  console.log("The server is listening at http://" + process.env.HOST + ":" + port)
});

// http.listen(port, function () {
//   console.log("The server is listening at http://" + process.env.HOST + ":" + port)
// });
// module.exports = app;
