const mongoose=require('mongoonse');
const schema=mongoose.Schema;
const time=require('./../libs/timeLib');

const authSchema=new schema(
    {
        userId:
        {
            type:String,
            default:''
        },
        token:
        {
            type:String,
            default:''
        },
        secretKey:
        {
            type:String,
            default:''
        },
        tokenGenerationTime:
        {
            type:Date,
            default:time.now()
        }

    }
);

mongoose.model('auth',authSchema);   