
$('.remove-favorite').on('click', function() {
    data = {
        header: $(this).attr('data-header')
    };

    $.ajax({
        url: '/removeFavorite',
        method: 'POST',
        data: data,
    }).then(function(res) {
        location.reload();
    });
});