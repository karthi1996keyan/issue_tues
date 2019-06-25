const mongoose=require('mongoose');
const schema=mongoose.Schema;

let commentSchema=new schema(
    {
        commentId:
        {
            type:String,
            default:'',
            unique:true,
            index:true
        },
        issueId:
        {
            type:String,
            default:''            
        },
        description:
        {
            type:String,
            default:''
        },
        reporter:
        {
            type:String,
            default:''
        },
        reporterId:
        {
            type:String,
            default:''
        },
        createdOn:
        {
            type:Date,
            default:Date.now()
        }
    }
);

mongoose.model('comment',commentSchema);

