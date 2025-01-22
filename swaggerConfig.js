const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Country API Documentation',
        version: '1.0.0',
        description: 'API documentation for the Country service',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./index.js'], // Path to the API docs in your project
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;