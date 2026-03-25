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
    expect(res.status).toBe(404);
});

test('create design with invalid size returns 400', async function () {
    const artistId = await createArtist();
    const res = await request.post('/api/designs').send({
        artist_id: artistId,
        title: 'Test',
        style: 'Japanese',
        size: 'extra-large'
    });
    expect(res.status).toBe(400);
});

test('get all designs returns list', async function () {
    const artistId = await createArtist();
    await request.post('/api/designs').send({ artist_id: artistId, title: 'Flower', style: 'Neo-Trad', size: 'medium' });
    const res = await request.get('/api/designs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
});

test('get designs by artist ID returns filtered list', async function () {
    const artistId = await createArtist();
    await request.post('/api/designs').send({ artist_id: artistId, title: 'Snake', style: 'Traditional', size: 'small' });
    const res = await request.get('/api/artists/' + artistId + '/designs');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Snake');
});

test('update design with valid data returns 200', async function () {
    const artistId = await createArtist();
    const postRes = await request.post('/api/designs').send({ artist_id: artistId, title: 'Old Title', style: 'Blackwork', size: 'large' });
    const designId = postRes.body.id;
    const res = await request.put('/api/designs/' + designId).send({ title: 'New Title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New Title');
});

test('delete design returns 200', async function () {
    const artistId = await createArtist();
    const postRes = await request.post('/api/designs').send({ artist_id: artistId, title: 'To Remove', style: 'Geometric', size: 'medium' });
    const designId = postRes.body.id;
    const res = await request.delete('/api/designs/' + designId);
    expect(res.status).toBe(200);
});

test('search designs by title returns matching results', async function () {
    const artistId = await createArtist();
    await request.post('/api/designs').send({ artist_id: artistId, title: 'Phoenix Rising', style: 'Japanese', size: 'large' });
    await request.post('/api/designs').send({ artist_id: artistId, title: 'Simple Dot', style: 'Dotwork', size: 'small' });
    const res = await request.get('/api/designs/search?q=Phoenix');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Phoenix Rising');
});
