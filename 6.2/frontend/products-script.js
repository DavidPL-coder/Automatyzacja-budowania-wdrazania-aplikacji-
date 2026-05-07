const list = document.getElementById("list");
const form = document.getElementById("form");

function loadItems() {
    fetch('/api/items')
        .then(res => res.json())
        .then(data => {
            list.innerHTML = "";
            data.forEach(i => {
                const li = document.createElement("li");
                li.textContent = `${i.name} - ${i.price}`;
                list.appendChild(li);
            });
        });
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);

    fetch('/api/items', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, price })
    }).then(() => {
        loadItems();
    });
});

loadItems();