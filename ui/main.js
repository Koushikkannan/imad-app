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
var counter=0;

button.onclick=function(){
    counter=counter+1;
    var span=document.getElementById('count');
    span.innerHTML=counter.toString();

};
