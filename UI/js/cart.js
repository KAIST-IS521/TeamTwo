$(document).ready(function() {
    $('button.game-item').click(function() {
        var item_name = $.trim($(this).text().split('\n')[1]);
        $('div h3.name-to-remove').text(item_name);

        var p_id = $.trim($(this).find('span.product-id').text());
        $('div span#id-to-send').text(p_id);

        $('div#remove-popup').show();
    });

    $('button.yesbtn').click(function() {
        $('div#remove-popup').hide();
    });

    $('button.nobtn').click(function() {
        $('div#remove-popup').hide();
        location.reload();
    });

    $('button#orderbutton').click(function() {
        $('div#order-popup').show();
    });
});

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