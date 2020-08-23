"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globals = void 0;

var _mongoose = require("mongoose");

var _web = _interopRequireDefault(require("web3"));

var _CasinoContract = _interopRequireDefault(require("./logic/eth/CasinoContract"));

var _interfaces = _interopRequireDefault(require("./logic/eth/interfaces"));

var _ERC20Contract = _interopRequireDefault(require("./logic/eth/ERC20Contract"));

var _config = require("./config");

var _network = require("./helpers/network");

var _logger = require("./helpers/logger");

var _bluebird = _interopRequireDefault(require("bluebird"));

var _thirdParties = require("./logic/third-parties");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Globals =
/*#__PURE__*/
function () {
  function Globals() {
    _classCallCheck(this, Globals);

    this.web3 = new _web["default"](new _web["default"].providers.HttpProvider(_config.ETH_NETWORK.url));
  }

  _createClass(Globals, [{
    key: "__init__",
    value: function __init__() {
      return regeneratorRuntime.async(function __init__$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(_thirdParties.BitGoSingleton.__init__());

            case 2:
              _context.next = 4;
              return regeneratorRuntime.awrap(this.startDatabase());

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "verify",
    value: function verify() {
      //Display All and Confirm Running
      globals.log();
    }
  }, {
    key: "getCasinoContract",
    value: function getCasinoContract(address, tokenAddress) {
      return new _CasinoContract["default"]({
        web3: this.web3,
        contractDeployed: _interfaces["default"].casino,
        erc20TokenContract: tokenAddress,
        contractAddress: address
      });
    }
  }, {
    key: "getERC20Contract",
    value: function getERC20Contract(tokenAddress) {
      var erc20Contract = new _ERC20Contract["default"]({
        web3: this.web3,
        contractAddress: tokenAddress,
        accountPrivateKey: _config.ETH_NETWORK.keys.home
      });

      erc20Contract.__assert({
        contractAddress: tokenAddress,
        contract_name: 'IERC20Token'
      });

      return erc20Contract;
    }
  }, {
    key: "newCasinoContract",
    value: function newCasinoContract(params) {
      return new _CasinoContract["default"]({
        web3: this.web3,
        contractDeployed: CONSTANTS.casino,
        erc20TokenContract: params.tokenAddress,
        tokenTransferAmount: params.tokenTransferAmount
      });
    }
  }, {
    key: "set",
    value: function set(item, value) {
      Object.defineProperty(this, item, value);
    }
  }, {
    key: "get",
    value: function get(item) {
      if (Object.getOwnPropertyDescriptor(this, item)) {
        return this.mongo[item];
      } else {
        throw new Error("Key does not exist");
      }
    }
  }, {
    key: "log",
    value: function log() {
      _logger.Logger.info("ETH", "".concat(_config.ETH_NET_NAME));

      _logger.Logger.info("IP", "".concat((0, _network.IPRunning)()));
    }
  }, {
    key: "startDatabase",
    value: function startDatabase() {
      return regeneratorRuntime.async(function startDatabase$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Main DB
              this.main_db = new _mongoose.Mongoose();
              this.main_db.set('useFindAndModify', false);
              _context2.next = 4;
              return regeneratorRuntime.awrap(this.main_db.connect("".concat(_config.MONGO_CONNECTION_STRING, "/main?ssl=true&authSource=admin&retryWrites=true&w=majority"), {
                useNewUrlParser: true,
                useUnifiedTopology: true
              }));

            case 4:
              this.main_db.Promise = _bluebird["default"]; // Ecosystem DB

              this.ecosystem_db = new _mongoose.Mongoose();
              this.ecosystem_db.set('useFindAndModify', false);
              _context2.next = 9;
              return regeneratorRuntime.awrap(this.ecosystem_db.connect("".concat(_config.MONGO_CONNECTION_STRING, "/ecosystem?ssl=true&authSource=admin&retryWrites=true&w=majority"), {
                useNewUrlParser: true,
                useUnifiedTopology: true
              }));

            case 9:
              this.ecosystem_db.Promise = _bluebird["default"]; // Redis DB

              this.redis_db = new _mongoose.Mongoose();
              this.redis_db.set('useFindAndModify', false);
              _context2.next = 14;
              return regeneratorRuntime.awrap(this.redis_db.connect("".concat(_config.MONGO_CONNECTION_STRING, "/redis?ssl=true&authSource=admin&retryWrites=true&w=majority"), {
                useNewUrlParser: true,
                useUnifiedTopology: true
              }));

            case 14:
              this.redis_db.Promise = _bluebird["default"]; // Main DB

              this["default"] = new _mongoose.Mongoose();
              this["default"].Promise = _bluebird["default"];
              return _context2.abrupt("return", true);

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);

  return Globals;
}();

var globals = new Globals(); // Singleton

exports.globals = globals;