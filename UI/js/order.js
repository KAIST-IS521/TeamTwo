$(document).ready(function() {
    $('div.order-item-head').click(function() {
        var body = $(this).next();
        body.find('div.order-status').toggle();
        body.find('div.order-item-list').toggle();
    });


    $('.list-group-item').click(function() {

        if ( $(this)[0].innerText.substring(0,4) == "FLAG" ) {
            $.ajax({url: '/order/requestFlag',
                    method: 'get',
                    dataType: 'json',
                    success: function(result) {
                        alert(result.message);
                    }
            });
        }
    });
});
