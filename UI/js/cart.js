$(document).ready(function() {
    $('button.game-item').click(function() {
        var item_name = $.trim($(this).text().split('\n')[1]);
        $('div h3.name-to-remove').text(item_name);

        var p_id = $.trim($(this).find('span.cart-id').text());
        $('div span#id-to-send').text(p_id);

        $('div#remove-popup').show();
    });

    $('button.yesbtn').click(function() {
        $('div#remove-popup').hide();
    });

    $('button.nobtn').click(function() {
        $('div#remove-popup').hide();
        $.ajax({url: '/cart/remove',
                method: 'post',
                dataType: 'json',
                data: {'cart_id': $('#id-to-send').text()},
                success: function(result) {
                    alert(result.message);
                    location.reload();
                },
        });
    });

    $('button#orderbutton').click(function() {
        $.ajax({url: '/cart/purchase',
                method: 'get',
                dataType : 'json',
                success: function(result) {
                    var account = '';
                    if (result.status != 1) {
                        alert(result.message);
                    } else  {
                        account = result.account;
                        $('#account-container').text(' Account: ' + account + ' ');
                        $('div#order-popup').show();
                    }
                }
        });
    });
});
