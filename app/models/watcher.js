const mongoose=require('mongoose');
const schema=mongoose.Schema;

let watcherSchema=new schema(
    {
        watcherId:
        {
            type:String,
            default:''
        },
        issueId:
        {
            type:String,
            default:''
        }
    }
)//end schema

mongoose.model('watcher',watcherSchema);