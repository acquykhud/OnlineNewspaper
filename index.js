const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

app.use(express.urlencoded({
    extended: true
}));

// Use public
//app.use('/public', express.static('public'));

// Require middlewares
require('./middlewares/routes.mdw.js')(app);

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`OnlineNewspaper Web listening at http://localhost:${PORT}`);
});