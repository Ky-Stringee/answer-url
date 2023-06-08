const express = require("express");
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
    "maxConnectTime": 0,
    "peerToPeerCall": false
}

var recordAction = {
    "action": "record",
    "eventUrl": "",
    "format": "mp3"
}

app.get('/app-to-app', function (req, res) {
    connectAction.from.type = connectAction.to.type = "internal";
    res.send([recordAction, connectAction]);
})

app.get('/app-to-phone', function (req, res) {
    connectAction.from.type = "internal";
    connectAction.to.type = "external";
    res.send([recordAction, connectAction]);
})

app.get('/phone-to-app', function (req, res) {
    var parse = url.parse(req.originalUrl, true);
    var userID = parse.search.replace('?','');
    connectAction.to.number = connectAction.to.alias = userID;
    connectAction.from.type = "external";
    connectAction.to.type = "internal";
    res.send([recordAction, connectAction]);
})

app.get('/phone-to-phone', function (req, res) {
    var parse = url.parse(req.originalUrl, true);
    var urlParams = new URLSearchParams(parse.search);
    connectAction.from.number = connectAction.from.alias = urlParams.get("from");
    connectAction.to.number = connectAction.to.alias = urlParams.get("to");
    connectAction.from.type = "external";
    connectAction.to.type = "external";
    res.send([recordAction, connectAction]);
})

app.listen(port, function () {
    console.log("Your app running on port " + port);
})
