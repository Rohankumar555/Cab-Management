$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
 });
 
function validateform(){  
    var name=document.getElementById("username").value;  
    var password=document.getElementById("password").value;  
      
    if (name==null || name==""){  
      alert("UserName can't be blank");  
      return false;  
    }else if(password.length<7){  
      alert("Password must be at least 7 characters long.");  
      return false;  
      }
      
      return true;  
}  
document.getElementsByName('register')[0].addEventListener('click', async (event) => {
  event.preventDefault();
  var check = validateform();
  if (check == true) {
      const response = await fetch(url = "http://localhost:3000/login", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify({
              username:document.getElementById("username").value,  
              password:document.getElementById("password").value  
               
          }),
          // body data type must match "Content-Type" header
      });
     if(response)
     {
      console.log("Hello");
      console.log(response.json());
      window.location.replace("/login_homepage");
     }else{
      window.location.replace("/login");
     }
  }
}
);

 