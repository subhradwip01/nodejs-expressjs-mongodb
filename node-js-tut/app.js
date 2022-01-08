const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');


const errorController = require('./controllers/error');
// const mongoConnect=require("./util/database").MongoConnect;
const mongoose=require("mongoose");
const User=require("./models/user");
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('61b735c231ba3c2aa5c487c3')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
  
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


// Using mongodb
// mongoConnect(()=>{
//   console.log("Done");
//   app.listen(3000);
// })

// Using mongoose
mongoose.connect("mongodb+srv://subhradwip:subhradwip099321@demo-project.2lgfi.mongodb.net/shop?retryWrites=true&w=majority")
.then(result=>{
  User.findOne().then(user=>{
    if(!user){
      const user=new User({
        name:"Subhradwip",
        email:"test@gmail.com",
        cart:{
          items:[]
        }
      })
      user.save();
    }
  })
  
  console.log("Connected")
  app.listen(3000);
})
.catch(err=>{
  console.log(err);
})

