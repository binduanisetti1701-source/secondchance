const app = require("./app");
const natural = require("natural");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(SecondChance server running on port ${PORT});
});

module.exports = app;
