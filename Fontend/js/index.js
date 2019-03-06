/** ================ Methods Region ======================== */

/**
 * Get text color based on background color.
 * https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
 * @param {String} hexcolor color at hex string
 */
function getContrastYIQ(hexcolor) {
    var r = parseInt(hexcolor.substr(1,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);

    var o = Math.round(((parseInt(r) * 299) +
                        (parseInt(g) * 587) +
                        (parseInt(b) * 114)) / 1000);	

    var fore = (o > 125) ? 'black' : 'white';

    return fore;
}

/**
 * Show all todolists.
 * @param  {Array} data Array todolist Object.
 */
function appendContent(data) {
    if(data.length <= 0) {
        $(".content").append("Không có dữ liệu nào để hiển thị");
        return;
    }
    data.map(item => {
        let color = getContrastYIQ(item.color? item.color: "#ffffff");
        let content =
            `<div class="item border shadow p-2 my-3 text-white rounded" 
                style="background: ${item.color? item.color: "#ffffff"};">
                <div class="action clearfix show-detail">
                    <div class="title float-left" >
                        <a href="./detail_todolist.html?id=${item.id}&title=${item.title}" 
                            class="nav-link" style="color:${color}">
                            ${item.title}
                        </a>
                    </div>
                    <div class="dropdown  float-right" style="margin: 10px;">
                        <spanid="dropdownMenuButton"
                            style="color:${color}; cursor: pointer;" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                        </span>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                            <a href="#" data-id="${item.id}" class="dropdown-item btn-edit">
                                Chỉnh sửa
                            </a>
                            <a href="#" data-id="${item.id}" class="dropdown-item btn-delete">
                               Xóa
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;

        // Append a todolist to view.
        $(".content").append(content);
    });
}

/**
 * Delete a todolist.
 * @param  {Number} id todolist ID
 */
function deleteTodoList(id) {
    $.ajax({
        url:`${restServer}todo-lists/${id}`,
        type: "DELETE",
        success: function(res) {
            alert("Xóa thành công!");
            window.location.reload();
        },
        error: function(error) {
            alert("Error: " + JSON.stringify(error));
        }
    });
}

/** ================== Event Region ====================== */

/** Delete event for delete button. */
function setDeleteEvent() {
    $(".btn-delete").on('click', function(e){
        e.preventDefault();
        if(confirm("Bạn có muốn xóa không?")) {
            let id = $(this).data().id;
            deleteTodoList(id);
        }
    });
}

/**Event for submit form edit/create form */
function setEditOrCreateSubmit(oldData = null) {
    
    $("#frmCreateOrEdit").on("submit", function(e){
        e.preventDefault();
        
        let title =  $("#txtTitle").val();
        let color =  $("#txtColor").val();

        // DEFAULT URL AND submitType refer to api create new todolist.
        let url = `${restServer}todo-lists`;
        let submitType = "POST";

        if(title !== "" && color !== "") {
            if (oldData === null) { 
                /*======== Create new todolist. =====*/
                oldData = {
                    title: title,
                    color: color
                };
   
            } else {
                /*======== Update todolist. =====*/
                oldData.title = title;
                oldData.color = color;
                // Set url for update todolist.
                url = `${restServer}todo-lists/${oldData.id}`;
                submitType = "PATCH";
            }

        } else {
            alert("Bạn cần điền đầy đủ các thông tin trước khi submit");
            return;
        }   

        // Call ajax. create or update todolist.
        $.ajax({
            url: url,
            type: submitType,
            contentType: "application/json",
            data: JSON.stringify(oldData),
            success: function(res) {
                window.location.reload();
            },
            error: function(err) {
                alert(JSON.stringify(err));
            }
        });
    });
    
}

/**Set event show edit todolist form. */
function setShowEditFormEvent() {
    $(".btn-edit").on('click', function(e){
        e.preventDefault();
        let id = $(this).data().id;
        $("#createEditModal .modal-title").html("Chỉnh sửa");

        // Call Ajax: get todolist need to edit.
        $.ajax({
            url: `${restServer}todo-lists/${id}`,
            type: "GET",
            success: function(res) {
              
                // Set current value for color.
                $("#txtColor").val(res.color? res.color :'#ffffff');

                // Set current value for title.
                $("#txtTitle").val(res.title);

                // Set action when submit form edit.
                setEditOrCreateSubmit(res);

                // Show modal after set value.
                $("#createEditModal").modal();
            },
            error: function(err) {
                alert(JSON.stringify(err));
            }
        });       
    });
}

function setShowCreateFormEvent() {
    $("#btnCreate").on("click", function(e) {
        e.preventDefault();
        $("#createEditModal .modal-title").html("Thêm một todolist mới");
      
        // Set current value for color.
         $("#txtColor").val('#ffffff');

         // Set current value for title is empty.
         $("#txtTitle").val("");
        
        // Set event for submit form
        setEditOrCreateSubmit();
        
         // Show modal create after set value.
        $("#createEditModal").modal();
    });
}

/** ============  Document ready handle ================= */
$(function() {

    setShowCreateFormEvent();

    // Load data and set event.
    $.ajax({
       
        url: `${restServer}todo-lists`,
        type: "GET",
        success: function (res) {

            // Append content after get list of todoslist.
            appendContent(res);

            // Set event for each delete todolist button.
            setDeleteEvent();

            // Set event for each button edit todolist.
            setShowEditFormEvent();        
        },
        error: function (mess) {
            alert("ERROR " + mess);
        }
    });

    
})