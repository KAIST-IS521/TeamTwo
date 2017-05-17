$(document).ready(function() {
    $('button.game-item').click(function() {
        var item_name = $.trim($(this).text().split('\n')[1]);
        $('div h3.name-to-remove').text(item_name);

        var p_id = $.trim($(this).find('span.product-id').text());
        $('div span#id-to-send').text(p_id);

        $('div.msgpopup').show();
    });

    $('button.yesbtn').click(function() {
        $('div.msgpopup').hide();
    });

    $('button.nobtn').click(function() {
        $('div.msgpopup').hide();
        location.reload();
    });
});
