const express = require('express');

const app = express();

app.get('/', (req, resp) => {
    resp.json({
        message: 'Hello World'
    });
});

app.listen(3333);