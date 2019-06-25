const jwt=require('jsonwebtoken');
const shortId=require('shortid');
const secretKey="SomeRandomPASSWORDthatNoOneCANGuesS";

/**
 * generate token
 */

let generateToken=(data,cb)=>
{
    try
    {
        let claims=
        {
            jwtid:shortId.generate(),
            iat:Date.now(),
            exp:Math.floor(Date.now()/1000) + (60*60*24),
            sub:'authToken',
            iss:'Issue Tracking Tool',
            data:data
        }
        let tokenDetails=
        {
            token:jwt.sign(claims,secretKey),
            secretKey:secretKey
        }
        cb(null,tokenDetails);
    }
    catch
    {
        cb(err,null);
    }
} //end generate token

/**
 * compare token
 */

 let compareToken=(token,secretKey,cb)=>
 {
     jwt.verify(token,secretKey,(err,data)=>
     {
         if(err)
         {
             cb(err,null);
         }
         else
         {
             cb(null,data);
         }
     })
 } //end compare token

 /**
  * compare token without secretkey
  */

  let compareTokenWithoutSecretkey=(token,cb)=>
  {
    jwt.verify(token,secretKey,(err,data)=>
    {
        if(err)
        {
            cb(err,null);
        }
        else
        {
            cb(null,data);
        }
    })
  } //end compare token without secretkey

  module.exports=
  {
      generateToken:generateToken,
      compareToken:compareToken,
      compareTokenWithoutSecretkey:compareTokenWithoutSecretkey
  }