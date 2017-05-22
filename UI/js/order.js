$(document).ready(function() {
    $('div.order-item-head').click(function() {
        var body = $(this).next();
        body.find('div.order-status').toggle();
        body.find('div.order-item-list').toggle();
    });

    $('button.btn-secondary').click(function() {
        var id = $(this).prev().text();
        var order_id = $(this).parent().parent().parent().prev().text();
        order_id = order_id.split('\n')[1].split('#')[1];

        $.ajax({url: '/order/requestKey',
                method: 'post',
                dataType: 'json',
                data: {'game_id': id,
                       'order_id': order_id,
                },
                success: function(result) {
                    alert(result.message);
                    console.log(result.message);
                }
        });
    });
});
