const express = require('express');

const app = express();

const baseDir = `${__dirname}/build`

app.use(express.static(baseDir));

app.get('*', (request, response) => {
    response.sendFile('index.html', { root: baseDir })
});

const port = ;

app.listen(process.env.PORT || 3000);
