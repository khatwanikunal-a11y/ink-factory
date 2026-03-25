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

async function createArtist() {
    const res = await request.post('/api/artists').send({
        name: 'Test Artist',
        speciality: 'Realism',
        years_exp: 3
    });
    return res.body.id;
}

test('create design with valid artist_id returns 201', async function () {
    const artistId = await createArtist();
    const res = await request.post('/api/designs').send({
        artist_id: artistId,
        title: 'Wolf Design',
        style: 'Realism',
        size: 'large',
        description: 'Detailed wolf piece'
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Wolf Design');
});

test('create design with non-existent artist_id returns 404', async function () {
    const res = await request.post('/api/designs').send({
        artist_id: 9999,
        title: 'Test',
        style: 'Japanese',
        size: 'small'
    });
