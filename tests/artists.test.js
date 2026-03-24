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

test('create artist with valid data returns 201', async function () {
    const res = await request.post('/api/artists').send({
        name: 'Sam Lee',
        speciality: 'Traditional',
        years_exp: 5,
        bio: 'Expert in bold lines'
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.name).toBe('Sam Lee');
});

test('create artist with missing name returns 400', async function () {
    const res = await request.post('/api/artists').send({
        speciality: 'Realism',
        years_exp: 3
    });
    expect(res.status).toBe(400);
});

test('create artist with negative years_exp returns 400', async function () {
    const res = await request.post('/api/artists').send({
        name: 'Test User',
        speciality: 'Realism',
        years_exp: -1
    });
    expect(res.status).toBe(400);
});

test('get all artists returns list', async function () {
    await request.post('/api/artists').send({ name: 'Amy', speciality: 'Neo-Trad', years_exp: 2 });
    const res = await request.get('/api/artists');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
});

test('get single artist by valid ID returns 200', async function () {
    const postRes = await request.post('/api/artists').send({ name: 'Jake', speciality: 'Watercolour', years_exp: 7 });
    const artistId = postRes.body.id;
    const res = await request.get('/api/artists/' + artistId);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Jake');
});

test('get artist by non-existent ID returns 404', async function () {
    const res = await request.get('/api/artists/9999');
    expect(res.status).toBe(404);
});

test('update artist with valid data returns 200', async function () {
    const postRes = await request.post('/api/artists').send({ name: 'Old Name', speciality: 'Blackwork', years_exp: 1 });
    const artistId = postRes.body.id;
    const res = await request.put('/api/artists/' + artistId).send({ name: 'New Name' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New Name');
});

test('update artist that does not exist returns 404', async function () {
    const res = await request.put('/api/artists/9999').send({ name: 'Nobody' });
    expect(res.status).toBe(404);
});

test('delete artist returns 200', async function () {
    const postRes = await request.post('/api/artists').send({ name: 'To Delete', speciality: 'Japanese', years_exp: 4 });
    const artistId = postRes.body.id;
    const res = await request.delete('/api/artists/' + artistId);
    expect(res.status).toBe(200);
});

test('delete artist that does not exist returns 404', async function () {
    const res = await request.delete('/api/artists/9999');
    expect(res.status).toBe(404);
});
