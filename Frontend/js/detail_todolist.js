/** ======== Methods regions ====== */
function doneEvent(todo) {
    window.event.preventDefault();
    todo.isComplete = true;

    // Call ajax update
    $.ajax({
        url: `${restServer}todos/${todo.id}`,
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
    if(data.length <= 0) {
        $(".content").append("<p class='text-center'>Không có dữ liệu nào để hiển thị</p>");
        return;
    }
    data.map(item => {
        let content =
            `<div class="item border ${item.isComplete == true? '':'shadow-sm'} p-2 my-3 rounded">
                <div class="action clearfix">
                    <div class="title float-left">
                        <a href="./detail_todo.html?id=${item.id}&listTitle=${title}" class="nav-link">
                            ${ item.isComplete === true 
                                ?`<del class='text-secondary'>${item.title}</del>`
                                :item.title
                            }
                        </a>
                    </div>
                    <div class="dropdown  float-right" style="margin: 10px;">
                        <spanid="dropdownMenuButton"
                            style="cursor: pointer;" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false">
                             <i class="fas fa-ellipsis-v"></i>
                        </span>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                            <a href="#" data-id="${item.id}" class="dropdown-item btn-delete">
                                Xóa
                            </a>
                            ${item.isComplete === true 
                                ?''
                                :` <a href="#" id="item_${item.id}" class="dropdown-item btn-done">
                                    Đánh dấu đã xong
                                </a>`
                            }                           
                        </div>
                    </div>                   
                </div>
            </div>`;

        $(".content").append(content);

        // Set event for done button.
        $("#item_"+item.id).on("click", function() {
            doneEvent(item);
        });
    });
}

function callAjax(data, isCreate = true) {
    let url = `${restServer}todos`;
    let type = "POST";

    if (isCreate == false) {
        url = `${restServer}todos`;
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
                callAjax(data);

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

        $('.modal-title').html('Thêm mới');
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
                url: `${restServer}todos/${id}`,
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
        url: `${restServer}todo-lists/${todoListId}/todos`,
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