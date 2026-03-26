var http = require('http');
var { createDb } = require('../database');
var { createApp } = require('../app');

var server, baseUrl, db;

beforeAll(function (done) {
    db = createDb(':memory:');
    var app = createApp(db);
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', function () {
        var port = server.address().port;
        baseUrl = 'http://127.0.0.1:' + port;
        done();
    });
});

afterAll(function (done) {
    db.close();
    server.close(done);
});

test('frontend fetch creates artist and reads it back', async function () {
    var createRes = await fetch(baseUrl + '/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Frontend Test Artist',
            speciality: 'Realism',
            years_exp: 5,
            bio: 'Created via frontend-style fetch'
        })
    });
    expect(createRes.status).toBe(201);
    var created = await createRes.json();
    expect(created.id).toBeTruthy();
    expect(created.name).toBe('Frontend Test Artist');

    var getRes = await fetch(baseUrl + '/api/artists/' + created.id);
    expect(getRes.status).toBe(200);
    var fetched = await getRes.json();
    expect(fetched.name).toBe('Frontend Test Artist');
    expect(fetched.speciality).toBe('Realism');
});

test('frontend fetch creates design under artist and loads portfolio', async function () {
    var artistRes = await fetch(baseUrl + '/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Portfolio Artist', speciality: 'Japanese', years_exp: 10 })
