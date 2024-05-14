const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    id: String,
    url: String,
    title: String,
    lead_text: String,
    description: String,
    date_start: Date,
    date_end: Date,
    occurrences: String,
    date_description: String,
    cover_url: String,
    cover_alt: String,
    cover_credit: String,
    tags: [String],
    address_name: String,
    address_street: String,
    address_zipcode: String,
    address_city: String,
    lat_lon: {
        lon: Number,
        lat: Number
    },
    pmr: Boolean,
    blind: Boolean,
    deaf: Boolean,
    transport: String,
    contact_url: String,
    contact_phone: String,
    contact_mail: String,
    contact_facebook: String,
    contact_twitter: String,
    price_type: String,
    price_detail: String,
    access_type: String,
    access_link: String,
    access_link_text: String,
    updated_at: Date,
    image_couverture: String,
    programs: String,
    address_url: String,
    address_url_text: String,
    address_text: String,
    title_event: String,
    audience: String,
    childrens: String,
    group: String
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;