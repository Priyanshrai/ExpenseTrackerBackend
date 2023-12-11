const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const port = 5000; // Change this if needed
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
