const express = require('express');
const fetch = require('node-fetch');

const router = express();

router.get('/', async (req, res) => {
    try {
        const url = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?where=address_zipcode=75014&limit=100';
        const response = await fetch(url);
        const events = await response.json();
        res.json({ result: true, events : events.results });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ result: false, error: 'Error fetching data' });
    }
});

module.exports = router;

