/**
 * password generate using bcrypt to 
 * make password encrypted and protect 
 */
const bcrypt=require('bcrypt');
const saltRounds=10;

//hash password

let hashPassword=(password)=>
{
    let salt=bcrypt.genSaltSync(saltRounds);
    let hash=bcrypt.hashSync(password,salt);
    return hash;
} // end hash password

/**
 * check old password and new password here
 */

let checkPassword=(oldpassword,newpassword,cb)=>
{
    bcrypt.compare(oldpassword,newpassword,(err,decode)=>
    {
        if(err)
        {
            cb(err,null);
        }
        else
        {
            cb(null,decode);
        }
    });//end compare function

}//end checkpassword function


module.exports=
{
    hashPassword:hashPassword,
    checkPassword:checkPassword
}

