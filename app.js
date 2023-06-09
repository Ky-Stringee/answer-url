const express = require("express");
const internal = require("stream");
const app = express();
const url = require("url");
const port = process.env.PORT || 3000;

var connectAction = {
    "action": "connect",
    "from": {
        "type": "",
        "number": "",
        "alias": ""
    },
    "to": {
        "type": "",
        "number": "",
        "alias": ""
    },
    "customData": "",
    "timeout": 60,
    "continueOnFail": false,
    "onFailEventUrl": "",
    "maxConnectTime": -1,
    "peerToPeerCall": false
}

var recordAction = {
    "action": "record",
    "eventUrl": "",
    "format": "mp3"
}

app.get('/app-to-app', function (req, res) {
    var query = url.parse(req.originalUrl, true);
    if (query.search)
        var queryObj = parseQuery(query.search);
    connectAction.from.type = "internal";
    connectAction.to.type = "internal";
    if (queryObj) {
        connectAction.from.number = connectAction.from.alias = queryObj.from ? queryObj.from : "";
        connectAction.to.number = connectAction.to.alias = queryObj.to ? queryObj.to : "";
        connectAction.customData = queryObj.custom ? queryObj.custom : "";
    }
    res.setHeader('content-type', 'application/json');
    res.send([recordAction, connectAction]);
})

app.get('/app-to-phone', function (req, res) {
    var query = url.parse(req.originalUrl, true);
    if (query.search)
        var queryObj = parseQuery(query.search);
    connectAction.from.type = "internal";
    connectAction.to.type = "external";
    if (queryObj) {
        connectAction.from.number = connectAction.from.alias = queryObj.from ? queryObj.from : "";
        connectAction.to.number = connectAction.to.alias = queryObj.to ? queryObj.to : "";
        connectAction.customData = queryObj.custom ? queryObj.custom : "";
    }
    res.setHeader('content-type', 'application/json');
    res.send([recordAction, connectAction]);
})

app.get('/phone-to-app', function (req, res) {
    var query = url.parse(req.originalUrl, true);
    if (query.search)
        var queryObj = parseQuery(query.search);
    connectAction.from.type = "external";
    connectAction.to.type = "internal";
    connectAction.to.number = connectAction.to.alias = queryObj.toNumber;
    if (queryObj) {
        connectAction.from.number = connectAction.from.alias = queryObj.from ? queryObj.from : "";
        connectAction.customData = queryObj.custom ? queryObj.custom : "";
    }
    res.setHeader('content-type', 'application/json');
    res.send([recordAction, connectAction]);
})

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

app.listen(port, function () {
    console.log("Your app running on port " + port);
})
