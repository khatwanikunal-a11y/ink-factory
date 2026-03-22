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

