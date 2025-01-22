const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

BigInt.prototype.toJSON = function () { return Number(this) }

/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Recupera uma lista de todos os países
 *     description: Este endpoint retorna todos os países registrados na base de dados.
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
 *                     description: ID único do país.
 *                   name:
 *                     type: string
 *                     description: Nome do país.
 *                   code:
 *                     type: string
 *                     description: Código do país (ISO 3166-1).
 *               example:
 *                 - id: 1
 *                   name: Portugal
 *                   code: PT
 *                 - id: 2
 *                   name: Brasil
 *                   code: BR
 *       500:
 *         description: Erro no servidor ao buscar a lista de países.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao recuperar países"
 */
app.get('/api/countries', async (req, res) => {
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
 *         required: true
 *         description: O continente pelo qual filtrar os países (ex: 'Africa', 'Asia').
 *         schema:
 *           type: string
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
app.get('/api/countries/continent/:continent', async (req, res) => {
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
 *     summary: Recupera uma lista de países filtrados por idioma
 *     description: Este endpoint retorna uma lista de países que falam o idioma fornecido como parâmetro de consulta.
 *     parameters:
 *       - in: query
 *         name: language
 *         required: true
 *         description: O idioma pelo qual filtrar os países (ex: 'Portuguese', 'English').
 *         schema:
 *           type: string
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
 *                   languages:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Lista de idiomas falados no país.
 *               example:
 *                 - id: 1
 *                   name: Portugal
 *                   code: PT
 *                   languages:
 *                     - Portuguese
 *                 - id: 2
 *                   name: Brasil
 *                   code: BR
 *                   languages:
 *                     - Portuguese
 *       400:
 *         description: Idioma não fornecido ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Idioma não fornecido"
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
app.get('/api/countries/language', async (req, res) => {
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
 *     summary: Recupera uma lista de países filtrados pela capital
 *     description: Este endpoint retorna uma lista de países cuja capital corresponde ao valor fornecido como parâmetro de consulta.
 *     parameters:
 *       - in: query
 *         name: capital
 *         required: true
 *         description: O nome da capital para filtrar os países (ex: 'Lisbon', 'Brasília').
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de países com a capital solicitada
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
 *         description: Capital não fornecida ou inválida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Capital não fornecida"
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
app.get('/api/countries/capital', async (req, res) => {
    const capital = req.query.capital;
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
 *     summary: Recupera uma lista de países filtrados pela moeda
 *     description: Este endpoint retorna uma lista de países que utilizam a moeda fornecida como parâmetro de consulta.
 *     parameters:
 *       - in: query
 *         name: currency
 *         required: true
 *         description: O nome da moeda para filtrar os países (ex: 'EUR', 'USD').
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de países com a moeda solicitada
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
 *                   name: Estados Unidos
 *                   code: US
 *                   currency: USD
 *       400:
 *         description: Moeda não fornecida ou inválida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Moeda não fornecida"
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
app.get('/api/countries/currency', async (req, res) => {
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
 *     summary: Recupera uma lista de países filtrados pela população
 *     description: Este endpoint retorna uma lista de países cuja população corresponde ao valor fornecido no parâmetro de URL.
 *     parameters:
 *       - in: path
 *         name: population
 *         required: true
 *         description: O valor da população para filtrar os países (ex: '1000000', '50000000').
 *         schema:
 *           type: integer
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
 *         description: População não fornecida ou inválida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "População não fornecida"
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
app.get('/api/countries/population/:population', async (req, res) => {
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
 *     summary: Recupera informações sobre um país filtrado pelo nome
 *     description: Este endpoint retorna as informações de um país com base no nome fornecido no parâmetro de URL.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         description: O nome do país para buscar as informações (ex: 'Portugal', 'Brasil').
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do país solicitado
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
 *                 population:
 *                   type: integer
 *                   description: População do país.
 *                 capital:
 *                   type: string
 *                   description: Capital do país.
 *               example:
 *                 id: 1
 *                 name: Portugal
 *                 code: PT
 *                 population: 10000000
 *                 capital: Lisboa
 *       404:
 *         description: País não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "País não encontrado"
 *       500:
 *         description: Erro no servidor ao buscar o país.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao recuperar o país"
 */
app.get('/api/population/:country', async (req, res) => {
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
 *     summary: Recupera informações de um país pelo código alpha2
 *     description: Este endpoint retorna as informações de um país baseado no código `alpha2_code` fornecido no parâmetro de URL.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O código alpha2 do país (ex: 'PT' para Portugal, 'BR' para Brasil).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do país solicitado
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
 *                   description: Código ISO 3166-1 alpha-2 do país.
 *                 population:
 *                   type: integer
 *                   description: População do país.
 *                 capital:
 *                   type: string
 *                   description: Capital do país.
 *               example:
 *                 id: 1
 *                 name: Portugal
 *                 code: PT
 *                 population: 10000000
 *                 capital: Lisboa
 *       404:
 *         description: País não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "País não encontrado"
 *       500:
 *         description: Erro no servidor ao buscar o país.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao recuperar o país"
 */
app.get('/api/countries/:id', async (req, res) => {
    const id = req.params.id;
    const country = await prisma.country.findUnique({
        where: {
            alpha2_code: id
        }
    });
    res.json(country);
});


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

