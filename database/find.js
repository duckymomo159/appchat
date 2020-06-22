var mongo=require('mongodb');
var MongoClient=mongo.MongoClient;
module.exports=function(obj,fn){
    MongoClient.connect("mongodb://localhost:27017/", function(err,db){
    var dbo=db.db("appchat");
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } 
    else{
        dbo.collection("appchat").findOne({username:obj.username},function(err, result) {
            if (err) throw err;
            fn(result);
            db.close();
        });
        }
    })
}