
$('#signup-form').on('submit', function(event) {
    event.preventDefault();

    var identifiers = ['username', 'email', 'password'];
    var data = {};
    for (var i in identifiers) {
        data[identifiers[i]] = $('#' + identifiers[i]).val();
    }
    $.ajax({
        url: '/signup',
        method: 'POST',
        data: data
    }).then(function(res) {
        location.replace('/login')
    });
});

var typed = new Typed('#username', {
    strings: ["welcome!", "type username here"],
    typeSpeed: 100,
    startDelay: 500,
    showCursor: false,
    attr: 'placeholder',
    smartBackspace: true,
    backSpeed: 100
});

var typed = new Typed('#email', {
    strings: ["johndoe@gmail.com", "johndoe@yahoo.com", 'johndoe@outlook.com', 'johndoe@aol.com', 'johndoe@live.com'],
    typeSpeed: 100,
    startDelay: 7000,
    showCursor: false,
    attr: 'placeholder',
    smartBackspace: true,
    backSpeed: 100,
    loop: true,
    loopCount: Infinity
});


