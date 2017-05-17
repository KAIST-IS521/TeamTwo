$(document).ready(function() {
    $('div.order-item-head').click(function() {
        var body = $(this).next();
        body.find('div.order-status').toggle();
        body.find('div.order-item-list').toggle();
    });
});
