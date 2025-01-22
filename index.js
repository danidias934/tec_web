const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const jwt = require('jsonwebtoken');

// const cors = require('cors');
// const dotenv = require('dotenv');
// dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    res.json({ message: 'Login successful', token: jwt.sign({ username }, 'secret', { expiresIn: '1h' }) });
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.create({ data: { username, password } });
    res.json({ message: 'User created', user });
});


async function needToBeAutenticated(req, res, next) {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ message: 'Token is required' });
        }

        try {
            jwt.verify(token.split(' ')[1], secret);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const secret = 'secret';

BigInt.prototype.toJSON = function () { return Number(this) }


/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Recupera uma lista de todos os países
 *     description: Este endpoint retorna uma lista de todos os países registrados.
 *     responses:
 *       200:
 *         description: Lista de países
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único do país
 *                   name:
 *                     type: string
 *                     description: Nome do país
 *                   code:
 *                     type: string
 *                     description: Código do país (ISO 3166-1)
 *                   continent:
 *                     type: string
 *                     description: Continente ao qual o país pertence
 *               example:
 *                 - id: 1
 *                   name: Portugal
 *                   code: PT
 *                   continent: Europe
 *                 - id: 2
 *                   name: Brasil
 *                   code: BR
 *                   continent: South America
 *       401:
 *         description: Não autorizado. Token não fornecido ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       500:
 *         description: Erro no servidor ao buscar os países.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */
app.get('/api/countries', needToBeAutenticated, async (req, res) => {
    const countries = await prisma.country.findMany();
    console.log(countries);

    res.json(countries);
});

/**
 * @swagger
 * /api/countries/continent/{continent}:
 *   get:
 *     summary: Recupera uma lista de países por continente
 *     description: Este endpoint retorna uma lista de países que pertencem ao continente fornecido.
 *     parameters:
 *       - in: path
 *         name: continent
 *         schema:
 *           type: string
 *         required: true
 *         description: O continente pelo qual filtrar os países.
 *     responses:
 *       200:
 *         description: Lista de países do continente solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único do país.
 *                   name:
 *                     type: string
 *                     description: Nome do país.
 *                   code:
 *                     type: string
 *                     description: Código do país (ISO 3166-1).
 *                   continent:
 *                     type: string
 *                     description: Continente ao qual o país pertence.
 *               example:
 *                 - id: 1
 *                   name: Portugal
 *                   code: PT
 *                   continent: Europe
 *                 - id: 2
 *                   name: Brasil
 *                   code: BR
 *                   continent: South America
 *       400:
 *         description: Continente inválido ou não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Continente inválido"
 *       401:
 *         description: Não autorizado. Token não fornecido ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       500:
 *         description: Erro no servidor ao buscar os países.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao recuperar países"
 */
app.get('/api/countries/continent/:continent', needToBeAutenticated, async (req, res) => {
    const continent = req.params.continent;
    const countries = await prisma.country.findMany({
        where: {
            continente: continent
        }
    });
    res.json(countries);
});

/**
 * @swagger
 * /api/countries/language:
 *   get:
 *     summary: Recupera uma lista de países por idioma
 *     description: Este endpoint retorna uma lista de países que falam o idioma fornecido.
 *     parameters:
 *       - in: query
 *         name: language
 *         required: true
 *         schema:
 *           type: string
 *         description: O idioma pelo qual filtrar os países.
 *     responses:
 *       200:
 *         description: Lista de países que falam o idioma solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único do país.
 *                   name:
 *                     type: string
 *                     description: Nome do país.
 *                   code:
 *                     type: string
 *                     description: Código do país (ISO 3166-1).
 *                   language:
 *                     type: string
 *                     description: Idioma falado pelo país.
 *               example:
 *                 - id: 1
 *                   name: Portugal
 *                   code: PT
 *                   language: Portuguese
 *                 - id: 2
 *                   name: Brasil
 *                   code: BR
 *                   language: Portuguese
 *       400:
 *         description: Idioma inválido ou não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Idioma inválido"
 *       401:
 *         description: Não autorizado. Token não fornecido ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       500:
 *         description: Erro no servidor ao buscar os países.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao recuperar países"
 */
app.get('/api/countries/language', needToBeAutenticated, async (req, res) => {
    const language = req.query.language;
    const countries = await prisma.country.findMany({
        where: {
            linguas: language
        }
    });
    res.json(countries);
});

/**
 * @swagger
 * /api/countries/capital:
 *   get:
 *     summary: Recupera uma lista de países por capital
 *     description: Este endpoint retorna uma lista de países com base na capital fornecida.
 *     parameters:
 *       - in: query
 *         name: capital
 *         required: true
 *         schema:
 *           type: string
 *         description: O nome da capital pelo qual filtrar os países.
 *     responses:
 *       200:
 *         description: Lista de países que têm a capital solicitada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único do país.
 *                   name:
 *                     type: string
 *                     description: Nome do país.
 *                   code:
 *                     type: string
 *                     description: Código do país (ISO 3166-1).
 *                   capital:
 *                     type: string
 *                     description: Capital do país.
 *               example:
 *                 - id: 1
 *                   name: Portugal
 *                   code: PT
 *                   capital: Lisbon
 *                 - id: 2
 *                   name: Brasil
 *                   code: BR
 *                   capital: Brasília
 *       400:
 *         description: Capital inválida ou não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Capital inválida"
 *       401:
 *         description: Não autorizado. Token não fornecido ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       500:
 *         description: Erro no servidor ao buscar os países.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao recuperar países"
 */
app.get('/api/countries/capital', needToBeAutenticated, async (req, res) => {
    const capital = req.query.capital;
    console.log(capital);
    const countries = await prisma.country.findMany({
        where: {
            capital: capital
        }
    });
    res.json(countries);
});

/**
 * @swagger
 * /api/countries/currency:
 *   get:
 *     summary: Recupera uma lista de países por moeda
 *     description: Este endpoint retorna uma lista de países que utilizam a moeda fornecida.
 *     parameters:
 *       - in: query
 *         name: currency
 *         required: true
 *         schema:
 *           type: string
 *         description: O nome da moeda pelo qual filtrar os países.
 *     responses:
 *       200:
 *         description: Lista de países que utilizam a moeda solicitada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único do país.
 *                   name:
 *                     type: string
 *                     description: Nome do país.
 *                   code:
 *                     type: string
 *                     description: Código do país (ISO 3166-1).
 *                   currency:
 *                     type: string
 *                     description: Moeda utilizada pelo país.
 *               example:
 *                 - id: 1
 *                   name: Portugal
 *                   code: PT
 *                   currency: EUR
 *                 - id: 2
 *                   name: Brasil
 *                   code: BR
 *                   currency: BRL
 *       400:
 *         description: Moeda inválida ou não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Moeda inválida"
 *       401:
 *         description: Não autorizado. Token não fornecido ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       500:
 *         description: Erro no servidor ao buscar os países.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao recuperar países"
 */
app.get('/api/countries/currency', needToBeAutenticated, async (req, res) => {
    const currency = req.query.currency;
    const countries = await prisma.country.findMany({
        where: {
            moeda: currency
        }
    });
    res.json(countries);
});

/**
 * @swagger
 * /api/countries/population/{population}:
 *   get:
 *     summary: Recupera uma lista de países por população
 *     description: Este endpoint retorna uma lista de países com a população fornecida.
 *     parameters:
 *       - in: path
 *         name: population
 *         required: true
 *         schema:
 *           type: integer
 *         description: A população pelo qual filtrar os países.
 *     responses:
 *       200:
 *         description: Lista de países com a população solicitada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único do país.
 *                   name:
 *                     type: string
 *                     description: Nome do país.
 *                   code:
 *                     type: string
 *                     description: Código do país (ISO 3166-1).
 *                   population:
 *                     type: integer
 *                     description: População do país.
 *               example:
 *                 - id: 1
 *                   name: Portugal
 *                   code: PT
 *                   population: 10000000
 *                 - id: 2
 *                   name: Brasil
 *                   code: BR
 *                   population: 211000000
 *       400:
 *         description: População inválida ou não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "População inválida"
 *       401:
 *         description: Não autorizado. Token não fornecido ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       500:
 *         description: Erro no servidor ao buscar os países.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao recuperar países"
 */
app.get('/api/countries/population/:population', needToBeAutenticated, async (req, res) => {
    const population = req.params.population;
    const countries = await prisma.country.findMany({
        where: {
            populacao: population
        }
    });
    res.json(countries);    
});

/**
 * @swagger
 * /api/population/{country}:
 *   get:
 *     summary: Recupera informações sobre um país baseado no nome
 *     description: Este endpoint retorna as informações de um país com base no nome fornecido.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: O nome do país para buscar as informações.
 *     responses:
 *       200:
 *         description: Informações do país solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID único do país.
 *                 name:
 *                   type: string
 *                   description: Nome do país.
 *                 code:
 *                   type: string
 *                   description: Código do país (ISO 3166-1).
 *                 capital:
 *                   type: string
 *                   description: Nome da capital do país.
 *                 population:
 *                   type: integer
 *                   description: População do país.
 *                 continent:
 *                   type: string
 *                   description: Continente ao qual o país pertence.
 *               example:
 *                 id: 1
 *                 name: Portugal
 *                 code: PT
 *                 capital: Lisbon
 *                 population: 10000000
 *                 continent: Europe
 *       400:
 *         description: País não encontrado ou nome inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "País não encontrado"
 *       401:
 *         description: Não autorizado. Token não fornecido ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       500:
 *         description: Erro no servidor ao buscar o país.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao recuperar país"
 */
app.get('/api/population/:country', needToBeAutenticated, async (req, res) => {
    let country = req.params.country;
    country = await prisma.country.findUnique({
        where: {
            nome: country
        }
    });
    res.json(country);
});

/**
 * @swagger
 * /api/countries/{id}:
 *   get:
 *     summary: Recupera informações de um país com base no código alpha2
 *     description: Este endpoint retorna as informações de um país com base no código alpha2 fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O código alpha2 do país.
 *     responses:
 *       200:
 *         description: Informações do país solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID único do país.
 *                 name:
 *                   type: string
 *                   description: Nome do país.
 *                 code:
 *                   type: string
 *                   description: Código do país (ISO 3166-1).
 *                 capital:
 *                   type: string
 *                   description: Nome da capital do país.
 *                 population:
 *                   type: integer
 *                   description: População do país.
 *                 continent:
 *                   type: string
 *                   description: Continente ao qual o país pertence.
 *               example:
 *                 id: 1
 *                 name: Portugal
 *                 code: PT
 *                 capital: Lisbon
 *                 population: 10000000
 *                 continent: Europe
 *       400:
 *         description: País não encontrado ou código inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "País não encontrado"
 *       401:
 *         description: Não autorizado. Token não fornecido ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required"
 *       500:
 *         description: Erro no servidor ao buscar o país.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao recuperar país"
 */
app.get('/api/countries/:id', needToBeAutenticated, async (req, res) => {
    const id = req.params.id;
    const country = await prisma.country.findUnique({
        where: {
            alpha2_code: id
        }
    });
    res.json(country);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));