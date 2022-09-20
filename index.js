//Require & Variables
const app = require("./app/app");
const PORT = process.env.PORT || 3000;

//Lisening
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
