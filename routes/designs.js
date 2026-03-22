const express = require('express');

var VALID_SIZES = ['small', 'medium', 'large'];

function validateDesign(data, partial) {
    var errors = [];

    if (!partial || 'artist_id' in data) {
        var artist_id = data.artist_id;
        if (artist_id === undefined || artist_id === null) {
            if (!partial) errors.push('artist_id is required');
        } else if (!Number.isInteger(Number(artist_id))) {
            errors.push('artist_id must be an integer');
        }
    }

    if (!partial || 'title' in data) {
        var title = data.title != null ? String(data.title) : '';
        if (!title.trim()) {
            errors.push('title is required');
        } else if (title.trim().length > 150) {
            errors.push('title must be 150 characters or fewer');
        }
    }

    if (!partial || 'style' in data) {
        var style = data.style != null ? String(data.style) : '';
        if (!style.trim()) {
            errors.push('style is required');
        } else if (style.trim().length > 100) {
            errors.push('style must be 100 characters or fewer');
        }
    }

    if (!partial || 'size' in data) {
        var size = data.size != null ? String(data.size) : '';
        if (!size) {
            if (!partial) errors.push('size is required');
        } else if (!VALID_SIZES.includes(size)) {
            errors.push('size must be one of: small, medium, large');
        }
    }

    if ('description' in data && data.description != null) {
        if (String(data.description).length > 500) {
            errors.push('description must be 500 characters or fewer');
        }
    }

    return errors;
}

function createDesignRoutes(db) {
    var router = express.Router();

    router.get('/designs', function (req, res) {
        res.status(200).json(db.getAllDesigns());
    });

    router.get('/designs/search', function (req, res) {
        var q = (req.query.q || '').trim();
        if (!q) {
            return res.status(400).json({ error: 'query parameter q is required' });
        }
        res.status(200).json(db.searchDesigns(q));
    });

    router.get('/designs/:id', function (req, res) {
        var row = db.getDesign(req.params.id);
        if (!row) return res.status(404).json({ error: 'Design not found' });
        res.status(200).json(row);
    });

    router.get('/artists/:id/designs', function (req, res) {
        var artist = db.getArtist(req.params.id);
        if (!artist) return res.status(404).json({ error: 'Artist not found' });
        res.status(200).json(db.getDesignsByArtist(req.params.id));
    });

    router.post('/designs', function (req, res) {
        var data = req.body;
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Request body must be JSON' });
        }
        var errors = validateDesign(data, false);
        if (errors.length > 0) return res.status(400).json({ error: errors[0] });
        var artist = db.getArtist(Number(data.artist_id));
        if (!artist) return res.status(404).json({ error: 'Artist not found' });
        var now = new Date().toISOString();
        var record = db.insertDesign({
            artist_id: Number(data.artist_id),
            title: String(data.title).trim(),
            style: String(data.style).trim(),
            description: data.description || null,
            size: String(data.size),
            created_at: now,
            updated_at: now
        });
        res.status(201).json(record);
    });

    router.put('/designs/:id', function (req, res) {
        var data = req.body;
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Request body must be JSON' });
        }
        var existing = db.getDesign(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Design not found' });
        var errors = validateDesign(data, true);
        if (errors.length > 0) return res.status(400).json({ error: errors[0] });
        var updated = db.updateDesign(req.params.id, {
            title: String(data.title !== undefined ? data.title : existing.title).trim(),
            style: String(data.style !== undefined ? data.style : existing.style).trim(),
            description: data.description !== undefined ? data.description : existing.description,
            size: String(data.size !== undefined ? data.size : existing.size),
            updated_at: new Date().toISOString()
        });
        res.status(200).json(updated);
    });

    router.delete('/designs/:id', function (req, res) {
        var existing = db.getDesign(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Design not found' });
        db.deleteDesign(req.params.id);
        res.status(200).json({ message: 'Design deleted successfully' });
    });

    return router;
}

module.exports = createDesignRoutes;
