const mongoose=require("mongoose");
const mongoDB="mongodb+srv://rohankumarbehera5:66y4ZeIbb0p7zgck@cluster0.wcsgcec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
 
mongoose.connect(mongoDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
   
}).then(() => console.log('connecting to database successful'))
.catch(err => console.error('could not connect to mongo DB', err));


 