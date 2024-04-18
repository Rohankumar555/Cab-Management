//  var script = document.createElement('script');
//  script.src = "code.jquery.com_jquery-3.7.0.min.js"; // Check https://jquery.com/ for the current version
//document.getElementsByTagName('head')[0].appendChild(script);

const mongoose=require("mongoose");

const ride_detail_schema=new mongoose.Schema({
	pickup : {
		type:String,
		required : true
	},
	destination : {
		type:String,
		required : true
	},
	email : {
		type:String,
		required : true,
	},
	cab : {
		type:String,
		required : true
	},
	date_time:{
        type:String,
		required : true
    }
})

//Collection is created here
const ride_detail=new mongoose.model("Ride_record",ride_detail_schema);
module.exports=ride_detail;
	 
 
