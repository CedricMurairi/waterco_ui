const URL = "https://water-co.herokuapp.com/members";
let table = document.querySelector(".members-table");

window.onload = () => {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json())
    .then(data => {
        const members = data['data'];
        members.forEach(element => {
            table.innerHTML += `
                <tr class="member_${element.member_id}">
                    <td>${element.member_id}</td>
                    <td>${element.name}</td>
                    <td>${element.email}</td>
                    <td>${element.phone}</td>
                    <td><button data-id=${element.member_id} class="edit" onclick="show_member(this.dataset.id)">Edit</button></td>
                    <td><button data-id=${element.member_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                </tr>
            `       
        });
    });
}

function show_member(id){
    fetch(URL + `/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json())
    .then(data => {
        const form = document.querySelector(".edit-member-form");
        form.dataset.id = data['data'].member_id;
        form.children[0].firstElementChild.value = data['data'].name;
        form.children[1].firstElementChild.value = data['data'].email;
        form.children[2].firstElementChild.value = data['data'].phone;
        document.querySelector(".edit-member").classList.remove("hidden");
    });
}

function edit_member(){
    const form = document.querySelector(".edit-member-form");
    const data = {
        'name': form.children[0].firstElementChild.value,
        'email': form.children[1].firstElementChild.value,
        'phone': form.children[2].firstElementChild.value
    }

    fetch(URL + `/${form.dataset.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if(response.ok){
            response.json()
            .then(data => {
                const entry = document.querySelector(`.member_${form.dataset.id}`);
                document.querySelector(".edit-member").classList.add("hidden");
                entry.innerHTML = `
                    <td>${data['data'].member_id}</td>
                    <td>${data['data'].name}</td>
                    <td>${data['data'].email}</td>
                    <td>${data['data'].phone}</td>
                    <td><button data-id=${data['data'].member_id} class="edit" onclick="show_member(this.dataset.id)">Edit</button></td>
                    <td><button data-id=${data['data'].member_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                `
            });
        }
    })

    return false;
}

function show_delete_box(id){
    document.querySelector(".delete-member").dataset.id = id;
    document.querySelector(".delete-member").classList.remove("hidden");
}

function delete_member(){
    const id = document.querySelector(".delete-member").dataset.id;
    fetch(URL + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if(response.ok){
            const tab = document.querySelector(`.member_${id}`);
            tab.classList.add("hidden");
            tab.remove();
            document.querySelector(".delete-member").classList.add("hidden");
        }
    })

    return false;
}

window.onclick = (event) => {
    if(event.target == document.querySelector(".edit-member") || event.target == document.querySelector(".delete-member")){
        document.querySelector(".edit-member").classList.add("hidden");
        document.querySelector(".delete-member").classList.add("hidden");
    }
}

let member_form = document.querySelector(".create-member-form");
member_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = member_form.children[0].firstElementChild.value;
    const email = member_form.children[1].firstElementChild.value;
    const phone = member_form.children[2].firstElementChild.value;

    const data = {
        'name': name,
        'email': email,
        'phone': phone
    }

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(data => {
        const new_member = data['data'];
        table.innerHTML +=`
            <tr class="member_${new_member.member_id}">
                <td>${new_member.member_id}</td>
                <td>${new_member.name}</td>
                <td>${new_member.email}</td>
                <td>${new_member.phone}</td>
                <td><button data-id=${new_member.member_id} class="edit" onclick="show_member(this.dataset.id)">Edit</button></td>
                <td><button data-id=${new_member.member_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
            </tr>
        `
    });

    member_form.reset();
});