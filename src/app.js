import { PORT, QUOTA_GUARD_URL, PUBLIC_KEY } from './config';
import { globals } from './Globals';
import { Logger } from './helpers/logger';
import PusherSingleton from './logic/third-parties/pusher';
import { rateLimiterUsingThirdParty } from './controllers/middlewares';
import { IOSingleton } from './logic/utils/io';
/** MACROS */
var SwaggerExpress = require('swagger-express-mw');

var app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const socketIOJwt = require('socketio-jwt');

var publicKEY =  new String("-----BEGIN PUBLIC KEY-----\n" + PUBLIC_KEY + "\n-----END PUBLIC KEY-----").trim();

const expressIp = require('express-ip');
const cors = require('cors');
/** CODE */
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Scheduler   


//---------CODING-CHOICES--------------/
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(expressIp().getIpInfoMiddleware);
app.use(rateLimiterUsingThirdParty);

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
    await globals.__init__();

    //-------- Socket ------------------//
    io.on('connection', socketIOJwt.authorize({
        secret: publicKEY,
        timeout: 15000
    }))
    .on('authenticated', (socket) => {
        socket.join(socket.decoded_token.id);
    });
    IOSingleton.push(io);
    //----------------------------------//

    http.listen(PORT, async () => {
        Logger.success("Listening in port", PORT);
    });

});

module.exports = app;