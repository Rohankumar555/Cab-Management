//  var script = document.createElement('script');
//  script.src = "code.jquery.com_jquery-3.7.0.min.js"; // Check https://jquery.com/ for the current version
//document.getElementsByTagName('head')[0].appendChild(script);

const mongoose=require("mongoose");

const citiesSchema=new mongoose.Schema({
 
	city:{
		type:String,
		required : true,
		unique:true
	} 
});

//Collection is created here
const cities=new mongoose.model("Citie",citiesSchema);

module.exports=cities;
	 
 
