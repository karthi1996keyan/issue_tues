/**
 * multer and grid fs to store screenshots of issue uploaded by user and
 * user can able to see and download the screenshots .
 */

 const gridFsStorage=require('multer-gridfs-storage');
 const multer=require('multer');
 const grid=require('gridfs-stream');
 const mongoose=require('mongoose');
 const crypto=require('crypto');
 const path=require('path');

 const appConfig=require('./../../config/appConfig');

 const conn=mongoose.createConnection(appConfig.databaseUrl);

 //libs
 const loggerLib=require('../libs/loggerLib');
 const responseLib=require('../libs/responseLib');

 //configure grid stream 
 let gfs;
 conn.once('open',()=>
 {
    gfs=grid(conn.db,mongoose.mongo);
    gfs.collection('uploads')
 });

/**
 * config storage using multer gridfs storage
 */

 const storage=new gridFsStorage(
     {
        url:appConfig.databaseUrl,
        file:(req,file)=>
        {
            return new Promise(
                (resolve,reject)=>
                {
                    crypto.randomBytes(16,(err,buf)=>
                    {
                        if(err)
                        {
                            return reject(err);
                        }
                        else 
                        {
                            const filename=buf.toString('hex')+path.extname(file.originalname);
                            const fileInfo=
                            {
                                fileName:filename,
                                bucketName:'uploads'    
                            }
                            resolve(fileInfo);
                        }
                    });
                }
            )
        }
     }
 )//end storage


 /**
  * multer configuration
  */

  const upload=multer({storage});


  //init gfs

  const uploadFile=(req,res)=>
  {
      loggerLib.captureInfo('File uploaded','multer:uploadFile()',5);
      res.json({file:req.file,uploadFileName:req.file.filename});
  }

  /**
   * get all files from grid
   */

   const getAllFiles=(req,res)=>
   {
       gfs.files.find().toArray(
           (err,files)=>
           {
                if(err)
                {
                    loggerLib.captureError('Error while fetch files','multer:getAllFiles()',8);
                    let apiresponse=responseLib.generate(true,'Failed to find file data',500,null);
                    res.send(apiresponse);
                }
                else
                {
                    let apiresponse=responseLib.generate(false,'All files found',200,files);
                    res.send(apiresponse);
                }
           }
       )
   } //end get all files

   
  /**
   * get single file from grid
   */

  const getSingleFile=(req,res)=>
  {
      gfs.files.findOne({filename:req.params.fileName},
          (err,files)=>
          {
               if(err)
               {
                   loggerLib.captureError('Error while fetch files','multer:getSingleFiles()',8);
                   let apiresponse=responseLib.generate(true,'Failed to find file data',500,null);
                   res.send(apiresponse);
               }
               else
               {
                   let apiresponse=responseLib.generate(false,' Files found',200,files);
                   res.send(apiresponse);
               }
          }
      )
  } //end get single file

  
  /**
   * download files from grid
   */

  const downloadFiles=(req,res)=>
  {
      gfs.files.findOne({filename:req.params.fileName},
          (err,files)=>
          {
               if(err)
               {
                   loggerLib.captureError('Error while fetch files','multer:downloadFiles()',8);
                   let apiresponse=responseLib.generate(true,'Failed to find file data',500,null);
                   res.send(apiresponse);
               }
               else
               {
                   const readStream=gfs.createReadStream({filename:files.filename});
                   res.set('content-type',file.contentType);
                   readStream.pipe(res);
               }
          }
      )
  } //end download  files

  
  /**
   *delete files from grid
   */

  const deleteFiles=(req,res)=>
  {
      gfs.files.deleteOne({_id:req.params.id,root:'uploads'},
          (err,files)=>
          {
               if(err)
               {
                   loggerLib.captureError('Error while fetch files','multer:gdeleteFiles()',8);
                   let apiresponse=responseLib.generate(true,'Failed to find file data',500,null);
                   res.send(apiresponse);
               }
               else
               {
                   let apiresponse=responseLib.generate(false,'File deleted successfully',200,files);
                   res.send(apiresponse);
               }
          }
      )
  } //end delete files



  module.exports=
  {
      upload:upload,
      uploadFile:uploadFile,
      getAllFiles:getAllFiles,
      getSingleFile:getSingleFile,
      downloadFiles:downloadFiles,
      deleteFiles:deleteFiles
  }