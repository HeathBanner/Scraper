
$('.comment-form').on('submit', function(event) {
    event.preventDefault();
    data = {
        id: $(this).attr('data-id'),
        comment: $(this).children('.comment').val()
    };

    $.ajax({
        url: '/comment',
        method: 'POST',
        data: data,
    }).then(function(res) {
        location.reload();
    });
});

$('.delete-btn').on('click', function() {
    const data = {
        userId: $(this).attr('data-userId'),
        articleId: $(this).attr('data-articleId'),
        comment: $(this).attr('data-comment')
    };
    $.ajax({
        url: '/deleteComment',
        method: 'POST',
        data: data,
    }).then(function(res) {
        location.reload();
    });
});

$('.toggle-comments').on('click', function() {
    $(this).parent().children('.comments-div').toggle();
});