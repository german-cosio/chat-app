const express = require('express');

const app = express();
const port = process.env.port || 3000;
app.use(express.static('./public'));

app.listen(3000, () => {
  console.log(`Server is up on port ${port}`);
});
