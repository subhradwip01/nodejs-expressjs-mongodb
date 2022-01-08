// Working with mongoose
const mongoose=require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  imageUrl:{
    type:String,
    required:true
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  }

});

module.exports=mongoose.model("Product",productSchema);




// Working With Mongodb-------

// const getDb=require("../util/database").getDb;
// var ObjectId = require('mongodb').ObjectId;
// class Product{
//   constructor(title,price,description,imageUrl,id,userId){
//     this.title=title;
//     this.price=price;
//     this.description=description;
//     this.imageUrl=imageUrl;
//     this._id=id?ObjectId(id):null;
//     this.userId=userId;
//   }

//   // Save the data
//   save(){
//     const db=getDb();
//     let dbOp;
//     if(this._id){
//       // for upadating product
//       dbOp=db.collection("products").updateOne({_id:ObjectId(this._id)},{
//         $set:this
//       })
//     }else{
//       dbOp=db.collection('products')
//       .insertOne(this)
//     }
//     return dbOp
//     .then(res=>{
//       console.log(res);
//     })
//     .catch(err=>{
//       console.log(err);
//     });
//   }
//   static fetchAll(){
//     const db=getDb();
//     return db.collection("products")
//     .find()
//     .toArray()
//     .then(products=>{
//       return products;
//     })
//     .catch(err=>{
//        console.log(err);
//        throw err;
//     });
//   }

//   static findById(id){
//     const db=getDb();
//     return db.collection("products").find({_id:ObjectId(id)}).next().then(res=>{
//       console.log(res);
//       return res;
//     })
//     .catch(err=>{
//       console.log(err);
//     })
//   }

//   // Deleting product
//   static deleteByid(id){
//     const db=getDb();
//     return db.collection("products").deleteOne({_id:ObjectId(id)})
//     .then(res=>{
//       console.log(res);
//     })
//     .catch(err=>{
//       console.log(err);
//     })

//   }

// }


// module.exports = Product;
