const express = require('express');
const fetch = require('node-fetch');

const router = express();

const Event = require('../models/events'); // Importez le modèle Event


router.get('/', async (req, res) => {
    try {
        // Récupération des événements depuis l'API
        const url = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?where=address_zipcode=75014&limit=100';
        const response = await fetch(url);
        const eventsFromAPI = await response.json();

        // Récupération des IDs des événements depuis la base de données MongoDB
        const eventsFromDB = await Event.find({});
        const eventIDs = eventsFromDB.map(event => event.id);

        // Filtrage des événements récupérés depuis l'API en excluant ceux qui ont un ID présent dans la base de données
        const filteredEvents = eventsFromAPI.results.filter(event => !eventIDs.includes(event.id));

        res.json({ result: true, events: filteredEvents });

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

// Route DELETE pour supprimer un événement par son ID
router.delete('/deleteEvent/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const deletedEvent = await Event.deleteOne({ id: eventId });

        if (!deletedEvent) {
            return res.status(404).json({ result: false, error: 'Event not found' });
        }

        res.status(200).json({ result: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ result: false, error: 'Error deleting event' });
    }
});





module.exports = router;

