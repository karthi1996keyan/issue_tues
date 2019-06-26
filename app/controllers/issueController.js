const mongoose=require('mongoose');
const shortId=require('shortid');

//libs
const timeLib=require('./../libs/timeLib');
const checkLib=require('./../libs/checkLib');
const loggerLib=require('./../libs/loggerLib');
const responseLib=require('./../libs/responseLib');

//models
const commentModel=mongoose.model('comment');
const issueModel=mongoose.model('issue');
const watcherModel=mongoose.model('watcher');
const notification=mongoose.model('notification')

//Api starts here


/**
 * create issue
 * @param {String} status 
 * @param {String} title 
 * @param {String} description 
 * @param {String} reporter 
 * @param {String} reporterId 
 * @param {String} assignedTo 
 * @param {String} assignedToId 
 * @param {String<>} images 
 */
let createIssue=(req,res)=>
{
    if(req.body.images === undefined || req.body.images === null)
    {
        req.body.images='';
    }
    let newIssue=new issueModel(
        {
            issueId:shortId.generate(),
            status:req.body.status,
            title:req.body.title,
            description:req.body.description,
            reporter:req.body.reporter,
            reporterId:req.body.reporter,
            assignedTo:req.body.assignedTo,
            assignedToId:req.body.assignedToId,
            images:req.body.images.split(','),
            createdOn:timeLib.now()
        }
    )//end new issue

    newIssue.save(
        (err,issueDetails)=>
        {
            if(err)
            {
                loggerLib.captureError(err+'Error while creating issue','issueController:createIssue',10);
                let apiresponse=responseLib.generate(true,'Failed to create issue',500,null);
                res.send(apiresponse);
            }
            else
            {
                    //save reporter notification
                    let reporterNotify=new notification(
                        {
                            issueId:issueDetails.issueId,
                            description:"your issue has been posted successfully",
                            userId:issueDetails.reporterId,
                            createdOn:timeLib.now()
                         }
                    )
                    reporterNotify.notificationCount=1;
                    reporterNotify.save();

                    //save assigned user notify
                    let assignedNotify=new notification(
                        {
                            issueId:issueDetails.issueId,
                            description:"you have assigned a new issue",
                            userId:issueDetails.asisgnedToId,
                            createdOn:timeLib.now()
                         }
                    )
                    assignedNotify.notificationCount=1;
                    assignedNotify.save();

                    //send response
                    let apiresponse=responseLib.generate(false,'Issue created successfully',200,issueDetails);
                    res.send(apiresponse);

            }
        }
    )

}//end create issue

