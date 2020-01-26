const http = require('http')
  , express = require('express')
  , app = express()
  , server = http.createServer(app)
  , bodyParser = require('body-parser')
  , config = require('./nconf');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(require('multer')().array());

function response(req) {
    if (req.originalUrl != "/ping" || !config.get('logs:ignore:ping')) {
        console.log(`${Date.now()} | [${req.method}] - ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    }

    return {
        host: require('./response/host')(req),
        http: require('./response/http')(req),
        request: require('./response/request')(req),
        environment: require('./response/environment')(req)
    }
};

app.all('*', (req, res) => res.json(response(req)));
module.exports = server