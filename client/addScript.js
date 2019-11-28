function addTaskInput() {
    var appInput = document.createElement ('div');
        appInput.className = "input-group mb-3"

        var input = document.createElement('input');
            input.type = "text";
            input.className = "form-control";
            input.name = "tasks[]";
            input.placeholder = "Task";

        appInput.appendChild(input);

    var appButtonDiv = document.createElement ('div');
        appButtonDiv.className = "input-group-append";

        var appButton = document.createElement ('button');
        appButton.type = "button";
        appButton.className = "btn btn-outline-secondary";
        appButton.addEventListener("click", remove);

            var appButtonIcon = document.createElement ('i');
                appButtonIcon.className = 'far fa-trash-alt';

    appButton.appendChild(appButtonIcon);
    appButtonDiv.appendChild(appButton);
    appInput.appendChild(appButtonDiv);
        
    var parent = document.getElementById("input-group") // parent
    parent.appendChild (appInput);

}

