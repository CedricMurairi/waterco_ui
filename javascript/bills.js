const PREMISE_URL = "https://water-co.herokuapp.com/premises";
const BILL_URL = "https://water-co.herokuapp.com/bills";

let table = document.querySelector(".bills-table");
let premise = document.querySelector("#premise");
let premise_filter = document.querySelector("#premise-filter")
let premise_consumption = 0;

window.onload = () => {
    fetch(BILL_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                const premises = data['data'];
                premises.forEach(element => {
                    table.innerHTML += `
                        <tr class="bill_${element.bill_id}">
                            <td>${element.bill_id}</td>
                            <td>${element.premise_id}</td>
                            <td>${element.amount} Rwf</td>
                            <td>${element.due_date}</td>
                            <td>${element.paid}</td>
                            <td><button data-id=${element.bill_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                        </tr>
                    `       
                });
            })
        }
        else{
            console.log(response);
        }
    });

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
                const members = data['data'];
                members.forEach(element => {
                    if(element.consumption > 0){
                        premise.innerHTML += `
                            <option data-consumption=${element.consumption} value=${element.premise_id}>${element.name}</option>
                        `;
                    }
                    premise_filter.innerHTML +=`
                        <option data-consumption=${element.consumption} value=${element.premise_id}>${element.name}</option>
                    `   
                });
            })
        }
    });
}

function show_delete_box(id){
    document.querySelector(".delete-bill").dataset.id = id;
    document.querySelector(".delete-bill").classList.remove("hidden");
}

function delete_bill(){
    const id = document.querySelector(".delete-bill").dataset.id;
    console.log(id);
    fetch(BILL_URL + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if(response.ok){
            const tab = document.querySelector(`.bill_${id}`);
            tab.classList.add("hidden");
            tab.remove();
            document.querySelector(".delete-bill").classList.add("hidden");
        }
    })

    return false;
}

window.onclick = (event) => {
    if(event.target == document.querySelector(".delete-bill")){
        document.querySelector(".delete-bill").classList.add("hidden");  
    }
}

premise_filter.onchange = (event) => {
    let id = event.target.value;
    console.log(id);

    fetch(BILL_URL + `/premise/${id}`, {
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
                        <th>Bill ID</th>
                        <th>Premise ID</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Paid</th>
                        <th></th>
                    </tr>
                `;
                premises.forEach(element => {
                    table.innerHTML += `
                        <tr class="bill_${element.bill_id}">
                            <td>${element.bill_id}</td>
                            <td>${element.premise_id}</td>
                            <td>${element.amount} Rwf</td>
                            <td>${element.due_date}</td>
                            <td>${element.paid}</td>
                            <td><button data-id=${element.bill_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                        </tr>
                    `       
                });
            })
        }
        else{
            console.log(response);
        }
    })
};

premise.onchange = function(event){
    premise_consumption = event.target.options[event.target.selectedIndex].dataset.consumption;
}

let premise_form = document.querySelector(".create-bill-form");
premise_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const premise_id = premise_form.children[0].firstElementChild.value;
    const due_date = premise_form.children[1].firstElementChild.value;
    const amount = premise_consumption * 50;
    const paid = false;

    const data = {
        'premise_id': premise_id,
        'amount': amount,
        'due_date': due_date,
        'paid': paid
    }

    console.log(data);

    fetch(BILL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        const new_bill = data['data'];
        table.innerHTML +=`
            <tr class="bill_${new_bill.bill_id}">
                <td>${new_bill.bill_id}</td>
                <td>${new_bill.premise_id}</td>
                <td>${new_bill.amount} Rwf</td>
                <td>${new_bill.due_date}</td>
                <td>${new_bill.paid}</td>
                <td><button data-id=${new_bill.bill_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
            </tr>
        `
    });

    premise_form.reset();
});