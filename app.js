const express = require('express');
const cors = require('cors');
const path = require('path');
const createArtistRoutes = require('./routes/artists');
const createDesignRoutes = require('./routes/designs');
const createPricingRoutes = require('./routes/pricing');

function createApp(db) {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'frontend')));
    app.use('/api', createArtistRoutes(db));
    app.use('/api', createDesignRoutes(db));
    app.use('/api', createPricingRoutes(db));
    return app;
}

module.exports = { createApp };
