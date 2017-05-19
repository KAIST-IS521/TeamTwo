// Get the Login modal
// var modal = document.getElementById('myModal');

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

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

// search function
function searchFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}

