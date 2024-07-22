const Axios = require('axios');

const axios = Axios.create({
    baseURL: process.env.API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    });


module.exports = axios;