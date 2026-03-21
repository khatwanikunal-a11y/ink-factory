const express = require('express');

function validateArtist(data, partial) {
    var errors = [];

    if (!partial || 'name' in data) {
        var name = data.name != null ? String(data.name) : '';
        if (!name.trim()) {
            errors.push('name is required');
        } else if (name.trim().length > 100) {
            errors.push('name must be 100 characters or fewer');
        }
    }

    if (!partial || 'speciality' in data) {
        var speciality = data.speciality != null ? String(data.speciality) : '';
        if (!speciality.trim()) {
            errors.push('speciality is required');
        } else if (speciality.trim().length > 100) {
            errors.push('speciality must be 100 characters or fewer');
        }
    }

    if (!partial || 'years_exp' in data) {
        var ye = data.years_exp;
        if (ye === undefined || ye === null) {
            if (!partial) errors.push('years_exp is required');
        } else {
            var n = Number(ye);
            if (!Number.isInteger(n)) {
                errors.push('years_exp must be an integer');
            } else if (n < 0 || n > 60) {
                errors.push('years_exp must be between 0 and 60');
            }
        }
    }

    if ('bio' in data && data.bio != null) {
        if (String(data.bio).length > 500) {
            errors.push('bio must be 500 characters or fewer');
        }
    }

    return errors;
}

function createArtistRoutes(db) {
    var router = express.Router();

    router.get('/artists', function (req, res) {
        res.status(200).json(db.getAllArtists());
    });

    router.get('/artists/search', function (req, res) {
        var q = (req.query.q || '').trim();
        if (!q) {
            return res.status(400).json({ error: 'query parameter q is required' });
        }
        res.status(200).json(db.searchArtists(q));
    });

    router.get('/artists/:id', function (req, res) {
        var row = db.getArtist(req.params.id);
        if (!row) return res.status(404).json({ error: 'Artist not found' });
        res.status(200).json(row);
    });

    router.post('/artists', function (req, res) {
        var data = req.body;
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Request body must be JSON' });
        }
        var errors = validateArtist(data, false);
        if (errors.length > 0) return res.status(400).json({ error: errors[0] });
        var now = new Date().toISOString();
        var record = db.insertArtist({
            name: String(data.name).trim(),
            speciality: String(data.speciality).trim(),
            bio: data.bio || null,
            years_exp: Number(data.years_exp),
            created_at: now,
            updated_at: now
        });
        res.status(201).json(record);
    });

    router.put('/artists/:id', function (req, res) {
        var data = req.body;
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Request body must be JSON' });
        }
        var existing = db.getArtist(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Artist not found' });
        var errors = validateArtist(data, true);
        if (errors.length > 0) return res.status(400).json({ error: errors[0] });
        var updated = db.updateArtist(req.params.id, {
            name: String(data.name !== undefined ? data.name : existing.name).trim(),
            speciality: String(data.speciality !== undefined ? data.speciality : existing.speciality).trim(),
            bio: data.bio !== undefined ? data.bio : existing.bio,
            years_exp: Number(data.years_exp !== undefined ? data.years_exp : existing.years_exp),
            updated_at: new Date().toISOString()
        });
        res.status(200).json(updated);
    });

    router.delete('/artists/:id', function (req, res) {
        var existing = db.getArtist(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Artist not found' });
        db.deleteArtist(req.params.id);
        res.status(200).json({ message: 'Artist deleted successfully' });
    });

    return router;
}

module.exports = createArtistRoutes;
