require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
// * The token is read from a local .env file (gitignored). See .env.example.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// * Custom object used in this practicum: Plants.
// * CUSTOM_OBJECT_TYPE can be set in .env to point the app at another custom object.
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE || 'p_plants';
const PLANT_PROPERTIES = ['name', 'species', 'sunlight', 'watering_frequency_days'];
const SUNLIGHT_OPTIONS = [
    { value: 'full_sun', label: 'Full sun' },
    { value: 'bright_indirect', label: 'Bright, indirect light' },
    { value: 'partial_shade', label: 'Partial shade' },
    { value: 'low_light', label: 'Low light' }
];
const FORM_TITLE = 'Update Custom Object Form | Integrating With HubSpot I Practicum';

const hubspotHeaders = () => ({
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
});

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: FORM_TITLE,
        sunlightOptions: SUNLIGHT_OPTIONS
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const { name, species, sunlight, watering_frequency_days } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).render('updates', {
            title: FORM_TITLE,
            sunlightOptions: SUNLIGHT_OPTIONS,
            values: req.body,
            error: 'Name is required.'
        });
    }

    const newPlant = {
        properties: {
            name: name.trim(),
            species: (species || '').trim(),
            sunlight,
            watering_frequency_days
        }
    };

    const createPlant = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

    try {
        await axios.post(createPlant, newPlant, { headers: hubspotHeaders() });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).render('updates', {
            title: FORM_TITLE,
            sunlightOptions: SUNLIGHT_OPTIONS,
            values: req.body,
            error: 'HubSpot could not create the record. Check the server log and try again.'
        });
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));