//  var script = document.createElement('script');
//  script.src = "code.jquery.com_jquery-3.7.0.min.js"; // Check https://jquery.com/ for the current version
//document.getElementsByTagName('head')[0].appendChild(script);

const mongoose=require("mongoose");

const driverSchema=new mongoose.Schema({
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

//Collection is created here
const register=new mongoose.model("Driver_register",driverSchema);

module.exports=register;
	 
 
