const { addBookHandler } = require('./src/handler');

const routes = [
    {
        method: 'POST',
        path: './books',
        handler: addBookHandler,
    },
];

module.exports = routes;