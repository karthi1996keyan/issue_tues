const mongoose=require('mongoose');

//models
const authModel=mongoose.model('auth');

//libs
const timeLib=require('./../libs/timeLib');
const checkLib=require('./../libs/checkLib');
const responseLib=require('./../libs/responseLib');
const loggerLib=require('./../libs/loggerLib');
const tokenLib=require('./../libs/tokenLib');

let isAuthorized=(req,res,next)=>
{
    if(req.params.authToken || 
        req.query.authToken || 
        req.body.authToken ||
        req.header('authToken'))
        {
            authModel.findOne({token:req.params.authToken || 
                req.query.authToken || 
                req.body.authToken ||
                req.header('authToken')})
                .exec((err,success)=>
                {
                    if(err)
                    {
                        loggerLib.captureError('error at auth token','auth:middleware',10);
                        let apiresponse=responseLib.generate(true,'Failed to fetch auth token details',500,null);
                        res.send(apiresponse);
                    }
                    else if(checkLib.isEmpty(success))
                    {
                        loggerLib.captureError('Invalid or expired auth token','auth:middleware',10);
                        let apiresponse=responseLib.generate(true,'Invalid or expired auth token',404,null);
                        res.send(apiresponse);
                    }
                    else
                    {
                        tokenLib.compareTokenWithoutSecretkey(success.token,(err,tokendetails)=>
                        {
                            if(err)
                            {
                                loggerLib.captureError('error at auth token','auth:middleware',10);
                                let apiresponse=responseLib.generate(true,'Failed to fetch auth token details',500,null);
                                res.send(apiresponse);
                            }
                            req.user={userId:tokendetails.data.userId};
                            next();
                        });
                    }
                });
        }
        else
        {
            loggerLib.captureError('Auth token is missing','auth:middleware',10);
            let apiresponse=responseLib.generate(true,'Auth Token is missing',400,null);
            res.send(apiresponse);
        }
}//end authorizing

module.exports=
{
    isAuthorized:isAuthorized
}