const path = require('path');
const { createDb } = require('./database');
const { createApp } = require('./app');

const db = createDb(path.join(__dirname, 'tattoo.json'));
const app = createApp(db);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    process.stdout.write('Server running on http://127.0.0.1:' + PORT + '\n');
});
