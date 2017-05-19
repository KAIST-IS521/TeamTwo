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
$(function(){
  $('#pw').keyup(function(){
   $('font[name=check]').text('');
  }); //#user_pass.keyup

  $('#pw2').keyup(function(){
   if($('#pw').val()!=$('#pw2').val()){
    $('font[name=check]').text('');
    $('font[name=check]').html("Incorrected Password");
   }else{
    $('font[name=check]').text('');
    $('font[name=check]').html("Corrected Password");
   }
  }); //#chpass.keyup
 });

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