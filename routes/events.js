const express = require('express');
const fetch = require('node-fetch');

const router = express();

const Event = require('../models/events'); // Importez le modèle Event


router.get('/', async (req, res) => {
    try {
        const url = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?where=address_zipcode=75014&limit=100';
        const response = await fetch(url);
        const events = await response.json();
        res.json({ result: true, events: events.results });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ result: false, error: 'Error fetching data' });
    }
});

// Route GET pour récupérer toutes les données d'événements
router.get('/allEvents', async (req, res) => {
    try {
        const allEvents = await Event.find();
        res.status(200).json({ result: true, events: allEvents });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ result: false, error: 'Error fetching events' });
    }
});

router.get('/oneEvent/:id', async (req, res) => {
    try {
        const id = req.params.id; // Récupérer l'ID depuis les paramètres de la requête
        const url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?where=id=${id}&limit=1`;
        const response = await fetch(url);
        const event = await response.json();

        // Vérifier si l'événement existe
        if (event && event.results) {
            res.json({ result: true, event: event.results[0] });
        } else {
            res.status(404).json({ result: false, error: 'Event not found' });
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ result: false, error: 'Error fetching data' });
    }
});


router.post('/addEvent', async (req, res) => {
    try {
        const eventData = req.body;
        const newEvent = new Event(eventData);
        const savedEvent = await newEvent.save();

        // Répondre avec l'événement ajouté
        res.status(201).json({ result: true, event: savedEvent });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ result: false, error: 'Error adding event' });
    }
});



module.exports = router;

