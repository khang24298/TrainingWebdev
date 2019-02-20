/** ======== Methods regions ====== */
function doneEvent(todo) {
    window.event.preventDefault();
    todo.isComplete = true;

    // Call ajax update
    $.ajax({
        url: `http://todolist.api.webdevuit.com//todos/${todo.id}`,
        type: "PUT",
        data: JSON.stringify(todo),
        contentType: "application/json",
        success: function () {
            window.location.reload();
        },
        error: function (e) {
            alert("Error" + JSON.stringify(e));
        }
    });
}

function appendContent(data, title, listId) {
    data.map(item => {
        let content = item.isComplete === false ?
            `<div class="item border p-2 my-1">
                <div class="action clearfix">
                    <div class="title float-left">
                        <a href="./detail_todo.html?id=${item.id}&listTitle=${title}">${item.title}</a>
                    </div>
                    <a href="#" data-id="${item.id}" class="btn btn-outline-danger btn-sm float-right btn-delete ml-2">
                        <i class="fas fa-trash-alt"></i>
                    </a>
                    <a href="#" id="item_${item.id}" class="btn btn-outline-success btn-sm float-right btn-done">
                        <i class="fas fa-check"></i>
                    </a>
                </div>
            </div>` :
            `<div class="item border p-2 my-1">
                <div class="action clearfix">
                    <div class="title float-left">
                        <a href="./detail_todo.html?id=${item.id}&listTitle=${title}"><del>${item.title}</del></a>
                    </div>
                    <a href="#" data-id="${item.id}" class="btn btn-outline-danger btn-sm float-right btn-delete ml-2">
                        <i class="fas fa-trash-alt"></i>
                    </a>
                </div>
            </div>`

        $(".content").append(content);

        // Set event for done button.
        $("#item_"+item.id).on("click", function() {
            doneEvent(item);
        });
    });
}

function ajax(data, isCreate = true) {
    let url = "http://todolist.api.webdevuit.com/todos";
    let type = "POST";

    if (isCreate == false) {
        url = "http://todolist.api.webdevuit.com/todos";
        type = "PUT";
    }

    $.ajax({
        url: url,
        type: type,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function () {
            alert("Thành công!");
            window.location.reload();
        },
        error: function (error) {
            alert("ERROR" + JSON.stringify(error));
        }
    });
}
/** ========= Set event methods regions */

function setEventSubmitEditOrCreateForm(oldData = null) {
    $("#frmCreateOrEdit").on("submit", function (e) {
        e.preventDefault();
        let title = $("#txtTitle").val();
        let desc = $("#txtDesc").val();
        let todoListId = $("#txtTodoListId").val();
        if (title != "" && desc != "") {
            if (oldData === null) {
                // Create
                let data = {
                    title: title,
                    desc: desc,
                    isComplete: false,
                    todoListId: parseInt(todoListId)
                }
                ajax(data);

            } else {
                // Edit 
            }
        } else {
            alert("Bạn phải điền đầy đủ thông tin!");
        }
    });
}

function setEventShowCreateForm(todoListId) {
    $("#btnCreate").on("click", function (e) {
        e.preventDefault();

        $("#txtTitle").val("");
        $("#txtDesc").val("");
        $("#txtTodoListId").val(todoListId);
        $("#createEditModal").modal();

        setEventSubmitEditOrCreateForm();
    });
}

function setDeleteEvent() {
    $(".btn-delete").on("click", function (e) {
        e.preventDefault();
        let id = $(this).data().id;
        if (confirm("Bạn có chắc muốn xóa không?")) {
            $.ajax({
                url: `http://todolist.api.webdevuit.com/todos/${id}`,
                type: "DELETE",
                success: function () {
                    alert("Xóa thành công");
                    window.location.reload();
                },
                error: function () {
                    alert("Xóa thất bại!")
                }
            });
        }
    });
}



/** Handle event document ready */
$(function () {

    let currentURL = window.location.href;
    let url = new URL(currentURL);
    let todoListId = url.searchParams.get('id');
    let title = url.searchParams.get('title');

    $("#title").html(title);

    // Event for show createForm.
    setEventShowCreateForm(todoListId);

    $.ajax({
        url: `http://todolist.api.webdevuit.com/todo-lists/${todoListId}/todos`,
        type: "GET",
        success: function (res) {
            // Render all todos.
            appendContent(res, title, todoListId);
            setDeleteEvent();
        },
        error: function (error) {
            alert("ERROR " + JSON.stringify(error));
        }
    });

});