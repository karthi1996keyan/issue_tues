const express=require('express');
const appConfig=require('./../../config/appConfig');

//controllers
const userController=require('./../controllers/userController');


let setRoute=(app)=>
{

    let baseUrl=appConfig.apiVersion+'/users';

    app.post(`${baseUrl}/signup`,userController.signUpFunction);

    
    app.post(`${baseUrl}/login`,userController.loginFunction);

    app.post(`${baseUrl}/logout`,userController.logoutFunction);

    app.put(`${baseUrl}/edit/:userId`,userController.editUser);

    app.get(`${baseUrl}/view/all`,userController.getAllUser);
    
    app.get(`${baseUrl}/view/:userId`,userController.getSingleUser);
    
    

}

module.exports=
{
    setRoute:setRoute
}