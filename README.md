# API de Países

Esta API fornece informações sobre países, incluindo seus nomes, códigos, moedas, línguas, capitais e população.

## Pré-requisitos
- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Configuração

### 1. Instalação das Dependências
```bash
npm install
```

### 2. Configuração do Banco de Dados
1. Crie um banco de dados MySQL:
```sql
CREATE DATABASE countries_db;
```

2. Configure as credenciais do banco no arquivo `api.js`:
```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Sua senha do MySQL
    database: 'countries_db'
});
```

3. Execute o script `countries.js` para popular o banco de dados:
```bash
node countries.js
```

### 3. Iniciando a API
```bash
node api.js
```

## Endpoints Disponíveis

### 1. Obter Todos os Países
- **Endpoint**: GET /api/countries
- **Descrição**: Retorna toda a informação dos países com paginação avançada.
- **Parâmetros Query**:
  - page (opcional) - Número da página (padrão: 1)
  - limit (opcional) - Quantidade de registros por página (padrão: 10)
- **Exemplos**: 
  - `http://localhost:3000/api/countries` (primeira página com 10 registros)
  - `http://localhost:3000/api/countries?page=2` (segunda página)
  - `http://localhost:3000/api/countries?page=1&limit=20` (primeira página com 20 registros)
- **Resposta**:
  ```json
  {
    "meta": {
      "total_records": 250,        // Total de registros
      "records_per_page": 10,      // Registros por página
      "current_page": 1,           // Página atual
      "total_pages": 25,           // Total de páginas
      "showing": "Mostrando registros 1 até 10 de 250"
    },
    "navigation": {
      "links": {
        "self": "http://localhost:3000/api/countries?page=1&limit=10",
        "first": "http://localhost:3000/api/countries?page=1&limit=10",
        "last": "http://localhost:3000/api/countries?page=25&limit=10",
        "next": "http://localhost:3000/api/countries?page=2&limit=10",
        "prev": null
      },
      "has_next_page": true,
      "has_previous_page": false,
      "pages_remaining": 24,
      "next_page": 2,
      "previous_page": null
    },
    "data": [
      // Array com os países da página atual
    ]
  }
  ```

### 2. Obter Países por Continente
- **Endpoint**: GET /api/countries/continent/{continent}
- **Parâmetros**: continent (obrigatório) - Nome do continente
- **Exemplo**: `http://localhost:3000/api/countries/continent/Europe`

### 3. Obter Países por Idioma
- **Endpoint**: GET /api/countries/language
- **Parâmetros Query**:
  - language - Código da língua
  - country - Nome do país para retornar seu idioma
- **Exemplos**: 
  - `http://localhost:3000/api/countries/language?language=Portuguese`
  - `http://localhost:3000/api/countries/language?country=Portugal`

### 4. Obter Países por Moeda
- **Endpoint**: GET /api/countries/currency
- **Parâmetros Query**:
  - currency - Código da moeda
  - country - Nome do país para retornar sua moeda
- **Exemplos**:
  - `http://localhost:3000/api/countries/currency?currency=EUR`
  - `http://localhost:3000/api/countries/currency?country=Portugal`

### 5. Obter Capitais
- **Endpoint**: GET /api/countries/capital
- **Parâmetros Query**:
  - country (opcional) - Nome do país
- **Exemplos**:
  - `http://localhost:3000/api/countries/capital` (todas as capitais)
  - `http://localhost:3000/api/countries/capital?country=Portugal`

### 6. Obter População
- **Endpoint**: GET /api/population/{country}
- **Parâmetros**: country (obrigatório) - Nome do país
- **Exemplo**: `http://localhost:3000/api/population/Portugal`

## Estrutura do Banco de Dados

A tabela `countries` contém os seguintes campos:
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- nome (VARCHAR(255))
- alpha2_code (VARCHAR(2))
- alpha3_code (VARCHAR(3))
- moeda (VARCHAR(255))
- linguas (VARCHAR(255))
- capital (VARCHAR(255))
- populacao (BIGINT)
- continente (VARCHAR(255))

## Scripts Disponíveis
- `node countries.js`: Executa o script para popular o banco de dados
- `node api.js`: Inicia o servidor da API com nodemon (auto-reload)

## Tecnologias Utilizadas
- Node.js
- Express.js
- MySQL
- Axios (para buscar dados da API externa)
- nodemon (desenvolvimento)

## Fonte dos Dados
Os dados são obtidos da API REST Countries (https://restcountries.com/v3.1/all) e armazenados localmente no MySQL.