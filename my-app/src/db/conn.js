const mongoose=require("mongoose");
const mongoDB="mongodb://localhost:27017/Cab_Management";
 
mongoose.connect(mongoDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
   
}).then(() => console.log('connecting to database successful'))
.catch(err => console.error('could not connect to mongo DB', err));


 