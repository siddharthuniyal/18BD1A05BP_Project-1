var express=require("express");
var app=express();
let server=require('./server');
let middleware=require('./middleware');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospital';
let db
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database:${url}`);
    console.log(`Database :${dbName}`);

});
app.get('/HospDetails',middleware.checkToken,(req,res)=>{
        var hospname=req.query.hospitalname;
        var phoneno=req.query.phoneno;
        var email=req.query.email;
        var location=req.query.location;
        var hospid=req.query.hospitalid;
        console.log(hospname+" "+phoneno+" "+email+" "+location+" "+hospid);
        var obj={"hospitalname":hospname,"phoneno":phoneno,"email":email,"location":location,"hospid":hospid};
        db.collection("hospitaldetails").insertOne(obj,function(err,res){
                 if(err) throw err;
                 console.log("1 document inserted");
        });

});
app.get('/ventDetails',middleware.checkToken,(req,res)=>{
    var hospname=req.query.hospitalname;
    var ventid=req.query.ventilatorid;
    var status=req.query.ventilatorstatus;
    var hospid=req.query.hospitalid;
    console.log(hospname+" "+ventid+" "+status+" "+hospid);
    var obj={"hospitalname":hospname,"hospid":hospid,"ventilatorid":ventid,"status":status};
    db.collection("ventilatordetails").insertOne(obj,function(err,res){
             if(err) throw err;
             console.log("1 document inserted");
    });

});
app.get('/fetchhospdetails',middleware.checkToken,(req,res)=>{
              console.log("Fetching data from hospital collection");
              db.collection("hospitaldetails").find().toArray().then((result)=>{
                  res.json(result);
              }).catch((err)=>{
                    console.log("error");
              });
});
app.get('/fetchventdetails',middleware.checkToken,(req,res)=>{
    console.log("Fetching data from ventilator collection");
    db.collection("ventilatordetails").find().toArray().then((result)=>{
        res.json(result);
    }).catch((err)=>{
          console.log("error");
    });
});
app.get('/searchvent',middleware.checkToken,(req,res)=>{
       console.log("search ventilator by status and hospitalname");
       var hospitalname=req.query.hospitalname;
       var status=req.query.status;
       console.log(hospitalname+" "+status);
       db.collection("ventilatordetails").find({"hospitalname":hospitalname,"status":status}).toArray().then((result)=>{
             res.json(result);
       }).catch((err)=>{
            res.send("No Match found");
       });
});
app.get('/searchhosp',middleware.checkToken,(req,res)=>{
    console.log("search ventilator by status and hospitalname");
    var hospitalname=req.query.hospitalname;
    console.log(hospitalname);
    db.collection("hospitaldetails").find({"hospitalname":hospitalname}).toArray().then((result)=>{
          res.json(result);
    }).catch((err)=>{
         res.send("No Match found");
    });
});
app.post('/updatestatus',middleware.checkToken,(req,res)=>{
    console.log("update ventilator status by id");
    var ventilatorid=req.query.ventilatorid;
    var status=req.query.status;
    console.log(ventilatorid);
    var cond={"ventilatorid":ventilatorid};
    var set={$set:{"status":status}};
    db.collection("ventilatordetails").updateOne(cond,set).then((result)=>{
        console.log("updated the collection");
        res.send("updated succesfully");
    }).catch((err)=>{
          res.send("No such data exists");
    });
});
app.delete('/deletevent',middleware.checkToken,(req,res)=>{
    console.log("delete ventilator by id");
    var ventilatorid=req.query.ventilatorid;
    console.log(ventilatorid);
    var cond={"ventilatorid":ventilatorid};
    db.collection("ventilatordetails").deleteOne(cond).then((result)=>{
        console.log("deleted succesfully");
        res.send("collection deleted");
    }).catch((err)=>{
        res.send("No such data exists");
    });
});
app.listen(3000);