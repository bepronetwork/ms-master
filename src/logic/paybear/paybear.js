var https = require('https');

const API_KEY = 'seca13d983501c2c70fa47d4720c3f3b4bc';
const CALLBACK_URL = 'https://api.betprotocol.com/api/deposit/';
const PAY_BEAR_URL = 'https://api.savvy.io/v3/';

const __private  = {
    __generateOrderID : () => {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+S4()+S4()+S4()+S4());
    }
}

class Paybear{

    constructor(){

    }

    createPaymentInvoice(secretKey, currency){
        try{
            return new Promise( (resolve, reject) => {  
                let depositId = __private.__generateOrderID(),
                apiSecret = secretKey,
                callbackUrl = `${CALLBACK_URL + depositId + '/confirm'}`,
                url = `${PAY_BEAR_URL + currency + '/payment/'}` + 
                encodeURIComponent(callbackUrl) +
                '?token=' + apiSecret;
                https.get(url, (res) => {
                    var rawData = '';
                    res.on('data', (chunk) => { rawData += chunk; });
                    res.on('end',  () => {
                        var data = JSON.parse(rawData);
                        if (data.data.address) {
                            resolve({...data.data, id : depositId})
                        }else{ reject(data) }
                    });
                })
                .on('error', function (e) { 
                    reject(e)
                });
            })
        }catch(err){
            throw new Error('There is a problem with Paybear Integration')
        }
        
    }
}


export default Paybear;