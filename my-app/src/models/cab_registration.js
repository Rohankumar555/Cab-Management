const mongoose=require("mongoose");

const cabsSchema=new mongoose.Schema({
	model : {
		type:String,
		required : true
	},
	ID : {
		type:String,
		required : true,
		unique:true
	},
	colour : {
		type:String,
		required : true	
	},
	avatar: {
		data: String,
        contentType: String
	}
})

const cabs=new mongoose.model("Cab_manage",cabsSchema);

module.exports=cabs;