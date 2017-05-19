//request key value to server
function reqFunction() {
  if(id_git.value.length < 4)
  {
    alert("Insert correct Github Account");
  }
  else{
    alert("Request the PGP Key value");
  }
}

//verifying the value
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