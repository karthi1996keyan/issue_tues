const mongoose=require('mongoose');
const schema=mongoose.Schema;

let issueSchema=new schema(
    {
        issueId:
        {
            type:String,
            default:'',
            unique:true,
            index:true           
        },
        status:
        {
            type:String,
            default:'Backlog'
        },
        title:
        {
            type:String,
            default:'none'
        },
        description:
        {
            type:String,
            default:'No Description Given'
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
        assignedTo:
        {
            type:String,
            default:''
        },
        assignedToId:
        {
            type:String,
            default:''
        },
        images:[],
        createdOn:
        {
            type:Date,
            default:Date.now()
        }
    }
)

mongoose.model('issue',issueSchema);