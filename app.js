const express = require('express');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

const dataFilePath = 'data.json'; 

app.get('/api/names', async(req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
   
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/names/json', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
   
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/add', async (req, res) => {
  try {
    const newData = req.body;
    const data = await fs.readFile(dataFilePath, 'utf8');
    let dataArray = JSON.parse(data);
    dataArray.push(newData);
    await fs.writeFile(dataFilePath, JSON.stringify(dataArray, null, 2), 'utf8');
   
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get('/api/parsedata', async (req, res) => {
  try {
    const rawData = await fs.readFile(dataFilePath, 'utf8');
    console.log(rawData);
    const data = JSON.parse(rawData);
    const acceptHeader = req.get('Accept');

    if (acceptHeader.includes('text/html')) {
      const htmlResponse = data
        .map(
          (item) =>
            `<div>ID: ${item.id}, Name: ${item.name}, Category: ${item.category}, Condition: ${item.current_condition}</div>`
        )
        .join('');
      res.send(htmlResponse);
    } else if (acceptHeader.includes('application/xml')) {
      const xmlResponse = `<data>${data
        .map(
          (item) =>
            `<item><id>${item.id}</id><name>${item.name}</name><category>${item.category}</category><condition>${item.current_condition}</condition></item>`
        )
        .join('')}</data>`;
      res.type('application/xml');
      res.send(xmlResponse);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error reading or parsing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
