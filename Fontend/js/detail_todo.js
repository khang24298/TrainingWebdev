/** Event */


function loadContent() {

    let currentURL = window.location.href;
    let url = new URL(currentURL);
    let id = url.searchParams.get("id");
    let listTitle = url.searchParams.get("listTitle");

    $.ajax({
        url: `http://todolist.api.webdevuit.com/todos/${id}`,
        type: "GET",
        success: function (res) {

            $("#divContent").data().old = JSON.stringify(res);
            $("#title").prepend(res.title);
            $("#descText").html(res.desc);
            $("#btnBack").attr("href", `./detail_todolist.html?id=${res.todoListId}&title=${listTitle}`);
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
}

function eventEnableEdit() {

    // Enable edit when double click title or description.
    $("#descText, #title").dblclick(function (e) {
        e.preventDefault();

        $(this).attr("contenteditable", true);
        $(this).css("background", "white");
        $(this).css("padding", "5px");
        $(this).css("border", "1px solid");
        $(this).focus();

        $("#btnSave, #btnCancel").removeClass("d-none");
    });
}

function btnSaveOnClick() {
    $("#btnSave").on("click", function (e) {
        e.preventDefault();

        // Change GUI
        $("#descText, #title").attr("contenteditable", false);
        $("#descText, #title").css("background", "");
        $("#descText, #title").css("padding", "");
        $("#descText, #title").css("border", "");

        // Get value
        let title = $("#title").html();
        let desc = $("#descText").html();
        let todo = JSON.parse($("#divContent").data().old);

        // Update value.
        todo.title = title;
        todo.desc = desc;

        // Submit change.
        $.ajax({
            url: `http://todolist.api.webdevuit.com//todos/${todo.id}`,
            type: "PUT",
            data: JSON.stringify(todo),
            contentType: "application/json",
            success: function () {
                alert("Đã lưu!");
                $("#btnSave, #btnCancel").addClass("d-none");
            },
            error: function (e) {
                alert("Error" + JSON.stringify(e));
            }
        });
    });
}

function btnCancelOnClick() {
    $("#btnCancel").on("click", function (e) {
        e.preventDefault();
        window.location.reload();
    });
}

function btnDeleteOnClick() {
    $("#btnDelete").on("click", function (e) {
        e.preventDefault();
        if (confirm("Bạn có thật sự muốn xóa không?")) {
            let todo = JSON.parse($("#divContent").data().old);
            $.ajax({
                url: `http://todolist.api.webdevuit.com/todos/${todo.id}`,
                type: "DELETE",
                success: function () {
                    alert("Đã xóa!");
                    window.location = $("#btnBack").attr("href");

                }
            })
        }
    });
}

// Init Event.
$(function () {
    loadContent();
    eventEnableEdit();
    btnSaveOnClick();
    btnCancelOnClick();
    btnDeleteOnClick();
});