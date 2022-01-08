// Usinig Mongoose
const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const userSchema=new Schema({
  name:{
    type:String,
    requires:true
  },
  email:{
    type:String,
    required:true
  },
  cart:{
    items:[{
      productId:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required:true
      },
      quantity:{
        type:Number,
        required:true,
      }
    }]
  }
})

userSchema.methods.addToCart= function(product){
  const cartProductIndex=this.cart.items.findIndex(cp=>{
           return cp.productId.toString() === product._id.toString();
          })
         console.log(cartProductIndex);
         let newQuantity=1;
         const updatedCartItems=[...this.cart.items];
         if(cartProductIndex>=0){
           newQuantity=this.cart.items[cartProductIndex].quantity+1;
           updatedCartItems[cartProductIndex].quantity=newQuantity;
         }
         else{
           updatedCartItems.push({productId:product._id,quantity:newQuantity})
         }
        
        const updatedCart={
          items:updatedCartItems
        };
        this.cart=updatedCart;
        this.save();
}

userSchema.methods.deleteCart=function(prodId){
      const cartItemIndex=this.cart.items.findIndex(p=>{
        return p.productId.toString()===prodId;
      })
      let updatedCart=[...this.cart.items];
      if(cartItemIndex>=0){
        if(this.cart.items[cartItemIndex].quantity==1){
          updatedCart=this.cart.items.filter(p=>{
            return p.productId.toString()!==prodId;
          })
        }
        else{
          updatedCart[cartItemIndex].quantity=this.cart.items[cartItemIndex].quantity-1; 
   
        }
        const updatedCartItems={
          items:updatedCart
        };
        this.cart=updatedCartItems;
        return this.save();
      }
}

userSchema.methods.deleteCart=function(){
    this.cart={itmes:[{}]}
    return  this.save();
}

module.exports=mongoose.model("User",userSchema);

// Using Mongodb

// const getDb = require("../util/database").getDb;
// const ObjectId=require("mongodb").ObjectId;
// class User{
//   constructor(username,email,cart,id){
//     this.name=username;
//     this.email=email;
//     this.cart=cart;
//     this._id=id;
//   }
//   save(){
//     const db=getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product){
//      const cartProductIndex=this.cart.items.findIndex(cp=>{
//        return cp.productId.toString() === product._id.toString();
//      })
//      console.log(cartProductIndex);
//      let newQuantity=1;
//      const updatedCartItems=[...this.cart.items];
//      if(cartProductIndex>=0){
//        newQuantity=this.cart.items[cartProductIndex].quantity+1;
//        updatedCartItems[cartProductIndex].quantity=newQuantity;
//      }
//      else{
//        updatedCartItems.push({productId:product._id,quantity:newQuantity})
//      }
    
//     const updatedCart={
//       items:updatedCartItems
//     };
//     const db=getDb();
//     return db.collection("users").updateOne({_id:ObjectId(this._id)},
//      {$set:{cart:updatedCart}}
//      );
//   }

//   static findById(userId){
//     const db=getDb();
//     return db.collection("users").findOne({_id:ObjectId(userId)})
//   }

//   getCart(){
//     const db=getDb();
//     const productIds=this.cart.items.map(cp=>{
//       return cp.productId
//     })
//     // console.log("Your products:",productIds);
//     return db.collection("products").find({_id:{$in:[...productIds]}})
//     .toArray()
//     .then(products=>{
//       // console.log("your product:",products);

//       // If any item is deletd by admin then we also should update the cart of the user:--
//       // Case:1 if there is no product match with cart
//       if(products.length==0){
//         this.cart={items:[]};
//         db.collection("users")
//         .updateOne({_id:ObjectId(this._id)},
//          {$set:{cart:{items:[]}}})
//         return this.cart; 
//       }

//       // if some products available in the cart but due to deletion some of the cart products also delelted from product list in that cast we also shoud update the cart
//       // console.log(this.cart.items.length);
//       // console.log(products.length);
//       if(products.length<this.cart.items.length){
//         let updatetedProduct=products.map(i=>{
//           return {productId:i._id,quantity:this.cart.items.find(it=>{
//             return it.productId.toString()===i._id.toString();
//           }).quantity};
//         })
//         db.collection("users")
//         .updateOne({_id:ObjectId(this._id)},
//          {$set:{cart:{items:[...updatetedProduct]}}})
//          this.cart={items:[...updatetedProduct]};
//       }
//       return products.map(p=>{
//         return {...p,quantity:this.cart.items.find(i=>{
//           return i.productId.toString()===p._id.toString();
//         }).quantity}
//       })
//     })

//   }
  
//   deleteCart(prodId){
//       const cartItemIndex=this.cart.items.findIndex(p=>{
//         return p.productId.toString()===prodId;
//       })
//       let updatedCart=[...this.cart.items];
//       if(cartItemIndex>=0){
//         if(this.cart.items[cartItemIndex].quantity==1){
//           updatedCart=this.cart.items.filter(p=>{
//             return p.productId.toString()!==prodId;
//           })
//         }
//         else{
//           updatedCart[cartItemIndex].quantity=this.cart.items[cartItemIndex].quantity-1; 
   
//         }
//         const updatedCartItems={
//           items:updatedCart
//         };
//         const db=getDb();
//         return db.collection("users").updateOne({_id:ObjectId(this._id)},
//         {$set:{cart:updatedCartItems}}
//         );
//       }
//   }

//   addOrder(){
//     const db=getDb();
//     return this.getCart().then(cart=>{

//       const order={
//         items:cart,
//         user:{
//           _id:ObjectId(this._id),
//           name:this.name,
//           email:this.email
//         }
//       }
//       return db.collection("orders").insertOne(order)
//     }).then(result=>{
//       this.cart={items:[]};
//       return db.collection("users")
//        .updateOne({_id:ObjectId(this._id)},
//      {$set:{cart:{items:[]}}})
//     })
   

    
//   }

//   getOrder(){
//     const db=getDb();
//     return db.collection("orders").find({'user._id':ObjectId(this._id)}).toArray()

//   }

// }
// module.exports=User;
