const mongodb=require("mongodb");
const MongoClient=mongodb.MongoClient;

let _db;

const MongoConnect=(callBack)=>{
  MongoClient.connect("mongodb+srv://subhradwip:subhradwip099321@demo-project.2lgfi.mongodb.net/shop?retryWrites=true&w=majority")
  .then(client=>{
    console.log("Connect");
    _db=client.db();
    callBack();
  })
  .catch(err=>{
    console.log(err);
    throw err;
  })
}

const getDb=()=>{
  if(_db){
    return _db;
  }
  throw "No Database found"
}

exports.MongoConnect=MongoConnect;
exports.getDb=getDb;