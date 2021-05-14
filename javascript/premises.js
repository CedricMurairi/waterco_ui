const PREMISE_URL = "https://water-co.herokuapp.com/premises";
const MEMBER_URL = "https://water-co.herokuapp.com/members";
const ROUTE_URL = "https://water-co.herokuapp.com/routes";

let table = document.querySelector(".premises-table");
let owners = document.querySelector("#owner");
let route = document.querySelector("#route");
let ed_owners = document.querySelector("#ed-owner");
let ed_route = document.querySelector("#ed-route");
let route_filter = document.querySelector("#route-filter");
let owner_filter = document.querySelector("#owner-filter")

window.onload = () => {
    fetch(PREMISE_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                console.log(data);
                const premises = data['data'];
                premises.forEach(element => {
                    table.innerHTML += `
                        <tr class="premise_${element.premise_id}">
                            <td>${element.premise_id}</td>
                            <td>${element.name}</td>
                            <td>${element.owner}</td>
                            <td>${element.consumption}</td>
                            <td>${element.route_supplying}</td>
                            <td>${element.active}</td>
                            <td><button data-id=${element.premise_id} class="edit" onclick="show_premise(this.dataset.id)">Edit</button></td>
                            <td><button data-id=${element.premise_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                        </tr>
                    `       
                });
            })
        }
        else{
            console.log(response);
        }
    });

    fetch(MEMBER_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                console.log(data);
                const members = data['data'];
                members.forEach(element => {
                    owners.innerHTML += `
                        <option value=${element.member_id}>${element.name}</option>
                    `;
                    owner_filter.innerHTML +=`
                        <option value=${element.member_id}>${element.name}</option>
                    `   
                });
            })
        }
    });

    fetch(ROUTE_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                const routes = data['data'];
                routes.forEach(element => {
                    route.innerHTML += `
                        <option value=${element.route_id}>${element.name}</option>
                    `;
                    route_filter.innerHTML +=`
                        <option value=${element.route_id}>${element.name}</option>
                    `   
                });
            })
        }
    });
}

function show_premise(id){
    fetch(MEMBER_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                console.log(data);
                const members = data['data'];
                members.forEach(element => {
                    ed_owners.innerHTML += `
                        <option value=${element.member_id}>${element.name}</option>
                    `;      
                });
            })
        }
    });

    fetch(ROUTE_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                const routes = data['data'];
                routes.forEach(element => {
                    ed_route.innerHTML += `
                        <option value=${element.route_id}>${element.name}</option>
                    `       
                });
            })
        }
    });

    fetch(PREMISE_URL + `/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json())
    .then(data => {
        const form = document.querySelector(".edit-premise-form");
        form.dataset.id = data['data'].premise_id;
        form.children[0].firstElementChild.value = data['data'].name;
        form.children[1].firstElementChild.value = data['data'].owner;
        form.children[2].firstElementChild.value = data['data'].active;
        form.children[3].firstElementChild.value = data['data'].consumption;
        form.children[4].firstElementChild.value = data['data'].route_supplying;
        document.querySelector(".edit-premise").classList.remove("hidden");
    });
}

function edit_premise(){
    const form = document.querySelector(".edit-premise-form");
    const data = {
        'name': form.children[0].firstElementChild.value,
        'owner': form.children[1].firstElementChild.value,
        'active': form.children[2].firstElementChild.value,
        'consumption': form.children[3].firstElementChild.value,
        'route_supplying': form.children[4].firstElementChild.value,
    }

    console.log(data);

    fetch(PREMISE_URL + `/${form.dataset.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if(response.ok){
            response.json()
            .then(data => {
                const entry = document.querySelector(`.premise_${form.dataset.id}`);
                document.querySelector(".edit-premise").classList.add("hidden");
                entry.innerHTML = `
                    <td>${data['data'].premise_id}</td>
                    <td>${data['data'].name}</td>
                    <td>${data['data'].owner}</td>
                    <td>${data['data'].consumption}</td>
                    <td>${data['data'].route_supplying}</td>
                    <td>${data['data'].active}</td>
                    <td><button data-id=${data['data'].premise_id} class="edit" onclick="show_premise(this.dataset.id)">Edit</button></td>
                    <td><button data-id=${data['data'].premise_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                `
            });
        }
    })

    return false;
}

function show_delete_box(id){
    document.querySelector(".delete-premise").dataset.id = id;
    document.querySelector(".delete-premise").classList.remove("hidden");
}