/**
 * Edit Issue
 * 
 * @param {String} status 
 * @param {String} title 
 * @param {String} description 
 * @param {String} reporter 
 * @param {String} reporterId 
 * @param {String} assignedTo 
 * @param {String} assignedToId 
 * @param {String<>} images 
 */

 let editIssue=(req,res)=>
 {
     let options={
         issueId:req.body.issueId,
         status:req.body.status,
         title:req.body.title,
         description:req.body.description,
         reporter:req.body.reporter,
         reporterId:req.body.reporterId,
         assignedTo:req.body.assignedTo,
         assignedToId:req.body.assignedToId,
         images:req.body.images.split(',')
     }

     issueModel.updateOne({issueId:req.params.issueId},options)
     .exec(
         (err,issueDetails)=>
         {
             if(err)
             {
                loggerLib.captureError(err+'Error while updating issue','issueController:editIssue',10);
                let apiresponse=responseLib.generate(true,'Failed to update issue',500,null);
                res.send(apiresponse);
             }
             else if(checkLib.isEmpty(issueDetails))
             {
                loggerLib.captureError('issue not found ','issueController:editIssue',10);
                let apiresponse=responseLib.generate(true,'Issue not found ',404,null);
                res.send(apiresponse);
             }
             else
             {
                 //update notification
                 let updatenotify=
                 {
                     $push:
                     {
                         description:'someone edited the issue following by you'
                     }
                 }
                 updatenotify.notificationCount=1
                 notification.updateMany({issueId:issueDetails.issueId},updatenotify);

                 //send apiresponse
                 let apiresponse=responseLib.generate(false,'Issue updated successfully',200,issueDetails);
                 res.send(apiresponse);

             }

         }
     ) //end issue model save

 }//end edit issue

 /**
  * get all issue
  */

  let getAllIssue=(req,res)=>
  {
      issueModel.find()
      .select('-password -_id -__v')
      .lean()
      .exec(
          (err,allIssues)=>
          {
              if(err)
              {
                loggerLib.captureError(err+'Error while fetching issue','issueController:getAllIssues',10);
                let apiresponse=responseLib.generate(true,'Failed to fetch issue details',500,null);
                res.send(apiresponse);
              }
              else if(checkLib.isEmpty(allIssues))
              {
                loggerLib.captureError('No issues found','issueController:getAllIssues',10);
                let apiresponse=responseLib.generate(true,'No issues found',404,null);
                res.send(apiresponse);   
              }
              else
              {
                let apiresponse=responseLib.generate(false,'All issues found successfully',200,allIssues);
                res.send(apiresponse);
              }
          }
      )
  }//end get all issues

  /**
  * get single issue
  * @params {String} issueId
  */

 let getSingleIssue=(req,res)=>
 {
     issueModel.find({issueId:req.params.issueId})
     .select('-password -_id -__v')
     .lean()
     .exec(
         (err,issue)=>
         {
             if(err)
             {
               loggerLib.captureError(err+'Error while fetching issue','issueController:getSingleIssue',10);
               let apiresponse=responseLib.generate(true,'Failed to fetch issue details',500,null);
               res.send(apiresponse);
             }
             else if(checkLib.isEmpty(issue))
             {
               loggerLib.captureError('No issues found','issueController:getSingleIssue',10);
               let apiresponse=responseLib.generate(true,'No issues found',404,null);
               res.send(apiresponse);   
             }
             else
             {
               let apiresponse=responseLib.generate(false,'All issues found successfully',200,issue);
               res.send(apiresponse);
             }
         }
     )
 }//end single  issue

 /**
  * delete issue
  * @params {String} issueId
  */

 let deleteIssue=(req,res)=>
 {
     issueModel.findOneAndDelete({issueId:req.params.issueId})
     .select('-password -_id -__v')
     .lean()
     .exec(
         (err,issue)=>
         {
             if(err)
             {
               loggerLib.captureError(err+'Error while deletind issue','issueController:deleteIssue',10);
               let apiresponse=responseLib.generate(true,'Failed to delete issue ',500,null);
               res.send(apiresponse);
             }
             else if(checkLib.isEmpty(issue))
             {
               loggerLib.captureError('No issues found','issueController:deleteIssue',10);
               let apiresponse=responseLib.generate(true,'No issues found',404,null);
               res.send(apiresponse);   
             }
             else
             {
               let apiresponse=responseLib.generate(false,'Issue deleted successfully',200,issue);
               res.send(apiresponse);
             }
         }
     )
 }//end deleted issues

 /**
  * watcher list 
  * @params {String} watcherId
  * @params {String} issueId
  */

  let createWatchList=(req,res)=>
  {
      watcherModel.findOne({issueId:req.body.issueId})
      .exec(
          (err,watcherlist)=>
          {
            if(err)
            {
                loggerLib.captureError('Error while creating watchlist','issueController:watcherlist',10);
                let apiresponse=responseLib.generate(true,'Failed to create watch list',500,null);
                res.send(apiresponse);
            }
            else if(checkLib.isEmpty(watcherlist))
            {
                //new watch list
                let newWatcher=new watcherModel(
                    {
                        issueId:req.body.issueId,
                        watcherId:req.body.watcherId
                    }
                );
                newWatcher.save((err,success)=>
                {
                    if(err)
                    {
                        loggerLib.captureError('Error while creating watchlist','issueController:watcherlist',10);
                        let apiresponse=responseLib.generate(true,'Failed to create watch list',500,null);
                        res.send(apiresponse);
                    }
                    else
                    {
                        let notify=new notification(
                            {
                                issueId:success.issueId,
                                userId:success.userId,
                                description:'Issue has beend addded to watch list',
                                createdOn:timeLib.now()
                            }
                        );
                        notify.notificationCount=1;
                        notify.save();

                        //send apiresponse
                        let apiresponse=responseLib.generate(false,'Issue added to your watchlist',200,success);
                        res.send(apiresponse);
                    }
                });
            }
            else
            {
                loggerLib.captureError('Issue already present in watch list','issueController:watcherlist',10);
                let apiresponse=responseLib.generate(true,'Issue already present in watch list',400,null);
                res.send(apiresponse);
            }
          }
      )
  }//end create watchlist

/**
 * get watcher details
 */

