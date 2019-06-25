const mongoose=require('mongoose');
const schema=mongoose.Schema;

let notificationSchema=new schema(
    {
        userId:
        {
            type:String,
            default:''
        },
        description:
        {
            type:[String],
            default:''
        },
        issueId:
        {
            type:String,
            default:''
        },
        notificationCount:
        {
            type:Number,
            default:0
        },
        createdOn:
        {
            type:Date,
            default:Date.now()
        }
    }
)//end schema

mongoose.model('notification',notificationSchema);