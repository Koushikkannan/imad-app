console.log('Loaded!');
 //change the text of main-text div
 var element=document.getElementById('main-text');
 element.innerHTML="New value";
var marginLeft=0;
function moveRight(){
     marginLeft=marginLeft+1;
     img.style.marginLeft=marginLeft+'px';
  }
  
 //move the image
 var img=document.getElementById('madi');
 img.onclick=function(){
    // img.style.marginLeft='100px';
     var interval=setInterval(moveRight,50);
 };
var button=document.getElementById('counter');
 //var counter=0;
 
 button.onclick=function(){
     //counter=counter+1;
     //var span=document.getElementById('count');
     //span.innerHTML=counter.toString();
 
 var request=new XMLHttpRequest();
 request.onreadystatechange=function(){
     if(request.readystate===XMLHttpRequest.Done)
     {
     if(request.status===200)
     {
        var counter=request.responseText;
         var span=document.getElementById('count');
     span.innerHTML=counter.toString(); 
     }
     }
     //not done yet
 };
 //make the request and once the request is made then the request state changes to request is done and the code will be executed
 request.open('GET','http://kannand2013.imad.hasura-app.io/counter',true);
 request.send(null);
 };
 //create a request object
 
 var nameInput=document.getElementById('name');
 var name=nameInput.value;
 var submit=document.getElemntById('submit_btn');
 submit.onclick=function()
 {
     //make a request to the server and send the name
     //capture a list of names and render it as a list
     var names=['name1','name2','name3','name4'];
     var list='';
     for(var i=0;i<names.length;i++)
     {
         list='<li>'+names[i]+'</li>';
     }
 var ul=document.getElementById('namelist');
 ul.innerHTML=list;
     
 };