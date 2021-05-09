const URL = "https://water-co.herokuapp.com/routes";

let table = document.querySelector(".routes-table");

window.onload = () => {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        if (response.ok){
            response.json()
            .then(data => {
                console.log(data);
                const routes = data['data'];
                routes.forEach(element => {
                    table.innerHTML += `
                        <tr class="route_${element.route_id}">
                            <td>${element.route_id}</td>
                            <td>${element.name}</td>
                            <td>${element.active}</td>
                            <td><button data-id=${element.route_id} class="edit" onclick="show_route(this.dataset.id)">Edit</button></td>
                            <td><button data-id=${element.route_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                        </tr>
                    `       
                });
            })
        }
        else{
            console.log(response);
        }
    });
}

function show_route(id){
    fetch(URL + `/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json())
    .then(data => {
        const form = document.querySelector(".edit-route-form");
        form.dataset.id = data['data'].route_id;
        form.children[0].firstElementChild.value = data['data'].name;
        form.children[1].firstElementChild.value = data['data'].active;
        document.querySelector(".edit-route").classList.remove("hidden");
    });
}

function edit_route(){
    const form = document.querySelector(".edit-route-form");
    const data = {
        'name': form.children[0].firstElementChild.value,
        'active': form.children[1].firstElementChild.value,
    }

    console.log(data, form.dataset.id);

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
                const entry = document.querySelector(`.route_${form.dataset.id}`);
                document.querySelector(".edit-route").classList.add("hidden");
                entry.innerHTML = `
                    <td>${data['data'].route_id}</td>
                    <td>${data['data'].name}</td>
                    <td>${data['data'].active}</td>
                    <td><button data-id=${data['data'].route_id} class="edit" onclick="show_route(this.dataset.id)">Edit</button></td>
                    <td><button data-id=${data['data'].route_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                `
            });
        }
    })

    return false;
}

function show_delete_box(id){
    document.querySelector(".delete-route").dataset.id = id;
    document.querySelector(".delete-route").classList.remove("hidden");
}

function delete_route(){
    const id = document.querySelector(".delete-route").dataset.id;
    fetch(URL + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if(response.ok){
            const tab = document.querySelector(`.route_${id}`);
            tab.classList.add("hidden");
            tab.remove();
            document.querySelector(".delete-route").classList.add("hidden");
        }
    })

    return false;
}

window.onclick = (event) => {
    if(event.target == document.querySelector(".edit-route") || event.target == document.querySelector(".delete-route")){
        document.querySelector(".edit-route").classList.add("hidden");
        document.querySelector(".delete-route").classList.add("hidden");
    }
}

let route_form = document.querySelector(".create-route-form");
route_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = route_form.children[0].firstElementChild.value;
    const active = route_form.children[1].firstElementChild.value;

    const data = {
        'name': name,
        'active': active
    }

    console.log(data);

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(data => {
        const new_route = data['data'];
        table.innerHTML +=`
            <tr class="route_${new_route.route_id}">
                <td>${new_route.route_id}</td>
                <td>${new_route.name}</td>
                <td>${new_route.active}</td>
                <td><button data-id=${new_route.route_id} class="edit" onclick="show_route(this.dataset.id)">Edit</button></td>
                <td><button data-id=${new_route.route_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
            </tr>
        `
    });

    route_form.reset();
});