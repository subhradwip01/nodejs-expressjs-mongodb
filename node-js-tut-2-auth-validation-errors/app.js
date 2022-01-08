const path = require('path');

const express = require('express');
const session = require("express-session");
const MongoDBStore=require("connect-mongodb-session")(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const csrf=require("csurf");
const flash=require("connect-flash");

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI="mongodb+srv://subhradwip:subhradwip099321@demo-project.2lgfi.mongodb.net/shop";

const app = express();
const csrfProtection=csrf();
const flashError=flash();
const store=new MongoDBStore({
  uri:MONGODB_URI,
  collection:"session"
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes=require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// session middleware
app.use(session({secret:"secured",resave:false,saveUnintialized:false,store:store}));

// csrf protection
app.use(csrfProtection);

// flash middleware
app.use(flashError);

app.use((req,res,next)=>{
  res.locals.csrfToken=req.csrfToken();
  next();
})

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err))
    });
  
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/500",errorController.get500)

app.use(errorController.get404);

app.use((error,req,res,next)=>{
  const isLoggedIn = req.session.isLoggedIn;
  res
    .status(500)
    .render("500", {
      pageTitle: "Error",
      path: "/500",
      isAuthenticated: isLoggedIn,
    });
})

mongoose.connect(MONGODB_URI)
.then(result=>{
  console.log("Connected")
  app.listen(3000);
})
.catch(err=>{
  console.log(err);
})

