
$('.comment-form').on('submit', function(event) {
    event.preventDefault();
    data = {
        id: $(this).attr('data-id'),
        comment: $(this).children('.comment').val()
    };
    console.log(data);

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
    console.log(data);
    $.ajax({
        url: '/deleteComment',
        method: 'POST',
        data: data,
    }).then(function(res) {
        location.reload();
    });
});

$('#toggle-comments').on('click', function() {
    $('#comments-div').toggle();
});