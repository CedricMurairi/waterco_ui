const URL = "https://water-co.herokuapp.com/users";

let table = document.querySelector(".users-table");
let form_input = document.querySelector(".form");
let user_details = document.querySelector(".details");
let user_form = document.querySelector(".create-user-form");


function log_out(){
    localStorage.clear();
    window.location.href = window.origin + "/index.html";
}

document.querySelectorAll(".auth-btn").forEach(element => {
    element.addEventListener("click", () => {
        document.querySelector(".reg").classList.toggle("hidden");
        document.querySelector(".log").classList.toggle("hidden");
    });
});

window.onload = () => {
    if (localStorage.getItem('in') != "true"){
        document.querySelector("nav").classList.add('hidden');
        document.querySelector(".log").classList.remove("hidden");
        document.querySelector(".users-table").classList.add("hidden");
        document.querySelector(".form").classList.add("hidden");
        document.querySelector(".details").classList.add("hidden");
        document.querySelector(".create-user-form").classList.add("hidden");
    }else{

        document.querySelector(".log").classList.add("hidden");

        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.ok){
                response.json()
                .then(data => {
                    const users = data['data'];
                    users.forEach(element => {
                        if (element.user_id == localStorage.getItem('user_id') && element.email == localStorage.getItem('email')){
                            table.innerHTML += `
                                <tr class="user_${element.user_id}">
                                    <td>${element.user_id}</td>
                                    <td>${element.name}</td>
                                    <td>${element.email}</td>
                                    <td>Super secret - &#128516</td>
                                    <td><button data-id=${element.user_id} class="edit" onclick="show_user(this.dataset.id)" disabled>Edit</button></td>
                                    <td><button data-id=${element.user_id} class="delete" onclick="show_delete_box(this.dataset.id)" disabled>Delete</button></td>
                                </tr>
                            `       
                        }else{
                            table.innerHTML += `
                                <tr class="user_${element.user_id}">
                                    <td>${element.user_id}</td>
                                    <td>${element.name}</td>
                                    <td>${element.email}</td>
                                    <td>Super secret - &#128516</td>
                                    <td><button data-id=${element.user_id} class="edit" onclick="show_user(this.dataset.id)">Edit</button></td>
                                    <td><button data-id=${element.user_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                                </tr>
                            ` 
                        }      
                    });
                })
            }
            else{
                document.querySelector(".users-details").innerHTML = `
                    <h2>No User record found, create some</h2>
                `
            }
        });

    }
}

function show_user(id){
    fetch(URL + `/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json())
    .then(data => {
        const form = document.querySelector(".edit-user-form");
        form.dataset.id = data['data'].user_id;
        form.children[0].firstElementChild.value = data['data'].name;
        form.children[1].firstElementChild.value = data['data'].email;
        form.children[2].firstElementChild.value = data['data'].password;
        document.querySelector(".edit-user").classList.remove("hidden");
    });
}

function edit_user(){
    const form = document.querySelector(".edit-user-form");
    const data = {
        'name': form.children[0].firstElementChild.value,
        'email': form.children[1].firstElementChild.value,
        'password': form.children[2].firstElementChild.value
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
                const entry = document.querySelector(`.user_${form.dataset.id}`);
                document.querySelector(".edit-user").classList.add("hidden");
                entry.innerHTML = `
                    <td>${data['data'].user_id}</td>
                    <td>${data['data'].name}</td>
                    <td>${data['data'].email}</td>
                    <td>Super secret - &#128516</td>s
                    <td><button data-id=${data['data'].user_id} class="edit" onclick="show_user(this.dataset.id)">Edit</button></td>
                    <td><button data-id=${data['data'].user_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                `
            });
        }else{
            response.json()
            .then(data => {
                form_input.innerHTML +=`<p class="warning">${data['message']}</p>`
            })
        }
    })

    return false;
}

function show_delete_box(id){
    document.querySelector(".delete-user").dataset.id = id;
    document.querySelector(".delete-user").classList.remove("hidden");
}

function delete_user(){
    const id = document.querySelector(".delete-user").dataset.id;
    fetch(URL + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if(response.ok){
            const tab = document.querySelector(`.user_${id}`);
            tab.classList.add("hidden");
            tab.remove();
            document.querySelector(".delete-user").classList.add("hidden");
        }
    })

    return false;
}

let repassword = document.querySelector("#repeat-pass");
let password = document.querySelector("#pass-reg");
let login_btn = document.querySelector("#login")
let register_btn = document.querySelector("#register")
let reg_form = document.querySelector(".reg");
let log_form = document.querySelector(".log");

repassword.addEventListener("keyup", () => {
    if(password.value != repassword.value){
        register_btn.disabled = true
        register_btn.innerHTML = "Password Should Match";
    }else{
        register_btn.disabled = false;
        register_btn.innerHTML = "Register";
    }
});

reg_form.addEventListener('submit', (event) => {
    event.preventDefault();

    data = {
        'name': reg_form.children[0].firstElementChild.value,
        'email': reg_form.children[1].firstElementChild.value, 
        'password': reg_form.children[2].firstElementChild.value 
    }

    fetch(URL + "/signup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                reg_form.classList.toggle("hidden");
                log_form.classList.toggle("hidden");
                log_form.innerHTML += '<p class="info">Registered Successfully - Login now</p>'
            })
        }else{
            response.json()
            .then(data => {
                reg_form.innerHTML += `<p class="warning">${data['message']}</p>`
            });
        }
    })
});

log_form.addEventListener('submit', (event) => {
    event.preventDefault();

    data = {
        'email': log_form.children[0].firstElementChild.value, 
        'password': log_form.children[1].firstElementChild.value 
    }

    fetch(URL + "/signin", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                localStorage.setItem('token', `${data['token']}`);
                localStorage.setItem('in', true);
                localStorage.setItem('user_id', `${data['user'].user_id}`);
                localStorage.setItem('email', `${data['user'].email}`);
                log_form.classList.toggle("hidden");
                window.location.href = window.location.href;
            })
        }else{
            response.json()
            .then(data => {
                log_form.innerHTML += `<p class="warning">${data['message']}</p>`
            });
        }
    })
});

window.onclick = (event) => {
    if(event.target == document.querySelector(".edit-user") || event.target == document.querySelector(".delete-user")){
        document.querySelector(".edit-user").classList.add("hidden");
        document.querySelector(".delete-user").classList.add("hidden");
    }
}

user_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = user_form.children[0].firstElementChild.value;
    const email = user_form.children[1].firstElementChild.value;
    const password = user_form.children[2].firstElementChild.value;

    const data = {
        'name': name,
        'email': email,
        'password': password
    }

    fetch(URL + "/signup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                const new_user = data['data'];
                table.innerHTML +=`
                    <tr class="user_${new_user.user_id}">
                        <td>${new_user.user_id}</td>
                        <td>${new_user.name}</td>
                        <td>${new_user.email}</td>
                        <td>Super secret - &#128516</td>
                        <td><button data-id=${new_user.user_id} class="edit" onclick="show_user(this.dataset.id)">Edit</button></td>
                        <td><button data-id=${new_user.user_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                    </tr>
                `
            });
        }else{
            response.json()
            .then(data => {
                user_form.innerHTML += `<p class="warning">${data['message']}</p>`;
            })
        }
    })

    user_form.reset();
});