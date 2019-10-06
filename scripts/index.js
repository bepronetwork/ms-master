
require('../app');

(async () => {
    setTimeout( async () => {
        //let AddAffiliateSetupToApp = require('./addAffiliateSetuptoApp');
        //await AddAffiliateSetupToApp.default.prototype.start();
        let AddAffiliateLinkToUsers = require('./addAffiliateLinkToUsers');
        await AddAffiliateLinkToUsers.default.prototype.start();
    }, 5*1000)
})()
