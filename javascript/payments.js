const PREMISE_URL = "https://water-co.herokuapp.com/premises";
const PAYMENT_URL = "https://water-co.herokuapp.com/payments";
const BILL_URL = "https://water-co.herokuapp.com/bills";

let table = document.querySelector(".payments-table");
let bill = document.querySelector("#bill");
let premise_filter = document.querySelector("#premise-filter")
let premise_id_create;

window.onload = () => {
    fetch(PAYMENT_URL, {
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
                        <tr class="payment_${element.payment_id}">
                            <td>${element.payment_id}</td>
                            <td>${element.premise_id}</td>
                            <td>${element.bill_id}</td>
                            <td>${element.amount_paid} Rwf</td>
                            <td>${element.date_paid}</td>
                            <td><button data-id=${element.payment_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
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
                const bills = data['data'];
                bills.forEach(element => {
                    premise_filter.innerHTML += `
                        <option value=${element.premise_id}>${element.name}</option>
                    `;
                });
            })
        }
    });

    fetch(BILL_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok){
            response.json()
            .then(data => {
                const bills = data['data'];
                bills.forEach(element => {
                    if (!element.paid){
                        fetch(PREMISE_URL + `/${element.premise_id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(response => response.json())
                        .then(data => {
                            bill.innerHTML += `
                                <option data-premise=${data['data'].premise_id} value=${element.bill_id}>Due: ${element.amount} Rwf | Premise: ${data['data'].name}</option>
                            `;
                        });
                    }
                });
            })
        }
    });
}

function show_delete_box(id){
    document.querySelector(".delete-payment").dataset.id = id;
    document.querySelector(".delete-payment").classList.remove("hidden");
}

function delete_payment(){
    const id = document.querySelector(".delete-payment").dataset.id;
    fetch(PAYMENT_URL + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if(response.ok){
            const tab = document.querySelector(`.payment_${id}`);
            tab.classList.add("hidden");
            tab.remove();
            document.querySelector(".delete-payment").classList.add("hidden");
        }
    })

    return false;
}

window.onclick = (event) => {
    if(event.target == document.querySelector(".delete-payment")){
        document.querySelector(".delete-payment").classList.add("hidden");  
    }
}

premise_filter.onchange = (event) => {
    let id = event.target.value;

    fetch(PAYMENT_URL + `/${id}`, {
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
                        <th>Payment ID</th>
                        <th>Premise ID</th>
                        <th>Bill ID</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                `;
                premises.forEach(element => {
                    table.innerHTML += `
                        <tr class="payment_${element.payment_id}">
                            <td>${element.payment_id}</td>
                            <td>${element.premise_id}</td>
                            <td>${element.bill_id}</td>
                            <td>${element.amount_paid} Rwf</td>
                            <td>${element.date_paid}</td>
                            <td><button data-id=${element.payment_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
                        </tr>
                    `       
                });
            })
        }
        else{
            console.log(response);
            table.innerHTML = `
                <tr>
                    <th>Payment ID</th>
                    <th>Premise ID</th>
                    <th>Bill ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th></th>
                </tr>
            `;
        }
    })
};

bill.onchange = function(event){
    premise_id_create = event.target.options[event.target.selectedIndex].dataset.premise;
}

let payment_form = document.querySelector(".create-payment-form");
payment_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const bill_id = payment_form.children[0].firstElementChild.value;
    const amount = payment_form.children[2].firstElementChild.value;
    const due_date = payment_form.children[1].firstElementChild.value;

    const data = {
        'premise_id': premise_id_create,
        'bill_id': bill_id,
        'amount_paid': amount,
        'date_paid': due_date
    }

    console.log(data);

    fetch(PAYMENT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        const new_payment = data['data'];
        table.innerHTML +=`
            <tr class="payment_${new_payment.payment_id}">
                <td>${new_payment.payment_id}</td>
                <td>${new_payment.premise_id}</td>
                <td>${new_payment.bill_id}</td>
                <td>${new_payment.amount_paid} Rwf</td>
                <td>${new_payment.date_paid}</td>
                <td><button data-id=${new_payment.payment_id} class="delete" onclick="show_delete_box(this.dataset.id)">Delete</button></td>
            </tr>
        `
    });

    payment_form.reset();
});