function delete_premise(){
    const id = document.querySelector(".delete-premise").dataset.id;
    fetch(PREMISE_URL + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if(response.ok){
            const tab = document.querySelector(`.premise_${id}`);
            tab.classList.add("hidden");
            tab.remove();
            document.querySelector(".delete-premise").classList.add("hidden");
        }
    })

    return false;
}

route_filter.onchange = (event) => {
    let id = event.target.value;
    console.log(id);

    fetch(PREMISE_URL + `/route/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                console.log(data);
                const premises = data['data'];
                table.innerHTML = `
                    <tr>
                        <th>Premise ID</th>
                        <th>Premise Name</th>
                        <th>Owner ID</th>
                        <th>Monthly Consumption</th>
                        <th>Route ID</th>
                        <th>Is Active</th>
                        <th></th>
                        <th></th>
                    </tr>
                `;
                premises.forEach(element => {
                    table.innerHTML += `
                        <tr class="premise_${element.premise_id}">
                            <td>${element.premise_id}</td>
                            <td>${element.name}</td>
                            <td>${element.owner}</td>
                            <td>${element.consumption}</td>
                            <td>${element.route_supplying}</td>
                            <td>${element.active}</td>
                            <td><button data-id=${element.premise_id} class="edit" onclick="show_premise(this.dataset.id)">Edit</button></td>
                            <td><button data-id=${element.premise_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                        </tr>
                    `       
                });
            })
        }
        else{
            console.log(response);
            table.innerHTML = `
                <tr>
                    <th>Premise ID</th>
                    <th>Premise Name</th>
                    <th>Owner ID</th>
                    <th>Monthly Consumption</th>
                    <th>Route ID</th>
                    <th>Is Active</th>
                    <th></th>
                    <th></th>
                </tr>
            `;
        }
    })
};

owner_filter.onchange = (event) => {
    let id = event.target.value;
    console.log(id);

    fetch(PREMISE_URL + `/member/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                console.log(data);
                const premises = data['data'];
                table.innerHTML = `
                    <tr>
                        <th>Premise ID</th>
                        <th>Premise Name</th>
                        <th>Owner ID</th>
                        <th>Monthly Consumption</th>
                        <th>Route ID</th>
                        <th>Is Active</th>
                        <th></th>
                        <th></th>
                    </tr>
                `;
                premises.forEach(element => {
                    table.innerHTML += `
                        <tr class="premise_${element.premise_id}">
                            <td>${element.premise_id}</td>
                            <td>${element.name}</td>
                            <td>${element.owner}</td>
                            <td>${element.consumption}</td>
                            <td>${element.route_supplying}</td>
                            <td>${element.active}</td>
                            <td><button data-id=${element.premise_id} class="edit" onclick="show_premise(this.dataset.id)">Edit</button></td>
                            <td><button data-id=${element.premise_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                        </tr>
                    `       
                });
            })
        }
        else{
            console.log(response);
            table.innerHTML = `
                <tr>
                    <th>Premise ID</th>
                    <th>Premise Name</th>
                    <th>Owner ID</th>
                    <th>Monthly Consumption</th>
                    <th>Route ID</th>
                    <th>Is Active</th>
                    <th></th>
                    <th></th>
                </tr>
            `;
        }
    })
};

window.onclick = (event) => {
    if(event.target == document.querySelector(".edit-premise") || event.target == document.querySelector(".delete-premise")){
        document.querySelector(".edit-premise").classList.add("hidden");
        document.querySelector(".delete-premise").classList.add("hidden");
        ed_owners.innerHTML = ``
        ed_route.innerHTML = ``   
    }
}

let premise_form = document.querySelector(".create-premise-form");
premise_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = premise_form.children[0].firstElementChild.value;
    const owner = premise_form.children[1].firstElementChild.value;
    const active = premise_form.children[2].firstElementChild.value;
    const consumption = premise_form.children[3].firstElementChild.value;
    const route = premise_form.children[4].firstElementChild.value;

    const data = {
        'name': name,
        'owner': owner,
        'active': active,
        'consumption': consumption,
        'route_supplying': route
    }

    fetch(PREMISE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        const new_premise = data['data'];
        table.innerHTML +=`
            <tr class="premise_${new_premise.premise_id}">
                <td>${new_premise.premise_id}</td>
                <td>${new_premise.name}</td>
                <td>${new_premise.owner}</td>
                <td>${new_premise.consumption}</td>
                <td>${new_premise.route_supplying}</td>
                <td>${new_premise.active}</td>
                <td><button data-id=${new_premise.premise_id} class="edit" onclick="show_premise(this.dataset.id)">Edit</button></td>
                <td><button data-id=${new_premise.premise_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
            </tr>
        `
    });

    premise_form.reset();
});