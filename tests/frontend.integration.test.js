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
    });
    var artist = await artistRes.json();

    var designRes = await fetch(baseUrl + '/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            artist_id: artist.id,
            title: 'Koi Fish Sleeve',
            style: 'Japanese',
            size: 'large',
            description: 'Full arm koi fish design'
        })
    });
    expect(designRes.status).toBe(201);
    var design = await designRes.json();

    var portfolioRes = await fetch(baseUrl + '/api/artists/' + artist.id + '/designs');
    expect(portfolioRes.status).toBe(200);
    var portfolio = await portfolioRes.json();
    expect(portfolio.length).toBe(1);
    expect(portfolio[0].title).toBe('Koi Fish Sleeve');

    var updateRes = await fetch(baseUrl + '/api/designs/' + design.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Koi Fish Full Sleeve' })
    });
    expect(updateRes.status).toBe(200);
    var updated = await updateRes.json();
    expect(updated.title).toBe('Koi Fish Full Sleeve');

    var deleteRes = await fetch(baseUrl + '/api/designs/' + design.id, { method: 'DELETE' });
    expect(deleteRes.status).toBe(200);

    var checkRes = await fetch(baseUrl + '/api/designs/' + design.id);
    expect(checkRes.status).toBe(404);
});

test('frontend fetch gets price estimate for a design', async function () {
    var artistRes = await fetch(baseUrl + '/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Pricing Artist', speciality: 'Realism', years_exp: 12 })
    });
    var artist = await artistRes.json();

    var designRes = await fetch(baseUrl + '/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist_id: artist.id, title: 'Portrait', style: 'Realism', size: 'large' })
    });
    var design = await designRes.json();

    var priceRes = await fetch(baseUrl + '/api/pricing/estimate?design_id=' + design.id + '&currency=EUR');
    expect(priceRes.status).toBe(200);
    var price = await priceRes.json();
    expect(price.design_id).toBe(design.id);
    expect(price.currency).toBe('EUR');
    expect(price.price).toBeGreaterThan(0);
    expect(price.size).toBe('large');
    expect(price.style).toBe('Realism');
});
