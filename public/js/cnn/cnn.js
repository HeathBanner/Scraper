
// $('.article').on('click', function() {
//     console.log(this.className);
//     $('#close-btn').toggleClass(this);
//     $(this).toggleClass('active');
//     $('#article-modal').css({
//         zIndex: 2,
//         display: 'block'
//     });
//     $(this).clone().appendTo('#article-body');
// });

// $('#close-btn').on('click', function() {
//     $(this).toggleClass('active');
//     $('#article-body').empty();
//     $('#article-modal').css({
//         display: 'none'
//     });
// });

$('.fav-btn').on('click', function() {

    identifiers = ['region', 'regionLink', 'img', 'header', 'link'];
    data = {};

    for (var i in identifiers) {
        data[identifiers[i]] = $(this).attr('data-' + identifiers[i]);
    }

    $.ajax({
        url: '/fav',
        method: 'POST',
        data: data,
    }).then(function(res) {
    });
});