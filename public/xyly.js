$(document).ready(function () {
    $('#loginForm').show();
    $('#chatForm').hide();
    var socket = io("http://localhost:3000||https://chatboxdemo.herokuapp.com");

    socket.on("Server-send-dk-thatbai", function () {
        alert('Tài khoản đã được đăng ký vui lòng chọn tên khác!')
    });

    socket.on("Server-send-dk-thanhcong", function (data) {
        $('#well').html(data);
        $('#loginForm').hide(2000);
        $('#chatForm').show(1000);
    });

    socket.on("Server-send-listUser", function (data) {
        $("#listUser").html("");
        data.forEach(function (i) {
            $("#listUser").append("<div class='useronl'>" + i + "</div>");
        })
    });
    socket.on("Server-send-text", function (data) {

        $("#listmess").append("<p class='textmessage'>"+ data.name +": " + data.text + "</p>");
        $("#listmess").animate({ scrollTop: $("#listmess")[0].scrollHeight}, 1000);
    });

    $(".dangky").click(function () {
        if ($("#username").val().length > 0) {
            socket.emit("Client-send-username", $("#username").val());
        } else {
            alert("Vui lòng nhập tên của bạn!");
        }
    });

    $("#logout").click(function () {
        socket.emit("Client-send-logout");
        $('#loginForm').show(2000);
        $('#chatForm').hide(1000);
    });
    $(".chat").click(function () {
        var text = $("#txtmess").val();
        if(text.length>0) {
            socket.emit("Client-send-text", text);
            $("#txtmess").val('');
        }else {
            alert("Bạn chưa nhập text");
        }
    });
});