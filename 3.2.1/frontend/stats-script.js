function loadStats() {
    fetch('/api/stats')
        .then(res => res.json())
        .then(data => document.getElementById("stats").innerHTML = `Count: ${data.count}<br>Instance: ${data.instance}`);
}

loadStats();