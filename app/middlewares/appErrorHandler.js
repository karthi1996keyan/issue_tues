/**
 * App Error Handling Events
 */

 const response=require('./../libs/responseLib');
 const loggerLib=require('./../libs/loggerLib');
 
 let errorHandler=(err,req,res,next)=>
 {
    loggerLib.captureError(err+'Error at global Level','appErrorHandler',10);
    let apiresponse=response.generate(true,'Some error occured at global level',500,null);
    res.send(apiresponse);
 } // end error handler 

 let notFoundHandler=(req,res,next)=>
 {
     let apiresponse=response.generate(true,'Route Not Found',404,null);
     res.send(apiresponse);
 } //end not found handler

 module.exports=
 {
     errorHandler:errorHandler,
     notFoundHandler:notFoundHandler
 }
