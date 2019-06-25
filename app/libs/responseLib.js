/**
 * Standardizing api response for the application
 */

 let generate=(error,message,status,data)=>
 {
    let response={
        error:error,
        message:message,
        status:status,
        data:data
    }
    return response;
 } // end response library

 module.exports=
 {
     generate:generate
 }
