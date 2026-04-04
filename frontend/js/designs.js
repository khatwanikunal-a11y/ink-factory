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
        var design = res.data;
        document.getElementById('update-design-id').value = design.id;
        document.getElementById('update-title').value = design.title;
        document.getElementById('update-style').value = design.style;
        document.getElementById('update-size').value = design.size;
        document.getElementById('update-description').value = design.description || '';
        document.getElementById('update-design-info').textContent = 'Editing design ID: ' + design.id;
        document.getElementById('update-design-form').removeAttribute('hidden');
        document.getElementById('update-design-result').textContent = '';
    });
}

function deleteDesign(id) {
    if (!confirm('Delete design ID ' + id + '?')) {
        return;
    }
    apiFetch('/designs/' + id, { method: 'DELETE' }).then(function(res) {
        if (res.status === 200) {
            loadAllDesigns();
        } else {
            alert(res.data.error);
        }
    });
}

function loadAllDesigns() {
    apiFetch('/designs').then(function(res) {
        buildDesignTable(res.data, 'all-designs-container');
    });
}

document.getElementById('btn-add-design').addEventListener('click', function() {
    var artistId = document.getElementById('add-artist-id').value.trim();
    var title = document.getElementById('add-title').value.trim();
    var style = document.getElementById('add-style').value.trim();
    var size = document.getElementById('add-size').value;
    var description = document.getElementById('add-description').value.trim();
    var result = document.getElementById('add-design-result');

    if (!artistId || !title || !style || !size) {
        result.textContent = 'Artist ID, title, style, and size are required.';
        result.className = 'result-msg error';
        return;
    }

    apiFetch('/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist_id: parseInt(artistId), title: title, style: style, size: size, description: description || null })
    }).then(function(res) {
        if (res.status === 201) {
            result.textContent = 'Design added with ID ' + res.data.id + '.';
            result.className = 'result-msg';
            document.getElementById('add-artist-id').value = '';
            document.getElementById('add-title').value = '';
            document.getElementById('add-style').value = '';
            document.getElementById('add-size').value = '';
            document.getElementById('add-description').value = '';
        } else {
            result.textContent = 'Error: ' + res.data.error;
            result.className = 'result-msg error';
        }
    });
});

document.getElementById('btn-load-designs').addEventListener('click', function() {
    loadAllDesigns();
});

document.getElementById('btn-load-portfolio').addEventListener('click', function() {
    var artistId = document.getElementById('portfolio-artist-id').value.trim();
    if (!artistId) {
        document.getElementById('portfolio-container').innerHTML = '<p>Enter an artist ID.</p>';
        return;
    }
    apiFetch('/artists/' + artistId + '/designs').then(function(res) {
        if (res.status !== 200) {
            document.getElementById('portfolio-container').innerHTML = '<p>' + res.data.error + '</p>';
            return;
        }
        buildDesignTable(res.data, 'portfolio-container');
    });
});

document.getElementById('btn-search-designs').addEventListener('click', function() {
    var q = document.getElementById('search-design-input').value.trim();
    if (!q) {
        document.getElementById('search-designs-container').innerHTML = '<p>Enter a search term.</p>';
        return;
    }
    apiFetch('/designs/search?q=' + encodeURIComponent(q)).then(function(res) {
        buildDesignTable(res.data, 'search-designs-container');
    });
});

document.getElementById('btn-save-design').addEventListener('click', function() {
    var id = document.getElementById('update-design-id').value;
    var title = document.getElementById('update-title').value.trim();
    var style = document.getElementById('update-style').value.trim();
    var size = document.getElementById('update-size').value;
    var description = document.getElementById('update-description').value.trim();
    var result = document.getElementById('update-design-result');

    if (!title || !style || !size) {
        result.textContent = 'Title, style, and size are required.';
        result.className = 'result-msg error';
        return;
    }

    apiFetch('/designs/' + id, {
