var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pool=require('pg').pool;

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
        <h3>${date}</h3>
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


var pool=new Pool(config);
app.get('/test-db', function (req, res) {
  //make a select request
  //returns a respone with the results
  pool.query('SELECT * FROM test',function(err,result){
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
    
  pool.query("SELECT * FROM article_wa WHERE title= '"+ req.params.articleName +"'",function(err,result){
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
