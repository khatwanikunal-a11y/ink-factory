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
