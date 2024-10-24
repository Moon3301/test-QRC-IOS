$(document).ready(function () {
    const selectUser = function (ui) {
        OrganizationUser(ui.item.id);
    }
    autocomplete('#user', '/Account/Autocomplete', null, selectUser);

    const selectCategory = function (ui) {
        OrganizationCategory(ui.item.id);
    }
    autocomplete('#category', '/Category/Autocomplete', null, selectCategory);
});

function OrganizationUser(user, remove) {
    const success = function (result) {
        $("#users").html(result);
    }
    const organization = $('#organization').val();
    post('/Organization/UserRelation', { organization, user, remove  }, success);
}

function OrganizationCategory(category, remove) {
    const success = function (result) {
        $("#categories").html(result);
    }
    const organization = $('#organization').val();
    post('/Organization/CategoryRelation', { organization, category, remove }, success);
}


function SetCurrentOrganization(event) {
    post('/Organization/SetCurrent', { organization: $(event.target).val() });
}
