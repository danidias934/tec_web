const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const cron = require('node-cron');

const prisma = new PrismaClient();

async function main() {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    // console.log("response data: ", response.data);
    console.log("response status: ", response.status);
    // console.log("response data: ", response.data[0]);

    const countries = response.data;

    console.log("countries length: ", countries.length);

    
    for (const country of countries) {
        console.log("country: ", country);

        // languages: { eng: 'English' },
        let languages = []
        // get values from languages
        for (const language in country.languages) {
            languages.push(country.languages[language]);
        }
        console.log("languages: ", languages);

        // currencies: { USD: { name: 'United States Dollar', symbol: '$' } },
        let currencies = []
        // get values from currencies
        // USD: { name: 'United States Dollar', symbol: '$' } - agora vamos pegar só o USD
        for (const currency in country.currencies) {
            currencies.push(currency); // Pegando apenas o código da moeda (ex: USD)
        }
        console.log("currencies: ", currencies);

        await prisma.country.upsert({
            where: {
                alpha2_code: country.cca2
            },
            update: {
                nome: country.name.common,
                alpha3_code: country.cca3, // done
                moeda: country.currencies ? currencies.join(', ') : null, // done
                linguas: country.languages ? languages.join(', ') : null, // done
                capital: country.capital ? country.capital[0] : null, // done
                populacao: country.population || 0,
                continente: country.continents ? country.continents[0] : null // done
            },
            create: {
                nome: country.name.common,
                alpha2_code: country.cca2,
                alpha3_code: country.cca3,
                moeda: country.currencies ? currencies.join(', ') : null,
                linguas: country.languages ? languages.join(', ') : null,
                capital: country.capital ? country.capital[0] : null,
                populacao: country.population || 0,
                continente: country.continents ? country.continents[0] : null,
            }
        });
    }
    console.log(countries[0].population);
}

cron.schedule('0 0 * * *', main);