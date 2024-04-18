const express=require("express");
const bodyParser = require('body-parser');
const app=express();
const url = require('url');
require('dotenv').config();
const bcrypt = require("bcryptjs")
const multer=require('multer');
const path=require("path");
const hbs=require("hbs");
const fs= require("fs");
const btoa= require("btoa");
const createPrompt = require('prompt-sync');
const prompt = createPrompt();
const ObjectId= require('mongodb').ObjectId;// for object id in delete function
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const session = require('express-session');
const mapboxClient = require('@mapbox/mapbox-sdk');
const Client = mapboxClient({ accessToken: 'pk.eyJ1Ijoicm9oYW5tZXNzaSIsImEiOiJjbHVyYmc3bmowNzM4MnFtb2k4ZGtmM2RsIn0.WY8vifl-gelkK3tElBlvrQ' });
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
//const GridFsStorage=require('multer-gridfs-storage');
app.use(session({       // for setting session
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true
    // cookie: { secure: true }
}));
require("./db/conn");
const register=require("./models/driver_registration");
const user=require("./models/user_registration");
const cab=require("./models/cab_registration");
const admin=require("./models/admin_registration")
const city=require("./models/cities")
const ride_detail=require("./models/ride_details")
const upload_file = require('./helper/image_helper.js') // It has Code for Image 

const { templates } = require("handlebars");
// var storage =   multer.diskStorage({  
//     destination: function (req, file, callback) {  
//       callback(null, '../public/uploads');  
//     },  
//     filename: function(req, file, callback) {
//       console.log(file);
//       if(file.originalname.length>6)
//         callback(null, file.fieldname + '-' + Date.now() + file.originalname.substr(file.originalname.length-6,file.originalname.length));
//       else
//         callback(null, file.fieldname + '-' + Date.now() + file.originalname);
   
