var express = require('express');

var BASE_PRICES = { small: 80, medium: 200, large: 450 };
var STYLE_MULTIPLIERS = {
    'realism': 1.5,
    'japanese': 1.4,
    'neo-traditional': 1.3,
    'watercolour': 1.3,
    'geometric': 1.2,
    'blackwork': 1.1,
    'dotwork': 1.2,
    'traditional': 1.0
};
var EXCHANGE_API = 'https://open.er-api.com/v6/latest/EUR';

function getStyleMultiplier(style) {
    var key = style.toLowerCase().trim();
    return STYLE_MULTIPLIERS[key] || 1.0;
}

function calculatePrice(size, style, yearsExp) {
    var base = BASE_PRICES[size] || BASE_PRICES['medium'];
    var styleMultiplier = getStyleMultiplier(style);
    var expBonus = 1 + (Math.min(yearsExp, 30) * 0.02);
    return Math.round(base * styleMultiplier * expBonus * 100) / 100;
}

function createPricingRoutes(db) {
    var router = express.Router();

    router.get('/pricing/estimate', function (req, res) {
        var designId = req.query.design_id;
        var currency = (req.query.currency || 'EUR').toUpperCase().trim();

        if (!designId) {
            return res.status(400).json({ error: 'design_id query parameter is required' });
        }

        var design = db.getDesign(Number(designId));
        if (!design) {
            return res.status(404).json({ error: 'Design not found' });
        }

        var artist = db.getArtist(design.artist_id);
        var yearsExp = artist ? artist.years_exp : 0;
        var priceEur = calculatePrice(design.size, design.style, yearsExp);

        if (currency === 'EUR') {
            return res.status(200).json({
                design_id: design.id,
                size: design.size,
                style: design.style,
                artist_years_exp: yearsExp,
                price: priceEur,
                currency: 'EUR'
            });
        }

        fetch(EXCHANGE_API)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var rate = data.rates && data.rates[currency];
                if (!rate) {
                    return res.status(400).json({ error: 'Unsupported currency: ' + currency });
                }
                var converted = Math.round(priceEur * rate * 100) / 100;
                res.status(200).json({
                    design_id: design.id,
                    size: design.size,
                    style: design.style,
                    artist_years_exp: yearsExp,
                    price_eur: priceEur,
                    price: converted,
                    currency: currency,
                    exchange_rate: rate
                });
            })
            .catch(function () {
                res.status(502).json({ error: 'Could not fetch exchange rates' });
            });
    });

    return router;
}

module.exports = createPricingRoutes;
