/**
 * library to check given value is empty or 
 * undefined or null
 */

 //trim function starts (remove extra spaces at start and end )
 let trim=(value)=>
 {
     let val=String(value);
     return val.replace(/^\s+|\s+$/gm,'');
 }//end trim function

 //starts check function starts 
 let isEmpty=(value)=>
 {
     if(value === null ||
        value === undefined ||
        trim(value) === '' ||
        value.length === 0)
        {
            return true;
        }
        else
        {
            return false;
        }
 } //end check


 module.exports=
 {
     trim:trim,
     isEmpty:isEmpty
 }