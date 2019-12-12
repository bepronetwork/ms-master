  
/** MACROS */
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')()
/** CODE */
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Scheduler   
import { globals } from './Globals';
import { Logger } from './helpers/logger';
import { PORT } from './config';

//---------CODING-CHOICES--------------//
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));


//--------RUN APP-------------------//

var config = {
  	appRoot: __dirname // required config
};

SwaggerExpress.create(config, async (err, swaggerExpress) => {
    if (err) { throw err; }
    // set the ENV variables if Production
	// install middleware
	swaggerExpress.register(app);
    globals.verify();
    await globals.connect();
    console.log("Connected to DB")
	app.listen(PORT,async () => {
        Logger.success("Listening in port", PORT);
	});

});
            
module.exports = app;