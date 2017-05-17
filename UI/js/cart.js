$(document).ready(function() {
    $('button.game-item').click(function() {
        var item_name = $.trim($(this).text().split('\n')[2]);
        //console.log($('div h3.name-to-remove').text());
        $('div h3.name-to-remove').text(item_name);
    });
});
