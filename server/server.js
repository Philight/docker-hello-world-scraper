const express = require("express");
const got = require('got');
require('dotenv').config()
var serveStatic = require('serve-static')
const bodyParser = require("body-parser");
const open = require('open');

var http = require('http');
const fs = require('fs')
const path = require("path");

const APPNAME = process.env.APPNAME;
const PORT = parseInt(process.env.PORT, 10) || 80;
const HOSTNAME = process.env.HOSTNAME;
const CLIENTPORT = process.env.CLIENTPORT;
//const TARGET_URL = process.env.TARGET_URL;
//const DIST_DIR = path.join(__dirname, "dist");
//const HTML_FILE = path.join(DIST_DIR, "index.html");

const database = require(path.join(process.cwd(), 'src', 'database.js'));

const { 
  runHeadlessBrowser,
} = require(path.join(process.cwd(), 'src', 'headlessBrowser.js'));

const { 
  getCurrentDate,
} = require(path.join(process.cwd(), 'src', 'util.js'));


const FRONTEND_CLIENT = `http://localhost:${CLIENTPORT}`;


/********** 
     SERVER CONFIG
*********/

var server = express();

//server.use(express.json()); // removing solved - PAYLOAD TOO LARGE ERROR
server.use(bodyParser.json({ limit: '50mb' }));
//server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

const cors=require("cors");
const corsOptions ={
   origin: '*', 
   credentials: true,            //access-control-allow-credentials:true
   optionSuccessStatus: 200,
}
server.use(cors(corsOptions)); // Use this after the variable declaration

// SERVE Folders/Files

server.use(express.static("../client/build"));
//server.use(express.static(path.join(process.cwd(), '../', 'client'));
//server.use(serveStatic('../client/build'));


/********** 
    INITIAL ACTIONS
*********/

const doInitialActions = async () => {
console.log(`### ${APPNAME} | PERFORMING INITIAL ACTIONS..`);


console.log(`--- ${APPNAME} | Connecting to Database..`);
  await database.openDBConnection(); 

  if (!await database.areThereDBRecords()) {
console.log(`### ${APPNAME} | Database records missing, starting HeadlessBrowser..`);
    const scrapeStatus = await runHeadlessBrowser();
console.log(`+++ ${APPNAME} | Scraping COMPLETE. Opening client..`);
console.log('----------------------------------------------');
console.log(`+++ ${APPNAME} @ ${FRONTEND_CLIENT}`);
console.log('----------------------------------------------');
    open(FRONTEND_CLIENT);
  
  } else {
console.log(`+++ ${APPNAME} | Opening client..`);
console.log('----------------------------------------------');
console.log(`+++ ${APPNAME} @ ${FRONTEND_CLIENT}`);
console.log('----------------------------------------------');
    open(FRONTEND_CLIENT);
  }

}

doInitialActions();


/********** 
    ROUTES
*********/

server
   .get('/', (req, res) => {
console.log(`### ${APPNAME} | GET / "APP ROOT"`);
        res.sendFile(path.join(process.cwd(), '../', 'client', 'build', 'index.html'));
   })

   .get('/test', (req, res) => {
console.log(`### ${APPNAME} | GET /test "TEST"`);
        const jsonRes = 'TEST';
        res.status(200).json({ response: jsonRes });
   })

   .use('/database', database.router)



/********** 
    START server
*********/


// HTTP

http.createServer(server)
   .listen(PORT, (err) => {
      if (!!err) {
         const errMsg = `--- ${APPNAME.toUpperCase()} | Failed to start HTTP server\n`+err+(err && err.stack);
         console.error(errMsg);

      } else {
         console.log('----------------------------------------------');
         console.log(`+++ ${APPNAME.toUpperCase()} | HTTP server OK @ http://${HOSTNAME}:${PORT}`);

         const dateNow = getCurrentDate();
         console.log(`$$$ ${APPNAME.toUpperCase()} | SERVER START: ${dateNow}`);
         console.log('----------------------------------------------');
      }
   });