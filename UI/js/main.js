$(document).ready(function(){
  // Initialize Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#myPage']").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {

      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
})

// Get the Login modal
var modal = document.getElementById('modal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//count product quantity
function modifyProductQuantity(id, quantity){
        
         if(isNaN($("#"+id).val())){
              alert( 'Only use number' );
              $("#"+id).focus();
              $("#"+id).val(0);
              return;
         }
        
         //var v = parseFloat($("#"+id).val())+parseFloat(quantity);    
         //$("#"+id).val(Math.round(v*10)/10);
          
         var q = parseInt($("#"+id).val())+parseInt(quantity);    
         $("#"+id).val(q);


    };

function msgFunction(session, comments) {
  var session = false;
  
  // if($(comments).value.length < 10)
  // {
  //   alert("Please insert more than 10byte.");
  //   return;
  // }

  if(session == true)
  {
    //send msg
    return;
  } 
  else 
  {
    alert("If you want to use it, You should Log-in first.");
  }
}

function reqFunction() {
  if(id_git.value.length < 4)
  {
    alert("Insert correct Github Account");
  }
  else{
    alert("Request the PGP Key value");
  }
  
  
}
function verFunction() {

  //should send value to server 

  var verify = true;

  if(verify == true)
  {
    alert("Verified");
  }
  else{
    alert("Insert the correct value again!");
  }
  
  
}

//password check

//sign up alert button 
function signupFunction() {

  var signup= true;

  if(signup == true)
  {
    alert("Success");
  }
  else{
    alert("Failed!");
  }
  
  
}