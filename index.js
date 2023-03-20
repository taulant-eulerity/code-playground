/* eslint-disable no-lonely-if */
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const { Readable } = require('stream');
const { execFile } = require('child_process');

const { createWriteStream } = require('fs');
const { json } = require('express');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/testCode', (req, res) => {
 
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


app.listen(4000, (_) => {
  console.log('Listening');
});
