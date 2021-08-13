const express = require("express");
const morgan = require("morgan");
const exphbs = require('express-handlebars');

const app = express();

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    helpers: require('./utils/handlebars-helpers'),
}));
app.set('view engine', 'hbs');

app.use('/public', express.static('public'));

app.use(morgan("dev"));

app.use(express.urlencoded({
    extended: true
}));

require('./middlewares/sessions.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw.js')(app);

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`OnlineNewspaper Web listening at http://localhost:${PORT}`);
});