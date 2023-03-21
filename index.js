/* eslint-disable no-lonely-if */
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const { Readable } = require('stream');
const { execFile } = require('child_process');
//const AWS = require('aws-sdk');
const { createWriteStream } = require('fs');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: 'us-east-1'
// });


// function sendEmail() {
//   // Create an SES instance
//   const ses = new AWS.SES({ apiVersion: '2010-12-01' });

//   // Define the email parameters
//   const emailParams = {
//     Source: 'taulantus@gmail.com',
//     Destination: {
//       ToAddresses: ['taulantus@gmail.com']
//     },
//     Message: {
//       Subject: {
//         Data: 'New Visitor'
//       },
//       Body: {
//         Text: {
//           Data: 'Email body text'
//         },
//         Html: {
//           Data: '<p>Someone visited your app</p>'
//         }
//       }
//     }
//   };

//   // Send the email
//   return ses.sendEmail(emailParams).promise();
// }



app.get("/", (req, res) => {
   res.status(200).json("<h1>Success</h1>")
})

app.post('/testCode', async (req, res) => {
    // await sendEmail()
  try {
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
