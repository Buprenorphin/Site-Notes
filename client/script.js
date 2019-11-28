$(document).ready(function() {

    addTaskInput();

    $.ajax({
        url: 'http://localhost:5555/cards',
        type: 'GET',
        withCredentials: true,
        success : function(cards) {
            cards.forEach(card => {
                addCard(card)
            });
        },
        error : function(jqXHR, textStatus, errorThrown) {
           
        },                
    });
    
    $("#addList").submit( function(event) {
        event.preventDefault(); 
    
        var formData = $(this).serialize();
    
        console.log(formData);
    
        $.ajax({
            type: "POST",
            url: "http://localhost:5555/cards",
            data: formData,
            success: function(data) {
                console.log(data);
                
                addCard(data);
                $('#addListModal').modal('hide');
            }
        });
    }); 

    function addCard(card) {

        var appCard = document.createElement('div');
            appCard.className = 'card'
            appCard.id = "card-" + card.id

            var removeLink = document.createElement ('a');
                removeLink.className = 'fas fa-times float-right card-close'
                removeLink.onclick = function () {
                    $.ajax({
                        url: 'http://localhost:5555/cards/' + card.id,
                        type: 'DELETE',
                        success : function() { 
                            $('#card-' + card.id).remove();
                        }, error : function(jqXHR, textStatus, errorThrown) {
                            alert('Error: ' + errorThrown);
                        }
                    })
                }
                
            appCard.appendChild(removeLink)

            var appCreateBody = document.createElement ('div');
                appCreateBody.className = 'card-body'

                var appH5 = document.createElement ('h5');
                    appH5.className = 'card-title'
                    appH5.textContent = card.Title

                appCreateBody.appendChild(appH5)

                card.tasks.forEach(task => {

                    var appRowLineItem = document.createElement ('div');
                        appRowLineItem.className = 'row line-item'
                        appRowLineItem.id = 'task-' + card.id + '-' + task.id
                        appRowLineItem.dataset.card = card.id
                        appRowLineItem.dataset.task = task.id

                        // Text
                        var appTask = document.createElement ('div');
                            appTask.className = 'Task col'

                            var appTaskRowLineItem = document.createElement ('span');
                                appTaskRowLineItem.id = "taskLabel-" + card.id + '-' + task.id
                                appTaskRowLineItem.textContent = task.Task
                            
                                appTask.appendChild(appTaskRowLineItem)

                                appRowLineItem.appendChild(appTask)

                        // Button + menu
                        var appMainContentCard = document.createElement ('div');
                            appMainContentCard.className = 'main-content-card col-auto'

                            var appDropdown = document.createElement ('div');
                                appDropdown.className = 'dropleft'
                                
                                var appButtonDropdown = document.createElement('button');
                                    appButtonDropdown.className = 'btn btn-secondary dropdown-toggle'
                                    appButtonDropdown.dataset.toggle = 'dropdown'

                                    appDropdown.appendChild(appButtonDropdown);
                                    
                                var appDropdownMenu = document.createElement ('div');
                                    appDropdownMenu.className = 'dropdown-menu'

                                    var appDropdownItemCreate = document.createElement ('a') 
                                        appDropdownItemCreate.className = 'dropdown-item dropdown-item-create'
                                        appDropdownItemCreate.textContent = 'Edit'
                                        appDropdownItemCreate.dataset.toggle = "modal"
                                        appDropdownItemCreate.dataset.target = "#task_modal"
                                        appDropdownItemCreate.onclick = function(event) {
                                            var node = event.currentTarget.parentNode.parentNode.parentNode.parentNode
                                            var title = node.firstChild.lastChild.textContent

                                            var input = document.getElementById("taskForm_title")
                                            input.dataset.taskId = task.id
                                            input.dataset.cardId = card.id
                                            input.value = title
                                        }

                                    appDropdownMenu.appendChild(appDropdownItemCreate)

                                    var appDropdownItemDelete = document.createElement ('a') 
                                        appDropdownItemDelete.className = 'dropdown-item dropdown-item-delete'
                                        appDropdownItemDelete.textContent = 'Delete'
                                        appDropdownItemDelete.onclick = function() {
                                            $.ajax({
                                                url: 'http://localhost:5555/cards/' + card.id + '/tasks/' + task.id,
                                                type: 'DELETE',
                                                success : function() { 
                                                    $('#task-' + card.id + '-' + task.id).remove();
                                                }, error : function(jqXHR, textStatus, errorThrown) {
                                                    alert('Error: ' + errorThrown);
                                                }
                                            })
                                        }

                                    appDropdownMenu.appendChild(appDropdownItemDelete)

                                appDropdown.appendChild(appDropdownMenu)

                            appMainContentCard.appendChild(appDropdown)
                        
                        appRowLineItem.appendChild(appMainContentCard)

                    appCreateBody.appendChild(appRowLineItem)
                })

            appCard.appendChild(appCreateBody)

        document.getElementById('card-holder').appendChild(appCard)

    }

    // Коли ховається модальне вікно додавання нових карточок з тасками
    $('#addListModal').on('hidden.bs.modal', function (event) {
        $("#input-group").empty();
        $("#input-card-title").val("");
        addTaskInput();
    })


    $('#task_modal').on('hidden.bs.modal', function (event) {
        var input = document.getElementById("taskForm_title")
        input.value = "";
        input.removeAttribute("data-task-id");
        input.removeAttribute("data-card-id");
    });

    $("#taskFrom").submit(function(event) {
        event.preventDefault(); 

        var formData = $(this).serializeJSON();

        var input = document.getElementById("taskForm_title")
        var cardID = input.getAttribute('data-card-id');
        var taskID = input.getAttribute('data-task-id');

        $.ajax({
            type: "PUT",
            url: "http://localhost:5555/cards/" + cardID + "/tasks/" + taskID,
            data: { title: formData.title },
            success: function(data) {
                $('#task_modal').modal('hide');
                
                document.getElementById("taskLabel-" + cardID + '-' + taskID).textContent = formData.title

                console.log(data);
            
            }
        });
    });
})