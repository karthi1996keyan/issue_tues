/**
 * module for parameter validation
 */

 /**
  * email validation starts here
  */

  let email=(email)=>
  {
      let emailPattern=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})$/
      if(email.match(emailPattern))
      {
          return true;
      }
      else
      {
          return false;
      }
  }// end email validation

  /**
   * start password validation
   */


   let password=(password)=>
   {
       let passwordPattern=/^[A-Za-z0-9@#%^!&*$]{8,14}$/;
       if(password.match(passwordPattern))
       {
           return true;
       }
       else
       {
           return false;
       }
   } //end password validation

module.exports=
{
    email:email,
    password:password
}

