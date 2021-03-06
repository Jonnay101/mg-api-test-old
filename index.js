const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fxRoutes = require('./routes/fxRoutes');
const { mongoURI } = require('./config/keys');

// create express app
const app = express();

// connect to mongodb
mongoose.connect(mongoURI);
mongoose.Promise = global.Promise;

// parse the incoming data
app.use(bodyParser.json());

// create the routes for comp presets
app.use('/api', fxRoutes);

// error handling for routes
app.use(function (err, req, res, next) {
    console.log(err)
    res.status(422).send({error: err.message});
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, function() {
    console.log('listening on port:' + PORT);
});