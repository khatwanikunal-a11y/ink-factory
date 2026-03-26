const supertest = require('supertest');
const { createDb } = require('../database');
const { createApp } = require('../app');

let db, request;

beforeEach(function () {
    db = createDb(':memory:');
    const app = createApp(db);
    request = supertest(app);
});

afterEach(function () {
    db.close();
});

test('full artist and design workflow', async function () {
    const postArtist = await request.post('/api/artists').send({
        name: 'Integration Artist',
        speciality: 'Neo-Traditional',
        years_exp: 8,
        bio: 'Works with bold colours'
    });
    expect(postArtist.status).toBe(201);
    const artistId = postArtist.body.id;
    expect(artistId).toBeTruthy();

    const postDesign = await request.post('/api/designs').send({
        artist_id: artistId,
        title: 'Dragon Portfolio Piece',
        style: 'Neo-Traditional',
        size: 'large',
        description: 'A full dragon back piece'
    });
    expect(postDesign.status).toBe(201);
    const designId = postDesign.body.id;
    expect(designId).toBeTruthy();

    const portfolioRes = await request.get('/api/artists/' + artistId + '/designs');
    expect(portfolioRes.status).toBe(200);
    expect(portfolioRes.body.length).toBe(1);
    expect(portfolioRes.body[0].title).toBe('Dragon Portfolio Piece');

    const updateRes = await request.put('/api/designs/' + designId).send({ title: 'Dragon Updated' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.title).toBe('Dragon Updated');

    const deleteArtistRes = await request.delete('/api/artists/' + artistId);
    expect(deleteArtistRes.status).toBe(200);

    const getDesignRes = await request.get('/api/designs/' + designId);
    expect(getDesignRes.status).toBe(404);
});
