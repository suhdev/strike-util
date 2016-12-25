# strike-util 

## printf 

`strike-util` implements C-style printf here are some examples. 


```javascript 
import {printf} from 'strike-util'; 

console.log(printf('This %s tastes perfect','orange'));  //logs This orange tastes perfect 

console.log(printf('The typeof %d is a %typeof',12,12)); //logs The typeof 12 is a number 

var o = {
    name:{
        firstName:"Suhail",
        lastName:"Abood"
    },
    toJSON:function(){
        return {
            firstName:this.name.firstName,
            lastName:this.name.lastName
        };
    }
}

console.log(printf('This object can be jsonified %o',o)); //logs This object can be jsonified {"firstName":"Suhail","lastName":"Abood"}
```