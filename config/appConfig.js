/**
 * Configuration file for issue tracking system 
 */
let appConfig=
{
    port:3001,
    allowedOrgins:'*',
    env:'dev',
    databaseUrl:'mongodb://localhost:27017/issueTrackerDB',
    apiVersion:'/api/v1.0.0'
}//end appconfig

/**
 * Export this module to make use across all application using require
 */
module.exports=
{
    port:appConfig.port,
    allowedOrgins:appConfig.allowedOrgins,
    env:appConfig.port,
    databaseUrl:appConfig.databaseUrl,
    apiVersion:appConfig.apiVersion
}
