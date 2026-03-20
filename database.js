const fs = require('fs');

function createDb(filepath) {
    let store = { artists: [], designs: [], nextArtistId: 1, nextDesignId: 1 };

    if (filepath !== ':memory:' && fs.existsSync(filepath)) {
        store = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    function persist() {
        if (filepath !== ':memory:') {
            fs.writeFileSync(filepath, JSON.stringify(store));
        }
    }

    return {
        getAllArtists() {
            return store.artists.slice().sort(function (a, b) { return a.id - b.id; });
        },
        getArtist(id) {
            return store.artists.find(function (a) { return a.id === Number(id); }) || null;
        },
        searchArtists(q) {
            var lower = q.toLowerCase();
            return store.artists.filter(function (a) {
                return a.name.toLowerCase().includes(lower) || a.speciality.toLowerCase().includes(lower);
            }).sort(function (a, b) { return a.id - b.id; });
        },
        insertArtist(fields) {
            var record = Object.assign({ id: store.nextArtistId++ }, fields);
            store.artists.push(record);
            persist();
            return record;
        },
        updateArtist(id, fields) {
            var idx = store.artists.findIndex(function (a) { return a.id === Number(id); });
            if (idx < 0) return null;
            store.artists[idx] = Object.assign({}, store.artists[idx], fields);
            persist();
            return store.artists[idx];
        },
        deleteArtist(id) {
            var idx = store.artists.findIndex(function (a) { return a.id === Number(id); });
            if (idx < 0) return false;
            store.artists.splice(idx, 1);
            store.designs = store.designs.filter(function (d) { return d.artist_id !== Number(id); });
            persist();
            return true;
        },
        getAllDesigns() {
            return store.designs.slice().sort(function (a, b) { return a.id - b.id; });
        },
        getDesign(id) {
            return store.designs.find(function (d) { return d.id === Number(id); }) || null;
        },
        getDesignsByArtist(artistId) {
            return store.designs.filter(function (d) { return d.artist_id === Number(artistId); })
                .sort(function (a, b) { return a.id - b.id; });
        },
        searchDesigns(q) {
            var lower = q.toLowerCase();
            return store.designs.filter(function (d) {
                return d.title.toLowerCase().includes(lower) || d.style.toLowerCase().includes(lower);
            }).sort(function (a, b) { return a.id - b.id; });
        },
        insertDesign(fields) {
            var record = Object.assign({ id: store.nextDesignId++ }, fields);
            store.designs.push(record);
            persist();
            return record;
