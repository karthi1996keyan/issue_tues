const express=require('express');
const app=express();
const mongoose=require('mongoose');
const http=require('http');
const bodyParser=require('body-parser');
const fs=require('fs');
const morgan=require('morgan');

//import config module 
const appConfig=require('./config/appConfig');

//import library's here
const loggerLib=require('./app/libs/loggerLib');

//include middleware here
const appErrorHandler=require('./app/middlewares/appErrorHandler');
const routeLogger=require('./app/middlewares/routeLogger');


/**
 * middlwares starts here
 */

 app.use(morgan('dev'));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:false}));
 app.use(routeLogger.logIp);
 app.use(appErrorHandler.errorHandler);

 //cors config 

 app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", appConfig.allowedOrgins);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
 }); //end cors config

/**
 * add all the models in the models folder
 * using fs
 */

 let modelPath='./app/models';
 fs.readdirSync(modelPath).forEach(
     function(file)
     {
         if(~file.indexOf('.js'))
         {
             require(modelPath+'/'+file);
         }
     }
 )//end models


/**
 * add all the  routes in the routes folder 
 * using fs
 */

 let routePath='./app/routes';
 fs.readdirSync(routePath).forEach(
     function(file)
     {
         if(~file.indexOf('.js'))
         {
            let route=require(routePath+'/'+file);
            route.setRoute(app);
         }
     }
 ) //end routes 

app.use(appErrorHandler.notFoundHandler);

/**
 * server  configuration starts here 
 * create server  using http module 
 * listening server
 */

 const server=http.createServer(app);
 console.log(appConfig);
 server.listen(appConfig.port);
 server.on('error',onError);
 server.on('listening',onListening);

 /**
  * handling server error
  */
 function onError(error)
 {
     if(error.syscall != 'listen')
     {
         loggerLib.captureError(error.code+'Syscall is  not listening','ServerErrorHandler:OnError',10);
         throw error;
     }

     switch(error.code)
     {
         case 'EACCES':
            loggerLib.captureError(error.code+'Eleveted previlege is missing','ServerHandler:OnError',10)
            process.exit(1);
            break;
         case 'EADDRINUSE':
            loggerLib.captureError(error.code+'Listening Port Address is running some where.Stop the running server or change port','ServerHandler:OnError',10)
            process.exit(1);
            break;
         default:
            loggerLib.captureError(error.code+'Some unknown error occured','ServerHandler:OnError',10)
            throw error;
        }
 } //end error handling event

 /**
  *  handling event for listening port 
  */

  function onListening()
  {
      let addr=server.address();
      let bind= typeof addr === 'string' ? 
                'pipe '+ addr :
                addr.port;
      loggerLib.captureInfo('Server is listening in port '+bind,'ServerHandler:onListening',10);
      let db=mongoose.connect(appConfig.databaseUrl,{useNewUrlParser:true,useCreateIndex:true});
  } //end onlistening function here

  /**
   * handling event of unhandled rejection
   */
  process.on('unhandledRejection',(reason,p)=>
  {
    loggerLib.captureError('Unhandled Rejection ->  Promise : '+p+' Reason : '+reason,'UnhandledRejection:process',10);
  }); 

  /**
   * mongoose handling events
   */

   mongoose.connection.on('error',(err)=>
   {
        loggerLib.captureError(err,'Mongoose Connection error handler',10);
   });

   mongoose.connection.on('open',(err)=>
   {
        if(err)
        {
            loggerLib.captureError(err,'Mongoose Connection error handler',10);
        }
        else
        {
            loggerLib.captureInfo('Database connection established successfully','Mongoose Connection  handler',10);
        }
   }); //end mongoose handling 

