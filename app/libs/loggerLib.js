/**
 * Alternate for console.log cause it is sync function
 * it might slow down api call little bit
 *  'pino' is a module to replace console.log and it is purely async in nature
 */

const logger=require('pino')();
const moment=require('moment');

/**
 * capture error function starts
 */

 let captureError=(errorMessage,errorOrgin,errorLevel)=>
 {
     let timeStamp=moment();
     let errorResponse=
     {
         errorMessage:errorMessage,
         errorOrgin:errorOrgin,
         errorLevel:errorLevel,
         timeStamp:timeStamp
     }
     logger.error(errorResponse);
 }//end capture error function

 /**
  * capture info function starts
  */

  let captureInfo=(infoMessage,infoOrgin,infoLevel)=>
  {
      let timeStamp=moment();
      let infoResponse=
      {
          infoMessage:infoMessage,
          infoOrgin:infoOrgin,
          infoLevel:infoLevel,
          timeStamp:timeStamp
      }
      logger.info(infoResponse);
  } // end capture info funtion

module.exports=
{
    captureError:captureError,
    captureInfo:captureInfo
}

