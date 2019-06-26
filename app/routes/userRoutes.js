const express=require('express');
const appConfig=require('./../../config/appConfig');

//controllers
const userController=require('./../controllers/userController');

//middlewares
const auth=require('./../middlewares/auth');

let setRoute=(app)=>
{

    let baseUrl=appConfig.apiVersion+'/users';

    app.post(`${baseUrl}/signup`,userController.signUpFunction);

    
    app.post(`${baseUrl}/login`,userController.loginFunction);

    app.post(`${baseUrl}/logout`,auth.isAuthorized,userController.logoutFunction);

    app.put(`${baseUrl}/edit/:userId`,auth.isAuthorized,userController.editUser);

    app.get(`${baseUrl}/view/all`,auth.isAuthorized,userController.getAllUser);
    
    app.get(`${baseUrl}/view/:userId`,auth.isAuthorized,userController.getSingleUser);

    app.post(`${baseUrl}/delete/:userId`,auth.isAuthorized,userController.deleteSingleUser);
    
    

}

module.exports=
{
    setRoute:setRoute
}