function buildDesignTable(designs, containerId) {
    var container = document.getElementById(containerId);
    if (designs.length === 0) {
        container.innerHTML = '<p>No designs found.</p>';
        return;
    }
    var table = document.createElement('table');
    table.setAttribute('border', '1');
    var thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>ID</th><th>Artist ID</th><th>Title</th><th>Style</th><th>Size</th><th>Actions</th></tr>';
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    designs.forEach(function(design) {
        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + esc(String(design.id)) + '</td>' +
            '<td>' + esc(String(design.artist_id)) + '</td>' +
            '<td>' + esc(design.title) + '</td>' +
            '<td>' + esc(design.style) + '</td>' +
            '<td>' + esc(design.size) + '</td>' +
            '<td class="actions-cell">' +
                '<button data-id="' + esc(String(design.id)) + '" class="btn btn-secondary btn-small btn-update-design">Update</button>' +
                '<button data-id="' + esc(String(design.id)) + '" class="btn btn-danger btn-small btn-delete-design">Delete</button>' +
            '</td>';
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
    attachDesignTableEvents(container);
}

function attachDesignTableEvents(container) {
    var updateBtns = container.querySelectorAll('.btn-update-design');
    updateBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = btn.getAttribute('data-id');
            loadDesignForUpdate(id);
        });
    });
    var deleteBtns = container.querySelectorAll('.btn-delete-design');
    deleteBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = btn.getAttribute('data-id');
            deleteDesign(id);
        });
    });
}

function loadDesignForUpdate(id) {
    apiFetch('/designs/' + id).then(function(res) {
        if (res.status !== 200) {
            alert(res.data.error);
            return;
        }
