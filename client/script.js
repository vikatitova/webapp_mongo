class ManageUsers {

    tbody = document.querySelector("tbody");
    usersNumberId = document.getElementById('usersNumber');
    usersNumber;

    updateUsersNumber(users, option) {
        const calcUsersByOption = {
            "getUsers": () => users.length,
            "createUser": () => Number(this.usersNumber) + 1,
            "deleteUser": () => Number(this.usersNumber) - 1,
        }
        this.usersNumberId.innerHTML = calcUsersByOption[option]();
        this.usersNumber = this.usersNumberId.innerHTML;
    }

    async getUsers() {

        const response = await fetch('/users', {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        const users = await response.json();

        this.updateUsersNumber(users, "getUsers");

        let tableRows = "";
        users.forEach(user => tableRows += this.createTableRow(user));
        this.tbody.insertAdjacentHTML("afterbegin", tableRows);
    }

    async createUser(name, age) {

        const response = await fetch("/users", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                age
            })
        });
        const user = await response.json();

        this.updateUsersNumber(users, "createUser");

        this.tbody.insertAdjacentHTML("beforeend", this.createTableRow(user));
    }

    async deleteUser(id) {

        const response = await fetch("/users/" + id, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        });
        const user = await response.json();

        this.updateUsersNumber(user, "deleteUser");

        const tr = document.querySelector(`tr[data-rowid="${id}"]`);
        tr.remove();
    }

    async getUser(id) {

        const response = await fetch("/users/" + id, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        const user = await response.json();

        document.getElementById('editUser').setAttribute('data-id', user.id);
        document.getElementById('editableUserName').value = user.name;
        document.getElementById('editableUserAge').value = user.age;
    }

    async editUser(id, name, age) {

        const response = await fetch("/users", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                name,
                age
            })
        });
        const user = await response.json();

        const tr = document.querySelector(`tr[data-rowid="${user.id}"]`);
        tr.insertAdjacentHTML("beforebegin", this.createTableRow(user));
        tr.remove();
    }

    eventHandler = (e) => {

        e.preventDefault();
        if (e.target.id === "createUser") {
            const name = e.target.elements["name"].value;
            const age = e.target.elements["age"].value;
            this.createUser(name, age);
        }
        if (e.target.id === "editUser") {
            const id = e.target.dataset.id;
            const name = e.target.elements["name"].value;
            const age = e.target.elements["age"].value;
            this.editUser(id, name, age);
        }
        if (e.target.id === "deleteUser") {
            const id = e.target.dataset.id;
            this.deleteUser(id);
        }
        $(`#${e.target.id}Modal`).modal('toggle');
    }

    createTableRow(user) {
        return `
            <tr data-rowid="${user.id}">
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.age}</td>
                <td>
                    <a href="#editUserModal" class="edit" data-toggle="modal" data-id="${user.id}">
                        <i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
                    </a>
                    <a href="#deleteUserModal" class="delete" data-toggle="modal" data-id="${user.id}">
                        <i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
                    </a>
                </td>
            </tr>
        `;
    }

}

const forms = document.querySelectorAll("form");
const users = new ManageUsers();
users.getUsers();

// Call eventHandler for submited modal
forms.forEach(form => {
    form.addEventListener("submit", users.eventHandler);
})

// Make input fields blank after pressing Add New User
$('#createUserModal').on('show.bs.modal', () => {
    [...document.getElementsByClassName('form-control')].forEach(e => {
        e.value = '';
    })
})
// Call getUser with id of user after pressing Edit User
$('#editUserModal').on('show.bs.modal', (event) => {
    const userId = event.relatedTarget.dataset.id;
    users.getUser(userId);
})
// Set id of user into form after pressing Delete User
$('#deleteUserModal').on('show.bs.modal', (event) => {
    const userId = event.relatedTarget.dataset.id;
    document.getElementById('deleteUser').setAttribute('data-id', userId);
})