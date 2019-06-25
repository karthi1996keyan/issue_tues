/**
 * user schema and model 
 */

const mongoose=require('mongoose');
const schema=mongoose.Schema;

let userSchema=new schema(
    {
        userId:
        {
            type:String,
            default:'',
            index:true,
            unique:true
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
        password:
        {
            type:String,
            default:'DefaultPassword'
        },
        email:
        {
            type:String,
            default:''
        },
        mobileNumber:
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
);//end schema here

mongoose.model('user',userSchema);