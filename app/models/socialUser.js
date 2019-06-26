const mongoose=require('mongoose');
const schema=mongoose.Schema;

let socialUserSchema=new schema(
    {
        userId:
        {
            type:String,
            default:'',
            unique:true,
            index:true
        },
        firstName:
        {
            type:String,
            default:''
        },
        lastName:
        {
            type:String,
            default:''
        },
        email:
        {
            type:String,
            default:''
        },
        createdOn:
        {
            type:Date,
            default:Date.now
        }
    });


mongoose.model('socialUser',socialUserSchema);