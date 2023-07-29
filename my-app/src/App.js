const express=require("express");
const bodyParser = require('body-parser')
const app=express();
const url = require('url');

const path=require("path");
const hbs=require("hbs");
require("./db/conn");
const register=require("./models/driver_registration");
const { templates } = require("handlebars");
 
const port =process.env.PORT || 3000;
// const mon=require('mongoose');
// const Schema=mon.Schema;
// const coll=mon.model("Seo",new Schema({
//     email:String
// }));
// coll.insertMany({email:'ishaan@gmail.com'});

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");
//console.log(path.join(__dirname,"../public"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));


app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

//app.set("views", path.join(__dirname, "/my-app/views"));
app.get("/",(req,res)=>{
    //res.send("server connected successfully");
    res.render("index");
});
 
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/cab_registration",(req,res)=>{
    res.render("cab_registration");
});
app.get("/user_registration",(req,res)=>{
    res.render("user_registration");
});
app.get("/driver_registration",(req,res)=>{
    res.render("driver_registration");
});
app.post("/driver_registration",async (req,res)=>{
   try{
    console.log(req.body);
    const registerdriver=({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        number:req.body.number,
        ID:req.body.ID,
        password:req.body.password
    })
    //console.log("1");
    await register.insertMany([registerdriver]);
    res.send(true);
  

   }catch(error){
      res.status(400).send(error);
   }
});
app.get("/driver_page",(req,res)=>{
    res.render("driver_page");
});
app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})


