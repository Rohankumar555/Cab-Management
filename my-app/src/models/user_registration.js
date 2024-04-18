const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
	firstName : {
		type:String,
		required : true
	},
	lastName : {
		type:String,
		required : true
	},
	email : {
		type:String,
		required : true,
		unique:true
	},
	number : {
		type:Number,
		required : true,
		unique :true
	},
	ID :{
		type:String,
		required : true,
		unique :true
	},
	password: {
		type:String,
		required : true
	}
})

const user=new mongoose.model("Users",userSchema);

module.exports=user;
