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
