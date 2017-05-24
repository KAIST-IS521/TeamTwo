var currently_selected = '';

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

    $('.detail-button').click(function() {
        var product_id = $(this).parent().find('h3').text();
        currently_selected = product_id;

        $('#selected-img').attr('src', $(this).parent().find('img').attr('src'));
        $('#selected-game-name').text($(this).parent().find('strong').text());
        $('#selected-game-price').text('Price : ' + $(this).parent().find('em').text().split(' ')[2] + ' won');
        $('#quantity').val(0);
    });

    $('#add-to-cart-button').click(function() {
        $.ajax({url: '/product/add',
                method: 'get',
                dataType: 'json',
                data: {'product-id': parseInt(currently_selected),
                       'product-num': parseInt($('#quantity').val())},
                success: function(result) {
                    alert(result.message);
                    if (result.status == 1) {
                        $('#detail-close-button').click();
                    }
                }
        });
    });

    $('#buy-button').click(function() {
        $.ajax({url: '/product/purchase',
                method: 'get',
                dataType: 'json',
                data: {'product-id': parseInt(currently_selected),
                       'product-num': parseInt($('#quantity').val())},
                success: function(result) {
                    alert(result.message);
                    if (result.status == 1) {
                        location.href = '/order';
                    }
                }
        });
    });

    $('#button-send-message').click(function() {
        $.ajax({url: '/mypage/sendMessage',
                method: 'post',
                dataType: 'json',
                data: {'msg': $('#comments').val()},
                success: function(result) {
                    alert(result.message);
                }
        });
    });
})

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