let getWatcher=(req,res)=>
{
    watcherModel.find()
    .select('-__v')
    .lean()
    .exec(
        (err,issue)=>
        {
            if(err)
            {
              loggerLib.captureError(err+'Error while get watcher details','issueController:getWatcher',10);
              let apiresponse=responseLib.generate(true,'Failed to fetch watcher details',500,null);
              res.send(apiresponse);
            }
            else if(checkLib.isEmpty(issue))
            {
              loggerLib.captureError('No issues in your watchlist','issueController:getwatcher',10);
              let apiresponse=responseLib.generate(true,'No issues in your watch list',404,null);
              res.send(apiresponse);   
            }
            else
            {
              let apiresponse=responseLib.generate(false,'Watch list details found',200,issue);
              res.send(apiresponse);
            }
        }
    )
}//end watcher list


/**
 * add comment to issues
 */

 let addComment=(req,res)=>
 {
     let newComment=new commentModel(
         {
             commentId:shortId.generate(),
             description:req.body.description,
             issueId:req.body.issueId,
             reporter:req.body.reporter,
             reporterId:req.body.reporterId,
             createdOn:timeLib.now()
         }
     )//end new comment
     newComment.save(
         (err,success)=>
         {
             if(err)
             {
                 loggerLib.captureError('Error when create comment','issueController',10);
                 let apiresponse=responseLib.generate(true,'Failed to crete comment',500,null);
                 res.send(apiresponse);
             }
             let options={
                 $push:
                 {
                     description:'someone commented on the issue following by you'
                 }
             };
             options.notificationCount=1;
             notification.updateMany({issueId:req.body.issueId},options);

             //send api response
             let apiresponse=responseLib.generate(false,'Comment created',200,success);
             res.send(apiresponse);
         }
     )
 }//end add comment
 

 
  /**
  * read comment
  * @params {String} issueId
  */

 let readComment=(req,res)=>
 {
     issueModel.find({issueId:req.params.issueId})
     .select('-password -_id -__v')
     .lean()
     .exec(
         (err,comment)=>
         {
             if(err)
             {
               loggerLib.captureError(err+'Error while fetching comments','issueController:readComment',10);
               let apiresponse=responseLib.generate(true,'Failed to fetch comment details',500,null);
               res.send(apiresponse);
             }
             else if(checkLib.isEmpty(comment))
             {
               loggerLib.captureError('No comments found','issueController:readcomment',10);
               let apiresponse=responseLib.generate(true,'No comments found',404,null);
               res.send(apiresponse);   
             }
             else
             {
               let apiresponse=responseLib.generate(false,'All comments found successfully',200,comment);
               res.send(apiresponse);
             }
         }
     )
 }//end read comment

/**
 * get user notifications
 * @params{string}  userId
 */
let getAllnotifications=(req,res)=>
{
    notification.find({userId:req.params.userId})
    .select('-_v')
    .lean()
    .exec(
        (err,notifydatas)=>
        {
            if(err)
            {
                loggerLib.captureError('Error when fetch notification details','issueController:notifydatas',10);
                let apiresponse=responseLib.generate(true,'Failed to fetch notification details',500,null);
                res.send(apiresponse);
            }
            else if(checkLib.isEmpty(notifydatas))
            {
                loggerLib.captureError('No notifications found','issueController:notifydatas',10);
                let apiresponse=responseLib.generate(true,'nNo notification found',404,null);
                res.send(apiresponse);
            }
            else
            {
                let apiresponse=responseLib.generate(false,'Notifications found successfully',200,notifydatas);
                res.send(apiresponse);
            }

        }
    )
}
//end get all notificatiosn

/**
 * count update
 */

 let countUpdate=(req,res)=>
 {
     let options={
         notificationCount:0
     };

     notification.updateMany({userId:req.params.userId})
     .exec((err,success)=>
     {
         if(err)
         {
            loggerLib.captureError('Error when fetch notification details','issueController:countupdate',10);
            let apiresponse=responseLib.generate(true,'Failed to fetch notification details',500,null);
            res.send(apiresponse);
         }
         else
         {
             let apiresponse=responseLib.generate(false,'Notifications updated successfully',200,success);
             res.send(apiresponse);
         }

     });
 }





 //modules
 module.exports=
 {
     createIssue:createIssue,
     editIssue:editIssue,
     getAllIssue:getAllIssue,
     getSingleIssue:getSingleIssue,
     deleteIssue:deleteIssue,

     createWatchList:createWatchList,
     getWatcher:getWatcher,

     addComment:addComment,
     readComment:readComment,

     getAllnotifications:getAllnotifications,
     countUpdate:countUpdate

 }