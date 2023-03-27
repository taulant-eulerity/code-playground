const fs = require('fs');

function appendToJsonFile(filePath, newObject) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file from disk: ${err}`);
    } else {
      // Parse the JSON file
      const jsonArray = JSON.parse(data);

      // Append the new object to the existing array
      jsonArray.push(newObject);

      // Convert the updated JSON array to a string
      const updatedJsonString = JSON.stringify(jsonArray, null, 2);

      // Write the updated JSON string back to the file
      fs.writeFile(filePath, updatedJsonString, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file to disk: ${err}`);
        } else {
          console.log('Successfully appended data to the JSON file');
        }
      });
    }
  });
}

module.exports = {appendToJsonFile}