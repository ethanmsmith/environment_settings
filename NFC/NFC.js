const express = require("express");
const fetch = require("node-fetch");
var path = require('path');

const app = express();
const port = 4000;

app.get('/nfc/lightsoff', (req, res) => {
  res.sendFile(path.join(__dirname + '/NFCLightsOff.html'));
});

app.get("/api/nfc/lightsoff", (req, res) => {
  fetch(
    "http://192.168.50.124/api/yvFMkyELQj3JpWCsK2IhcM2m95S7Y2rHPlwwIrVV/lights"
  ).then((response) => {
    let responseData = {};
    new Promise((resolve, reject) => {
      response.json().then((resdata) => {
        Object.keys(resdata).forEach((light) => {
          putData(
            `http://192.168.50.124/api/yvFMkyELQj3JpWCsK2IhcM2m95S7Y2rHPlwwIrVV/lights/${light}/state`,
            { on: false }
          ).then((data) => {
            responseData[light] = data;
            if(Object.keys(responseData).length === Object.keys(resdata).length) {
              resolve(responseData);
            }
          });
        });
      });
    }).then(response => res.status(200).send(response));
  });
});

app.listen(port, () => {
  console.log(`NFC listening at http://localhost:${port}`);
});

async function putData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