//     }
//   });  
let storage = multer.diskStorage({
    destination: 'public/images/',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
  let upload = multer({
    storage: storage
  })
// let upload=multer({ dest: 'uploads/' })
// let upload =multer({
//     storage: Storage 
// }).single('avatar');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())  //app to use cookie parser
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
  
async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    // Store hash in the database
}
app.post("/login", async (req, res) => {
   
    
    let { username, password } = req.body;
    
    const users = await  user.findOne({ email: username }).lean()
    
    if (!users) {
        
      res.status(404).send({message: "No  User Found"});
    } else {
         
       const hashedPassword2 = await bcrypt.hash(users.password, 13);
       var validatePassword = await bcrypt.compare(password,hashedPassword2);
       //console.log(validatePassword);
       //console.log(hashedPassword2);
      if (!validatePassword) {
         
        //res.status(400).send({message: "Invalid Password"})
        
        res.render('login', { error: 'Invalid password' });
        //res.redirect("/login");
      } else {
    
    req.session.user_id=users._id;
    req.session.firstName=users.firstName;
    req.session.email=users.email;
     res.redirect('/login_homepage');
      }
}});
const requireloginAuth = (req, res, next) => {
    //console.log(req.session.user_id);
    
    if (req.session.user_id) {
        next(); // User is authenticated, continue to next middleware
    } else {
        res.redirect('/login'); // User is not authenticated, redirect to login page
    }
}
app.get("/login_homepage",requireloginAuth,async(req,res)=>{
    //console.log(req.session);
    let records;
    var display2=await cab.find({}).exec(function(err,cab_data){
        
        
        //console.log(cab_data);
        if(cab_data){
            
            res.render("login_homepage",{firstName:req.session.firstName,email:req.session.email,records:cab_data});
        } 
         
    });

    // console.log(records);
    // var display=await city.find({}).exec(function(err,city_data){
        
        
    //     console.log(city_data);
    //     if(city_data){
           
    //         res.render("login_homepage",{firstName:req.session.firstName,email:req.session.email,records1:city_data,records2:records});
    //     } 
         
    // });
    
    //console.log(req.body.username);
});

app.post("/login_homepage",requireloginAuth,async(req,res)=>{
    // console.log(req.session);
    //  console.log("You are in post login homepage now");
    try{
        //console.log(req.body);
        const register_ride_detail=({
            pickup:req.body.pickup,
            destination:req.body.destination,
            email:req.session.email,
            cab:req.body.cab,
            date_time:req.body.birthdaytime
        })
        //console.log("1");
        await ride_detail.insertMany([register_ride_detail]);
        alert("A ride has been booked.Check the ride history for more details");
        res.send(true);
      
    
       }catch(error){
          res.status(400).send(error);
       }
})

app.get("/ride_history",requireloginAuth,async(req,res)=>{      // shows history of all rides for a particular user(using email)
    //console.log(req.session);
    let records3;
    var display2=await ride_detail.find({email:req.session.email}).exec(function(err,ride_data){
        
        
        //console.log(ride_data);
        if(ride_data){
           records3=ride_data;
            res.render("ride_history",{records:records3});
        } 
         
    });

});

app.get("/user_detail_update",requireloginAuth,(req,res)=>{       //Showing user details for update
    //console.log("Page of user details");
    user.findById({_id:req.session.user_id},req.body,{new:true},(err,docs)=>{
        if(err){
            //console.log("Cant retrieve data and edit");
            console.log(err);
        }else{
            console.log("Success in showing user details");
            res.render('user_detail_update',{records:docs});
        }

    })
 })


app.post('/user_update',requireloginAuth,(req,res)=>{       // Now Update User Data here using ID
    // console.log(2);
    // console.log(req.body);
    // console.log(req.params.id);
    user.findByIdAndUpdate({_id:req.session.user_id},req.body,(err,docs)=>{
        if(err)
        {
            //console.log('Error');
            console.log(err);
        }  
        else
        {  
            console.log(req.body.email);
            req.session.email=req.body.email
            console.log("success in updating details");
            res.redirect('/login_homepage');
        }
    });
}); 

app.get("/logout",requireloginAuth,(req,res)=>{
    req.session.user_id=undefined;
    req.session.firstName=undefined;
    req.session.email=undefined;
    //console.log("came to logout page");
    res.redirect("/");
});
app.get("/admin_login",(req,res)=>{
    res.render("admin_login");
});
app.post("/admin_login", async (req, res) => {

    //console.log(req.body);
    
    let { username, password } = req.body;
    
    const users = await admin.findOne({ email: username }).lean()
    //console.log(users);
    if (!users) {
      res.status(404).send({message: "No  User Found"})
    } else {
        // console.log(password);
        // console.log(users.password);
        const hashedPassword2 = await bcrypt.hash(users.password, 13);
       var validatePassword = await bcrypt.compare(password,hashedPassword2);
       //console.log(validatePassword);
   
       //console.log(hashedPassword2);
      if (!validatePassword) {
        res.status(400).send({message: "Invalid Password"})
        //res.redirect("/login");
      } else {
        res.cookie("username", username, {
          
          secure: true,
          httpOnly: true,
          sameSite: 'lax'
          
      });
      
      res.redirect("/admin_page");
      }
}});
app.get("/admin_page",(req,res)=>{
    res.render("admin_page");
});
app.get("/driver_upd&delete",async(req,res,next)=>{    //display all driver details
    // console.log(typeof req.next);
    // var display=await register.find({});
    
    var display=await register.find({}).exec(function(err,driver_data){
        //  if(err){
        //     console.log("Here is the error");
        //     throw err;
        //  } 
        // console.log(data);
        if(driver_data){
            res.render("driver_upd&delete",{title:'Driver Record',records:driver_data});
        } 
        
    });
  
});


app.get("/driver_upd&delete/:id",(req,res)=>{       //Deleting Driveer Details
    // console.log(req.params.id);
    // console.log(req.params.id.length);
    var myId = JSON.stringify(req.params.id);
    myId = JSON.parse(myId);
    // console.log(myId.length);
    // console.log(myId);
    // console.log(myId.length);
    register.findByIdAndRemove({'_id': new ObjectId(myId)},(err,doc)=>{
        if(err){
            console.log(err);
        }else{
            console.log("success");
            
        }
    })
    res.redirect("/admin_page");
});
 app.get("/driver_detail_update/:id",(req,res)=>{       //Showing Driver details for update
    register.findById({_id:req.params.id},req.body,{new:true},(err,docs)=>{
        if(err){
            //console.log("Cant retrieve data and edit");
            console.log(err);
        }else{
            console.log("Success");
            res.render('driver_detail_update',{records:docs});
        }

    })
 })


app.post('/driver_update/:id',(req,res)=>{       // Now Update Driver Data here using ID
    
    
    
    register.findByIdAndUpdate({_id:req.params.id},req.body,(err,docs)=>{
        if(err)
        {
            //console.log('Error');
            console.log(err);
        }  
        else
        {  
             
            res.redirect('/admin_page');
        }
    });
  
    
});
app.get("/cab_registration",(req,res)=>{
    res.render("cab_registration");
});
app.post("/cab_registration",upload.single('avatar'), async(req,res)=>{
    
     
    //console.log(req.file.avatar);
    try{
        var cab_data ={
            model : req.body.model,
            ID:req.body.ID,
            colour:req.body.colour,
            avatar:{
                data: fs.readFileSync(path.join(__dirname + '/../public/uploads/' + req.file.filename),'base64'),
                contentType: 'image/jpg'
            }
         }  
         await cab.insertMany([cab_data]);
        res.render("admin_page");
    }catch(error){
      res.status(400).send(error);
   }
    
 
   
    
    
   
});

app.get("/cab_upd&delete",async(req,res,next)=>{    //display all cab details
    // console.log(typeof req.next);
    // var display=await register.find({});
    
    var display=await cab.find({}).exec(function(err,cab_data){
        //  if(err){
        //     console.log("Here is the error");
        //     throw err;
        //  } 
        // console.log(data);
        if(cab_data){
            res.render("cab_upd&delete",{title:'Cab Record',records:cab_data});
        } 
        
    });
  
});

app.get("/cab_upd&delete/:id",(req,res)=>{       //Deleting Cab Details
    
    var myId = JSON.stringify(req.params.id);
    myId = JSON.parse(myId);
    
    cab.findByIdAndRemove({'_id': new ObjectId(myId)},(err,doc)=>{
        if(err){
            console.log(err);
        }else{
            console.log("successfully removed");
            
        }
    })
    res.redirect("/admin_page");
});
app.get("/cab_detail_update/:id",(req,res)=>{       //Showing Cab details for update
    cab.findById({_id:req.params.id},req.body,{new:true},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
            
            res.render('cab_detail_update',{records:docs});
        }

    })
 })


app.post('/cab_update/:id',(req,res)=>{       // Now Update Cab Data here using ID
    
    cab.findByIdAndUpdate({_id:req.params.id},req.body,(err,docs)=>{
        if(err)
        {
            console.log(err);
        }  
        else
        {  
             
            res.redirect('/admin_page');
        }
    });
  
    
});
app.get("/user_registration",(req,res)=>{
    res.render("user_registration");
});
app.post("/user_registration",async(req,res)=>{
    try{
         
        const hash = await bcrypt.hash(req.body.password, 10);
        const user_register=({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            number:req.body.number,
            ID:req.body.ID,
            password:req.body.password
        })
        
        const User=await user.create([user_register]);
        //generate a token for user and send it
        jwt.sign(
            {id:User._d,email:User.email},
            'shhhh',{   //process.end.secret
                expiresIn: "2h"
            }
           
        )
        User.token=token
        User.password=undefined     // I dont wanna send password to frontend
        
        res.status(201).json(User); 
         
      
    
       }catch(error){
        
          res.status(400).send(error);
       }
});
app.get("/driver_registration",(req,res)=>{
    res.render("driver_registration");
});
app.post("/driver_registration",async (req,res)=>{
   try{
     
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


//Handling  Maps using Mapbox
 