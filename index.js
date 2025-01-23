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

app.get('/api/countries', async (req, res) => {
    const countries = await prisma.country.findMany();
    console.log(countries);

    res.json(countries);
});

// /api/countries/continent/:continent
app.get('/api/countries/continent/:continent', async (req, res) => {
    const continent = req.params.continent;
    const countries = await prisma.country.findMany({
        where: {
            continente: continent
        }
    });
    res.json(countries);
});

// /api/countries/language?language=PT
app.get('/api/countries/language', async (req, res) => {
    const language = req.query.language;
    const countries = await prisma.country.findMany({
        where: {
            linguas: language
        }
    });
    res.json(countries);
});

// /api/countries/capital?capital=Brasília
app.get('/api/countries/capital', async (req, res) => {
    const capital = req.query.capital;
    const countries = await prisma.country.findMany({
        where: {
            capital: capital
        }
    });
    res.json(countries);
});


// /api/countries/currency?currency=USD
app.get('/api/countries/currency', async (req, res) => {
    const currency = req.query.currency;
    const countries = await prisma.country.findMany({
        where: {
            moeda: currency
        }
    });
    res.json(countries);
});

// /api/countries/population/:population
app.get('/api/countries/population/:population', async (req, res) => {
    const population = req.params.population;
    const countries = await prisma.country.findMany({
        where: {
            populacao: population
        }
    });
    res.json(countries);    
});


// /api/population/:country
app.get('/api/population/:country', async (req, res) => {
    let country = req.params.country;
    country = await prisma.country.findUnique({
        where: {
            nome: country
        }
    });
    res.json(country);
});

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

