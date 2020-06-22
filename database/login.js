var mongo=require('mongodb');
var MongoClient=mongo.MongoClient;
module.exports=function(obj){
    MongoClient.connect("mongodb://localhost:27017/",function(err,db){
    var dbo=db.db("appchat");
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } 
    else{
        dbo.collection("appchat").insertOne(obj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    }
})
}