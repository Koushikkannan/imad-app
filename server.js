var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');


var config={
    
    user:'kannand2013',
    database:'kannand2013',
    host:'db.imad.hasura-app.io',
    port:'5432',
    //We use Environment variable for password to prevent others from accessing 
    password:process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
  secret:'someRandomSecretValue',
  cookie:{maxAge:1000*60*60*24*30}
  
}));



var articles={
Articleone:{
    title:'Artivle-one|kannan',
    heading:'Article-1',
    date:'1 Aug,2017',
    content:` <h3>nothing to show sample</h3> `
    
},
Articletwo:{ title:'Artivle-Two|kannan',
    heading:'Article-2',
    date:'2 Aug,2017',
    content:` <h3>nothing to show sample</h3> `},
Articlethree:{ title:'Artivle-Three|kannan',
    heading:'Article-3',
    date:'3 Aug,2017',
    content:` <h3>nothing to show sample</h3> `}
};


function createTemplate(data){
    var title=data.title;
    var heading=data.heading;
    var content=data.content;
    var date=data.date;
var htmlTemplate=`<html>
    <head>
        <title>${title}</title>
        <meta name="viewport" content="width-device-width, initial-scale-1"/>
        <link href="/ui/style.css" rel="stylesheet" />
   </head>
    <body>
        <div class="container">
        <div>
            <a href="/">Home</a>
        </div>
        <h3>${date.toDateString()}</h3>
        <h3>${heading}</h3>
       <h3>${content}</h3>
        </div>
    </body>
</html> `;
return htmlTemplate;

}

var counter=0;

app.get('/counter', function (req, res) {
    counter=counter+1;
  res.send(counter.toString());
});


var Pool=new Pool(config);
app.get('/test-db', function (req, res) {
  //make a select request
  //returns a respone with the results
  Pool.query('SELECT * FROM test',function(err,result){
      if (err){
          res.status(500).send(err.toString());
      } else {
          // res.send(JSON.stringify(result));
          res.send(JSON.stringify(result.rows));
      }
  
  });
});



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){
    
    //How do we create a hash?
    //var hashed=crypto.pbkdf2Sync(password,salt,iterations,keylen,digest);
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}

app.get('/hash:input',function(req,res)
{
    var hashedString=hash(req.params.input,'this-is-some-random-string?');
    res.send(hashedString);
});


app.post('/create-user',function(req,res){ 
    //username,password
    //{"username":"kannan","password":"password"}
    //JSON
    
    
    var username=req.body.username;
    var password=req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)', [username,dbString], function(err,result){
         if (err){
          res.status(500).send(err.toString());
      } else {
          // res.send(JSON.stringify(result));
          res.send('user successfully created :'+username);
      }
        
    });
});


app.post('/login',function(req,res){
    
     var username=req.body.username;
    var password=req.body.password;
   
   
    Pool.query('SELECT * FROM "user" WHERE username=$1', [username], function(err,result){
         if (err){
          res.status(500).send(err.toString());
      } else {
          if(result.rows.length===0)
          {
              
              res.send(403).send('username/password is invalid');
          }
          else
          {
              //Match the password
              var dbString=result.rows[0].password;
              var salt=dbString.split('$')[2];
              var hashedPassword=hash(password,salt);//creating a hash based on the password submitted and and the original salt
                // res.send(JSON.stringify(result));
                if(hashedPassword===dbString){
         // res.send('user successfully created :'+username);
         
         
         //set the session
         req.session.auth={userId:result.rows[0].id};
         
         //set cookie with a session id
         //internally, on the server side.it maps the session id to an object
         //{auth:{userId}}
         
         
         res.send('credentials correct');
                } else{
                    res.send(403).send('username/password is invalid');
                }
          }
        
      }
        
    });
    
});


app.get('/check-login',function(req,res){
    if(req.session && req.session.auth && req.session.auth.userId){
        res.send('you are logged in:'+req.session.auth.userId.toString());
    }else{
        res.send('you are not logged in');
    }
});


app.get('/logout',function(req,res){
    delete req.session.auth;
  
        res.send('logged out');
    
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});


var names=[];
//app.get('/submit-name/:name', function (req, res) {
app.get('/submit-name', function (req, res) {// /submit-name?name=xxxxxx
  //var name=req.params.name;
  var name=req.query.name;
  
  //get the name from the request
  
  names.push(name);
  //JSON:Java Script Object Notation
  res.send(JSON.stringify(names));//1000
});


app.get('/articles/:articleName', function (req, res) {
    //articleName=article-one   
    //artices[articleName]={} content object for article-one
   // var articleName=req.params.articleName;
   //SELECT * FROM article_wa WHERE title= '\';DELETE WHERE a='\asdf'
    
  Pool.query("SELECT * FROM article_wa WHERE title= $1",[req.params.articleName],function(err,result){
        if (err){
          res.status(500).send(err.toString());
      } else {
          if(result.rows.length===0){
              res.status(500).send('Article not found');
          } else {
              
              var articleData=result.rows[0];
               res.send(createTemplate(articleData));
          }
      }
  });
});

//app.get('/article-two', function (req, res) {
  //res.send('article-two');
//});

//app.get('/article-three', function (req, res) {
 // res.send('article-three');
//});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});




// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
