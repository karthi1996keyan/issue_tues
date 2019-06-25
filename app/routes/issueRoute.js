const express=require('express');
const appConfig=require('../../config/appConfig');
const multer=require('./../services/multer');
//controllers
const issueController=require('../controllers/issueController');


let setRoute=(app)=>
{

    let baseUrl=appConfig.apiVersion+'/issue';


    app.post(`${baseUrl}/create`,issueController.createIssue);
    
    
    app.post(`${baseUrl}/edit/:issueId`,issueController.editIssue);

    app.post(`${baseUrl}/delete/:issueId`,issueController.deleteIssue);
    app.get(`${baseUrl}/view/all`,issueController.getAllIssue);

    
    app.get(`${baseUrl}/view/:issueId`,issueController.getSingleIssue);
    
    app.post(`${baseUrl}/watch`,issueController.createWatchList);
    
    app.get(`${baseUrl}/view/watch`,issueController.getWatcher);

    
    app.post(`${baseUrl}/add/comment`,issueController.addComment);

    
    app.get(`${baseUrl}/view/comment/:issueId`,issueController.readComment);

    
    app.get(`${baseUrl}/notifications/:userId`,issueController.getAllnotifications);

    app.put(`${baseUrl}/notify/count`,issueController.countUpdate);
    

    app.post(`${baseUrl}/images/upload`,multer.upload.single('file'),multer.uploadFile);

    app.get(`${baseUrl}/images/all`,multer.getAllFiles);

    
    app.get(`${baseUrl}/image/:fileName`,multer.getSingleFile);

    app.get(`${baseUrl}/image/download/:fileName`,multer.downloadFiles);

    app.delete(`${baseUrl}/image/delete/:fileName`,multer.deleteFiles);

}

module.exports=
{
    setRoute:setRoute
}