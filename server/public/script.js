$(function() {
    $('#get-button').on('click', function(event) {
        event.preventDefault();
        var id = $('#userid').val();
        var first = $('#first').val();
        var last = $('#last').val();
        var age = $('#age').val();
        $.ajax({
            url: '/addname',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ UserID: id, firstName: first, lastName: last, age: age }),
            success: function(response) {
                console.log(response);
                if (response.slice(-1) === ".") {
                    alert(response);
                } else {
                    window.location.replace('successful');
                }
            }
        });
    });
});