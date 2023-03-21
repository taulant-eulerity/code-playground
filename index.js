/* eslint-disable no-lonely-if */
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const { Readable } = require("stream");
const { execFile } = require("child_process");
const AWS = require("aws-sdk");
const { createWriteStream } = require("fs");
const axios = require("axios");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function getIP(req) {
  const clientIpAddress =
    (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  console.log(clientIpAddress, "Hey");
  return clientIpAddress;
}
async function getGeolocation(ipAddress) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    const data = response.data;

    if (data.status === "fail") {
      console.error("Failed to get geolocation data:", data.message);
      return null;
    }

    return {
      lat: data.lat,
      lon: data.lon,
      city: data.city,
      region: data.regionName,
      country: data.country,
    };
  } catch (error) {
    console.error("Error getting geolocation data:", error.message);
    return null;
  }
}

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

async function sendSMS(message) {
  const sns = new AWS.SNS();

  const smsParams = {
    Message: `New Visit: ${message}`,
    PhoneNumber: "+16463316367",
  };

  return sns.publish(smsParams).promise();
}

app.get("/", (req, res) => {

  res.status(200).json("<h1>Success</h1>");
});

app.post("/testCode", async (req, res) => {
  const results = await getGeolocation(getIP(req));
  await sendSMS(JSON.stringify(results));
  try {
    const { script, functionName } = req.body.data;

    const file = createWriteStream("results.js");
    const buffer = Buffer.from(script);
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(file).on("finish", () => {
      const findMachJson = (string, { first, second }) => {
        for (let i = 0; i < string.length; i++) {
          let firstChar = string[i];
          let secondChar = string[i + 1];
          if (firstChar === first && secondChar === second) {
            return i;
          }
        }
      };

      execFile("npm", ["test", `./tests/${functionName}.test.js`], (_err, bufOut) => {
        const index = findMachJson(bufOut, { first: "{", second: '"' });
        if (index) {
          const JsonData = JSON.parse(bufOut.slice(index));
          res.json(JsonData);
          return;
        }
        res.status(404).json({ message: "Not Found" });
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.use(express.static(path.join(__dirname, "/public")));

app.listen(8080, (_) => {
  console.log("Listening");
});
