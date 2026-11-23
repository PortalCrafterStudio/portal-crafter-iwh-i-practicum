// One-time setup for the practicum's developer test account.
// Creates the Plants custom object (schema + properties + contact association),
// adds a few sample records and associates each one with a contact.
//
// Usage: node scripts/setup-plants.js
// Needs PRIVATE_APP_ACCESS in .env (crm.schemas.custom, crm.objects.custom and
// crm.objects.contacts read/write scopes).

require('dotenv').config();
const axios = require('axios');

const hubspot = axios.create({
    baseURL: 'https://api.hubapi.com',
    headers: {
        Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
});

const plantsSchema = {
    name: 'plants',
    description: 'Houseplants and garden plants with their care needs.',
    labels: { singular: 'Plant', plural: 'Plants' },
    primaryDisplayProperty: 'name',
    secondaryDisplayProperties: ['species'],
    requiredProperties: ['name'],
    searchableProperties: ['name', 'species'],
    properties: [
        { name: 'name', label: 'Name', type: 'string', fieldType: 'text' },
        { name: 'species', label: 'Species', type: 'string', fieldType: 'text' },
        {
            name: 'sunlight',
            label: 'Sunlight',
            type: 'enumeration',
            fieldType: 'select',
            options: [
                { label: 'Full sun', value: 'full_sun', displayOrder: 0, hidden: false },
                { label: 'Bright, indirect light', value: 'bright_indirect', displayOrder: 1, hidden: false },
                { label: 'Partial shade', value: 'partial_shade', displayOrder: 2, hidden: false },
                { label: 'Low light', value: 'low_light', displayOrder: 3, hidden: false }
            ]
        },
        { name: 'watering_frequency_days', label: 'Watering frequency (days)', type: 'number', fieldType: 'number' }
    ],
    associatedObjects: ['CONTACT']
};

const samplePlants = [
    { name: 'Monty', species: 'Monstera deliciosa', sunlight: 'bright_indirect', watering_frequency_days: 7 },
    { name: 'Spike', species: 'Aloe vera', sunlight: 'full_sun', watering_frequency_days: 21 },
    { name: 'Fernando', species: 'Nephrolepis exaltata (Boston fern)', sunlight: 'partial_shade', watering_frequency_days: 3 },
    { name: 'Zed', species: 'Zamioculcas zamiifolia (ZZ plant)', sunlight: 'low_light', watering_frequency_days: 14 }
];

async function getOrCreateSchema() {
    const existing = await hubspot.get('/crm/v3/schemas');
    const found = existing.data.results.find(schema => schema.name === plantsSchema.name);
    if (found) {
        console.log(`Plants schema already exists: ${found.objectTypeId}`);
        return found;
    }
    const created = await hubspot.post('/crm/v3/schemas', plantsSchema);
    console.log(`Created Plants schema: ${created.data.objectTypeId}`);
    return created.data;
}

async function getOrCreateContact() {
    const contacts = await hubspot.get('/crm/v3/objects/contacts', { params: { limit: 1 } });
    if (contacts.data.results.length) return contacts.data.results[0];
    const created = await hubspot.post('/crm/v3/objects/contacts', {
        properties: { firstname: 'Sample', lastname: 'Plant Owner', email: 'plant.owner@example.com' }
    });
    return created.data;
}

async function main() {
    const schema = await getOrCreateSchema();
    const objectType = schema.objectTypeId;

    const existing = await hubspot.get(`/crm/v3/objects/${objectType}`, { params: { limit: 100, properties: 'name' } });
    const existingNames = new Set(existing.data.results.map(record => record.properties.name));
    const toCreate = samplePlants.filter(plant => !existingNames.has(plant.name));

    let created = [];
    if (toCreate.length) {
        const resp = await hubspot.post(`/crm/v3/objects/${objectType}/batch/create`, {
            inputs: toCreate.map(properties => ({ properties }))
        });
        created = resp.data.results;
        console.log(`Created ${created.length} plant records`);
    }

    const contact = await getOrCreateContact();
    for (const plant of created) {
        await hubspot.put(`/crm/v4/objects/${objectType}/${plant.id}/associations/default/contacts/${contact.id}`);
    }
    if (created.length) console.log(`Associated ${created.length} plants with contact ${contact.id}`);

    console.log(`\nCUSTOM_OBJECT_TYPE=${objectType}`);
}

main().catch(error => {
    console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    process.exit(1);
});
