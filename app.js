var createError = require('http-errors');
var fs=require('fs');
var express = require('express');
var app = express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
var _=require('lodash');
var bodyParser=require('body-parser');
var find=require('./database/find.js');
server.listen(process.env.PORT || 3000);
app.use(express.static(__dirname+'/public'));
app.set('views', __dirname+"/views");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var arr=[];
io.on('connection',function(socket){
  fs.writeFileSync('./data.json',"[]");
  var user="";
  socket.on('Register',function(data){
    user=data;
    if(arr.includes(data))
    {
      socket.emit('kq',"fail");
    }
    else{
      arr.push(data);
      console.log(arr);
      socket.emit('kq',"success");
      io.sockets.emit('arr',arr);
      socket.broadcast.emit('thongbao',data+" vừa tham gia");
    }
  });
  socket.on('logout',function(btc){
    console.log(btc);
    var even=_.remove(arr,function(n){
      return n==btc;
    })
    socket.broadcast.emit('test',{user:btc,useronline:arr});
  });
  socket.on('disconnect',function(){
    var even=_.remove(arr,function(n){
      return n==user;
    });
    socket.broadcast.emit('test',{user:user,useronline:arr});
  });
  socket.on('client-send-mess',function(data){
    var datafile=fs.readFileSync('./data.json');
  
    datafilejson=JSON.parse(datafile);
    datafilejson.push(data);
    fs.writeFileSync('./data.json',JSON.stringify(datafilejson),(err)=>{
      if(err) throw err;
      console.log("OK Fine");
    })
    io.sockets.emit('sever-send-mess',{time:data.time,text:data.text,user:data.user});
  })
});

app.get('/',function(req,res){
  res.render('login',{title:"hello"});
});
app.post('/login',function(req,res){
  // res.render('login',{title:"hello"});
  console.log("OKOKOKOK");
});
app.get('/registry',function(req,res){
  res.render('registry',{state:"ok"});
})
app.post('/check',function(req,res){
  try{
  find(req.body).then().then((err,rs)=>{
    console.log(rs);
  }).then((err,rs)=>{
    console.log(rs);
  });
  var check=require('./database/login');
  console.log(check(req.body));
  res.render('login');
  }
  catch(e){
    res.render('registry',{state:"fail"});
  }
})
module.exports = app;
