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
    apiFetch('/artists/' + id).then(function(res) {
        if (res.status !== 200) {
            alert(res.data.error);
            return;
        }
        var artist = res.data;
        document.getElementById('update-artist-id').value = artist.id;
        document.getElementById('update-name').value = artist.name;
        document.getElementById('update-speciality').value = artist.speciality;
        document.getElementById('update-years-exp').value = artist.years_exp;
        document.getElementById('update-bio').value = artist.bio || '';
        document.getElementById('update-artist-info').textContent = 'Editing artist ID: ' + artist.id;
        document.getElementById('update-artist-form').removeAttribute('hidden');
        document.getElementById('update-artist-result').textContent = '';
    });
}

function deleteArtist(id) {
    if (!confirm('Delete artist ID ' + id + ' and all their designs?')) {
        return;
    }
    apiFetch('/artists/' + id, { method: 'DELETE' }).then(function(res) {
        if (res.status === 200) {
            loadAllArtists();
        } else {
            alert(res.data.error);
        }
    });
}

function loadAllArtists() {
    apiFetch('/artists').then(function(res) {
        buildArtistTable(res.data, 'all-artists-container');
    });
}

document.getElementById('btn-add-artist').addEventListener('click', function() {
    var name = document.getElementById('add-name').value.trim();
    var speciality = document.getElementById('add-speciality').value.trim();
    var yearsExp = document.getElementById('add-years-exp').value.trim();
    var bio = document.getElementById('add-bio').value.trim();
    var result = document.getElementById('add-artist-result');

    if (!name || !speciality || yearsExp === '') {
        result.textContent = 'Name, speciality, and years of experience are required.';
        result.className = 'result-msg error';
        return;
    }

    apiFetch('/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, speciality: speciality, years_exp: parseInt(yearsExp), bio: bio || null })
    }).then(function(res) {
        if (res.status === 201) {
