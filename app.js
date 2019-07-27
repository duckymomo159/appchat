var createError = require('http-errors');
var express = require('express');
var app = express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
var _=require('lodash');
server.listen(process.env.PORT || 3000);
app.use(express.static(__dirname+'/public'));
app.set('views', __dirname+"/views");
app.set('view engine', 'ejs');
var arr=[];
io.on('connection',function(socket){
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
    io.sockets.emit('sever-send-mess',{text:data.text,user:data.user});
  })
});

app.get('/',function(req,res){
  res.render('index',{title:"hello"});
});
module.exports = app;
