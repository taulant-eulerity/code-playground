/* eslint-disable no-lonely-if */
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const { Readable } = require('stream');
const { execFile } = require('child_process');
const AWS = require('aws-sdk');
const { createWriteStream } = require('fs');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


AWS.config.update({ 
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

const sendSMSNotification = async () => {
  const params = {
    Message: 'A user has entered your app.',
    TopicArn: 'arn:aws:sns:us-east-1:630526490102:code-playground-sms:c328ee9a-4f5d-4f45-b8b3-845ec9f1fe3c',
  };

  try {
    const data = await sns.publish(params).promise();
    console.log(`Message sent: ${data.MessageId}`);
  } catch (error) {
    console.error(`Error sending SMS: ${error.message}`);
  }
};

app.get("/", (req, res) => {
   res.status(200).json("<h1>Success</h1>")
})

app.post('/testCode', async (req, res) => {

  try {
    await sendSMSNotification()
    const { script, functionName } = req.body.data;

    const file = createWriteStream('results.js');
    const buffer = Buffer.from(script);
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(file).on('finish', () => {
      const findMachJson = (string, { first, second }) => {
        for (let i = 0; i < string.length; i++) {
          let firstChar = string[i];
          let secondChar = string[i + 1];
          if (firstChar === first && secondChar === second) {
            return i;
          }
        }
      };

      execFile(
        'npm',
        ['test', `./tests/${functionName}.test.js`],
        (_err, bufOut) => {
          const index = findMachJson(bufOut, { first: '{', second: '"' });
          if (index) {
            const JsonData = JSON.parse(bufOut.slice(index));
            res.json(JsonData);
            return;
          }
          res.status(404).json({ message: 'Not Found' });
        }
      );
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.use(express.static(path.join(__dirname, '/public')));


app.listen(8080, (_) => {
  console.log('Listening');
});
