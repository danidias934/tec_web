# API de Países

Esta API fornece informações sobre países, incluindo os seus nomes, códigos, moedas, línguas, capitais e população.

## Autores
- Daniel Dias - 74529
- Alexandre Rodrigues - 74549
- José Romão- 74533

## Pré-requisitos
- Node.js
- MySQL
- npm

## Configuração

### 1. Instalação das Dependências
```bash
npm install 
```

### 2. Configuração da Base de Dados
1. Crie um ficheiro `.env` na raiz do projeto com as seguintes configurações:
```env
DATABASE_URL="mysql://root:@localhost:3306/countries_db"
PORT=3000
```

2. Execute as migrações do Prisma:
```bash
migrations.ps1
```

### 3. População da Base de Dados
Execute o script collector.js para popular a base de dados:
```bash
node collector.js
```

### 4. Iniciar a API
```bash
node index.js
```

## Autenticação

A API requer autenticação via token Bearer. Inclua o seguinte cabeçalho em todos os pedidos:
```
Authorization: Bearer B
```

## Endpoints Disponíveis

### 1. Login
- **Endpoint**: POST /api/login
- **Parâmetros**: 
  - **Body**: 
    - username
    - password
- **Autenticação**: Não necessária
- **Exemplo**: `http://localhost:3000/api/login`

### 2. Registar
- **Endpoint**: POST /api/register
- **Parâmetros**: 
  - **Body**: 
    - username
    - password
- **Autenticação**: Não necessária
- **Exemplo**: `http://localhost:3000/api/register`

### 3. Listar Todos os Países
- **Endpoint**: GET /api/countries
- **Autenticação**: Obrigatória
- **Exemplo**: `http://localhost:3000/api/countries`

### 4. Obter Países por Continente
- **Endpoint**: GET /api/countries/continent/{continent}
- **Autenticação**: Obrigatória
- **Exemplo**: `http://localhost:3000/api/countries/continent/Europe`

### 5. Pesquisar por Idioma
- **Endpoint**: GET /api/countries/language
- **Parâmetros Query**: language
- **Autenticação**: Obrigatória
- **Exemplo**: `http://localhost:3000/api/countries/language?language=Portuguese`

### 6. Pesquisar por Capital
- **Endpoint**: GET /api/countries/capital
- **Parâmetros Query**: capital
- **Autenticação**: Obrigatória
- **Exemplo**: `http://localhost:3000/api/countries/capital?capital=Lisbon`

### 7. Pesquisar por Moeda
- **Endpoint**: GET /api/countries/currency
- **Parâmetros Query**: currency
- **Autenticação**: Obrigatória
- **Exemplo**: `http://localhost:3000/api/countries/currency?currency=EUR`

### 8. Pesquisar População por País
- **Endpoint**: GET /api/population/{country}
- **Autenticação**: Obrigatória
- **Exemplo**: `http://localhost:3000/api/population/30`

### 9. Pesquisar País por Código
- **Endpoint**: GET /api/countries/{alpha2_code}
- **Autenticação**: Obrigatória
- **Exemplo**: `http://localhost:3000/api/countries/PT`

## Origem dos Dados
Os dados são recolhidos da API REST Countries (https://restcountries.com/v3.1/all) através do script collector.js

## Estrutura da Base de Dados
A base de dados é gerida pelo Prisma ORM e contém uma tabela principal `country` com os seguintes campos:
- nome (VARCHAR)
- alpha2_code (VARCHAR, chave primária)
- alpha3_code (VARCHAR)
- moeda (VARCHAR)
- linguas (VARCHAR)
- capital (VARCHAR)
- populacao (BIGINT)
- continente (VARCHAR)

## Tecnologias Utilizadas
- Node.js
- Express.js
- Prisma ORM
- MySQL
- Axios
- node-cron (para recolha automática de dados)