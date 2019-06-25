const mongoose=require('mongoose');
const shortId=require('shortid');

//include all library's here
const checkLib=require('../libs/checkLib');
const loggerLib=require('../libs/loggerLib');
const paramValidationLib=require('../libs/paramValidationLib');
const passwordGeneratorLib=require('../libs/passwordGeneratorLib');
const responseLib=require('../libs/responseLib');
const timeLib=require('../libs/timeLib');
const tokenLib=require('../libs/tokenLib');

//include all models here
const userModel=mongoose.model('user');
const authModel=mongoose.model('auth');

/**
 * api function starts here
 */

 /**
  * Signup function starts here
  * @param {String} firstName 
  * @param {String} lastName 
  * @param {String} mobileNumber 
  * @param {String} password 
  * @param {String} email 
  */

 let signUpFunction=(req,res)=>
 {
    /**
     * validate user inputs
     */
    let validateUserInput=()=>
    {
        return new Promise((resolve,reject)=>
        {
            if(req.body.email)
            {
                if(!paramValidationLib.email(req.body.email))
                {
                    loggerLib.captureError('Email does not met the requirement','signupFunction:validateUserInput',10);
                    let apiresponse=responseLib.generate(true,'Email does not met the requirement',400,null);
                    reject(apiresponse);
                }
                else if(checkLib.isEmpty(req.body.password))
                {
                    loggerLib.captureError('password is missing','signupFunction:validateUserInput',10);
                    let apiresponse=responseLib.generate(true,'Password is missing',400,null);
                    reject(apiresponse);
                }
                else if(!paramValidationLib.password(req.body.password))
                {
                    loggerLib.captureError('Password  does not met the requirement','signupFunction:validateUserInput',10);
                    let apiresponse=responseLib.generate(true,'Password  does not met the requirement',400,null);
                    reject(apiresponse);
                }
                else
                {
                    resolve(req);
                }
            }
            else
            {
                loggerLib.captureError('Field missing while creating user','signupFunction:validateUserInput',10);
                let apiresponse=responseLib.generate(true,'One or more parameter is missing',404,null);
                reject(apiresponse);
            }
        });//end promise
    }//end validateuserinput


    /**
     * check user is already present or not
     * create user 
     */

     let createUser=()=>
     {
         return new Promise((resolve,reject)=>
         {
            userModel.findOne({email:req.body.email})
            .exec((err,userDetails)=>
            {
                if(err)
                {
                    loggerLib.captureError('Error while find user'+err.message,'signupFunction:createUser',10);
                    let apiresponse=responseLib.generate(true,'Failed to create user',500,null);
                    reject(apiresponse);
                }
                else if(checkLib.isEmpty(userDetails))
                {
                    let newUser=new userModel(
                        {
                            userId:shortId.generate,
                            firstName:req.body.firstName,
                            lastName:req.body.firstName,
                            email:req.body.email,
                            password:passwordGeneratorLib.hashPassword(req.body.password),
                            mobileNumber:req.body.mobileNumber,
                            createdOn:timeLib.now()
                        }
                    );//end newUser

                    newUser.save((err,success)=>
                    {
                        if(err)
                        {
                            loggerLib.captureError('Error while create new user','signupFunction:createUser',10);
                            let apiresponse=responseLib.generate(true,'Failed to create user',500,null);
                            reject(apiresponse);
                        }
                        else
                        {
                            resolve(success);
                        }
                    });
                }
                else
                {
                    loggerLib.captureError('User already registered','signupFunction:createUser',10);
                    let apiresponse=responseLib.generate(true,'User already registered',403,null);
                    reject(apiresponse);
                }
            });//end usermodel
         });//end promise
     }//end create user

     validateUserInput(req,res)
     .then(createUser)
     .then(
         (success)=>
         {
             let apiresponse=responseLib.generate(false,'User created successfully',200,success);
             res.send(apiresponse);
         }
     )
     .catch(
         (errResponse)=>
         {
             res.send(errResponse);
         }
     )

 }//end signupfunction

 /**
  * login function
  */

  let loginFunction=(req,res)=>
  {
      /**
       * validate user inputs
       */
      
    let validateUserInput=()=>
    {
        return new Promise((resolve,reject)=>
        {
            if(req.body.email)
            {
                if(!paramValidationLib.email(req.body.email))
                {
                    loggerLib.captureError('Email does not met the requirement','loginFunction:validateUserInput',10);
                    let apiresponse=responseLib.generate(true,'Email  does not met the requirement',400,null);
                    reject(apiresponse);
                }
                else if(checkLib.isEmpty(req.body.password))
                {
                    loggerLib.captureError('password is missing','loginFunction:validateUserInput',10);
                    let apiresponse=responseLib.generate(true,'Password is missing',400,null);
                    reject(apiresponse);
                }
                else
                {
                    resolve(req);
                }
            }
            else
            {
                loggerLib.captureError('Field missing while logging user','loginFunction:validateUserInput',10);
                let apiresponse=responseLib.generate(true,'One or more parameter is missing',404,null);
                reject(apiresponse);
            }
        });//end promise
    }//end validateuserinput

    /**
     * Find User
     */
    let findUser=()=>
    {
        return new Promise(
            (resolve,reject)=>
            {
                userModel.findOne({email:req.body.email})
                .lean()
                .exec(
                    (err,userDetails)=>
                    {
                        if(err)
                        {
                            loggerLib.captureError('Error while  find user','loginFunction:findUser',10);
                            let apiresponse=responseLib.generate(true,'Failed to fetch user details',500,null);
                            reject(apiresponse);
                        }
                        else if(checkLib.isEmpty(userDetails))
                        {
                            loggerLib.captureError('user not registered','loginFunction:findUser',10);
                            let apiresponse=responseLib.generate(true,'User not found',404,null);
                            reject(apiresponse);
                        }
                        else
                        {
                            resolve(userDetails);
                        }
                    }
                )
            }
        )
    } //end find user 

    /**
     * validate  password using bcrypt
     */

     let validatePassword=(retrievedUserDetails)=>
     {
         return new Promise(
             (resolve,reject)=>
             {
                 passwordGeneratorLib.checkPassword(req.body.password,retrievedUserDetails.password,(err,data)=>
                 {
                     if(err)
                     {
                        loggerLib.captureError('Error while  validate password','loginFunction:validatePassword',10);
                        let apiresponse=responseLib.generate(true,'Failed to validate password',500,null);
                        reject(apiresponse);
                     }
                     else if(data)
                     {
                        delete retrievedUserDetails.password;
                        delete retrievedUserDetails.__v;
                        delete retrievedUserDetails._id;
                        delete retrievedUserDetails.createdOn;
                        resolve(retrievedUserDetails);
                     }
                     else
                     {
                        loggerLib.captureError('wrong password','loginFunction:validatePassword',10);
                        let apiresponse=responseLib.generate(true,'Wrong Password . Login Failed',400,null);
                        reject(apiresponse);
                     }
                 });
             }
         ) //end promise 
     }//end validate password

     /**
      * generate token 
      */

      let generateToken=(retrievedUserDetails)=>
      {
          return new Promise(
              (resolve,reject)=>
              {
                  tokenLib.generateToken(retrievedUserDetails,(err,tokendetails)=>
                  {
                    if(err)
                    {
                        loggerLib.captureError('Error while  generate token','loginFunction:generateToken',10);
                        let apiresponse=responseLib.generate(true,'Failed to generate token',500,null);
                        reject(apiresponse);
                    }
                    else
                    {
                        tokendetails.userId=retrievedUserDetails.userId;
                        tokendetails.userDetails=retrievedUserDetails;
                        resolve(tokendetails);
                    }
                  });
              }
          )//end promise
      }//end generate token

      /**
       * save token
       */

       let saveToken=(tokenDetailsToSave)=>
       {
           return new Promise(
               (resolve,reject)=>
               {
                   authModel.findOne({userId:tokenDetailsToSave.userId})
                   .exec(
                       (err,tokenDataFromDB)=>
                       {
                           if(err)
                           {
                                loggerLib.captureError('Error while  save token','loginFunction:saveToken',10);
                                let apiresponse=responseLib.generate(true,'Failed to save token . Login failed',500,null);
                                reject(apiresponse);
                           }
                           else if(checkLib.isEmpty(tokenDataFromDB))
                           {
                               let newToken=new authModel(
                                   {
                                       userId:tokenDetailsToSave.userId,
                                       token:tokenDetailsToSave.token,
                                       secretKey:tokenDetailsToSave.secretKey,
                                       tokenGenerationTime:timeLib.now()
                                   }
                               );
                               newToken.save(
                                   (err,success)=>
                                   {
                                       if(err)
                                       {
                                            loggerLib.captureError('Error while  save token','loginFunction:saveToken',10);
                                            let apiresponse=responseLib.generate(true,'Failed to save token . Login failed',500,null);
                                            reject(apiresponse);
                                       }
                                       else
                                       {
                                           let response=
                                           {
                                               authToken:success.token,
                                               userDetails:tokenDetailsToSave.userDetails
                                           }
                                           resolve(response);
                                       }
                                   }
                               )

                           } //end else if
                           else
                           {
                               tokenDataFromDB.token=tokenDetailsToSave.token;
                               tokenDataFromDB.secretKey=tokenDetailsToSave.secretKey;
                               tokenDataFromDB.tokenGenerationTime=timeLib.now();

                               tokenDataFromDB.save(
                                (err,success)=>
                                {
                                    if(err)
                                    {
                                         loggerLib.captureError('Error while  save token','loginFunction:saveToken',10);
                                         let apiresponse=responseLib.generate(true,'Failed to save token . Login failed',500,null);
                                         reject(apiresponse);
                                    }
                                    else
                                    {
                                        let response=
                                        {
                                            authToken:success.token,
                                            userDetails:tokenDetailsToSave.userDetails
                                        }
                                        resolve(response);
                                    }
                                }
                               )
                           }
                       }
                   )
               }//end promise
           )
       }//save token

       validateUserInput(req,res)
       .then(findUser)
       .then(validatePassword)
       .then(generateToken)
       .then(saveToken)
       .then(
           (success)=>
           {
               let apiresponse=responseLib.generate(false,'Login Successfully',200,success);
               res.send(apiresponse);
           }
       )
       .catch(
           (errResponse)=>
           {
               res.send(errResponse);
           }
       )

  }//end login function


  /**
   * Get all user details 
   */

  let getAllUser=(req,res)=>
  {
      userModel.find()
      .select('-_id -password - __v')
      .lean()
      .exec(
          (err,allUserDetails)=>
          {
            if(err)
            {
                loggerLib.captureError('Error while fetch all user details','getAllUser()',10);
                let apiresponse=responseLib.generate(true,'Failed to fetch user details',500,null);
                res.send(apiresponse);
            }
            else if(checkLib.isEmpty(allUserDetails))
            {
                loggerLib.captureInfo('No user details found','getAllUser()',10);
                let apiresponse=responseLib.generate(true,'No user found',404,null);
                res.send(apiresponse);
            }
            else
            {
                let apiresponse=responseLib.generate(false,'Users found successfully',200,allUserDetails);
                res.send(apiresponse);
            }
          }
      )
      
   }//end get all user


   /**
    * get single user details 
    * @params {String} userId
    */

    let getSingleUser=(req,res)=>
    {
        userModel.find({userId:req.params.userId})
      .select('-_id -password - __v')
      .lean()
      .exec(
          (err,userDetails)=>
          {
            if(err)
            {
                loggerLib.captureError('Error while fetch user details','getSingleUser()',10);
                let apiresponse=responseLib.generate(true,'Failed to fetch user details',500,null);
                res.send(apiresponse);
            }
            else if(checkLib.isEmpty(userDetails))
            {
                loggerLib.captureInfo('No user details found','getSingleUser()',10);
                let apiresponse=responseLib.generate(true,'No user found',404,null);
                res.send(apiresponse);
            }
            else
            {
                let apiresponse=responseLib.generate(false,'User found successfully',200,userDetails);
                res.send(apiresponse);
            }
          }
      )
    } // end get single user 

    /**
    * delete single user  
    * @params {String} userId
    */

   let deleteSingleUser=(req,res)=>
   {
       userModel.findOneAndRemove({userId:req.params.userId})
       .exec(
         (err,userDetails)=>
         {
           if(err)
           {
               loggerLib.captureError('Error while delete user details','deleteSingleUser()',10);
               let apiresponse=responseLib.generate(true,'Failed to delete user details',500,null);
               res.send(apiresponse);
           }
           else if(checkLib.isEmpty(userDetails))
           {
               loggerLib.captureInfo('No user details found','deleteSingleUser()',10);
               let apiresponse=responseLib.generate(true,'No user found',404,null);
               res.send(apiresponse);
           }
           else
           {
               let apiresponse=responseLib.generate(false,'User deleted successfully',200,userDetails);
               res.send(apiresponse);
           }
         }
     )
   } // end delete single user 

   /**
    * Edit user details 
    * @params {String} userId
    */

   let editUser=(req,res)=>
   {
       let options=req.body;
       userModel.updateOne({userId:req.params.userId},options)
       .exec(
         (err,userDetails)=>
         {
           if(err)
           {
               loggerLib.captureError('Error while update user details','editUser()',10);
               let apiresponse=responseLib.generate(true,'Failed to update user details',500,null);
               res.send(apiresponse);
           }
           else if(checkLib.isEmpty(userDetails))
           {
               loggerLib.captureInfo('No user details found','editUser()',10);
               let apiresponse=responseLib.generate(true,'No user found',404,null);
               res.send(apiresponse);
           }
           else
           {
               let apiresponse=responseLib.generate(false,'User updated successfully',200,userDetails);
               res.send(apiresponse);
           }
         }
     )
   } // end edit user 

   
    /**
    * logout    
    * @params {String} userId
    */

   let logoutFunction=(req,res)=>
   {
      authModel.findOneAndRemove({userId:req.body.userId})
      .exec(
         (err,result)=>
         {
           if(err)
           {
               loggerLib.captureError('Error while logout user ','logout()',10);
               let apiresponse=responseLib.generate(true,'Failed to logout user ',500,null);
               res.send(apiresponse);
           }
           else if(checkLib.isEmpty(userDetails))
           {
               loggerLib.captureInfo('No user details found','logout()',10);
               let apiresponse=responseLib.generate(true,'Invalid user or user already logged out   ',404,null);
               res.send(apiresponse);
           }
           else
           {
               let apiresponse=responseLib.generate(false,'User logged out  successfully',200,userDetails);
               res.send(apiresponse);
           }
         }
     )
   } // end logout 

   
module.exports=
{
    signUpFunction:signUpFunction,
    loginFunction:loginFunction,
    logoutFunction:logoutFunction,

    editUser:editUser,
    getAllUser:getAllUser,
    getSingleUser:getSingleUser,
    deleteSingleUser:deleteSingleUser
}