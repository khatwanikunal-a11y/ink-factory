function buildArtistTable(artists, containerId) {
    var container = document.getElementById(containerId);
    if (artists.length === 0) {
        container.innerHTML = '<p>No artists found.</p>';
        return;
    }
    var table = document.createElement('table');
    table.setAttribute('border', '1');
    var thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Avatar</th><th>ID</th><th>Name</th><th>Speciality</th><th>Years Exp</th><th>Actions</th></tr>';
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    artists.forEach(function(artist) {
        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td><img class="avatar-img" src="https://api.dicebear.com/9.x/initials/svg?seed=' + encodeURIComponent(artist.name) + '" alt="' + esc(artist.name) + '"></td>' +
            '<td>' + esc(String(artist.id)) + '</td>' +
            '<td>' + esc(artist.name) + '</td>' +
            '<td>' + esc(artist.speciality) + '</td>' +
            '<td>' + esc(String(artist.years_exp)) + '</td>' +
            '<td class="actions-cell">' +
                '<button data-id="' + esc(String(artist.id)) + '" class="btn btn-secondary btn-small btn-update-artist">Update</button>' +
                '<button data-id="' + esc(String(artist.id)) + '" class="btn btn-danger btn-small btn-delete-artist">Delete</button>' +
            '</td>';
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
    attachArtistTableEvents(container);
}

function attachArtistTableEvents(container) {
    var updateBtns = container.querySelectorAll('.btn-update-artist');
    updateBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = btn.getAttribute('data-id');
            loadArtistForUpdate(id);
        });
    });
    var deleteBtns = container.querySelectorAll('.btn-delete-artist');
    deleteBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = btn.getAttribute('data-id');
            deleteArtist(id);
        });
    });
}

function loadArtistForUpdate(id) {
