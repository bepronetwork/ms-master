module.exports = {
    shouldRegisterTheAdmin(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(200);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('object');
        expect(data.message._id).to.not.be.null;
        expect(data.message._id).to.be.an('string');
        expect(data.message.username).to.not.be.null;
        expect(data.message.username).to.be.an('string');
        expect(data.message.name).to.not.be.null;
        expect(data.message.name).to.be.an('string');
        expect(data.message.hash_password).to.not.be.null;
        expect(data.message.hash_password).to.be.an('string');
        expect(data.message.security).to.not.be.null;
        expect(data.message.security).to.be.an('string');
        expect(data.message.email).to.not.be.null;
        expect(data.message.email).to.be.an('string');
        expect(data.message.__v).to.not.be.null;
        expect(data.message.__v).to.be.an('number');
    },
    shouldLoginTheAdmin(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(200);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('object');
        expect(data.message.username).to.not.be.null;
        expect(data.message.username).to.be.an('string');
        expect(data.message.email).to.not.be.null;
        expect(data.message.email).to.be.an('string');
        expect(data.message.bearerToken).to.not.be.null;
        expect(data.message.bearerToken).to.be.an('string');
        expect(data.message.name).to.not.be.null;
        expect(data.message.name).to.be.an('string');
        expect(data.message.id).to.not.be.null;
        expect(data.message.id).to.be.an('string');
        expect(data.message.app).to.not.be.null;
        expect(data.message.app).to.be.an('object');
        expect(data.message.app.wallet).to.not.be.null;
        expect(data.message.app.wallet).to.be.an('object');
        expect(data.message.app.wallet.playBalance).to.not.be.null;
        expect(data.message.app.wallet.playBalance).to.be.an('number');
        expect(data.message.security).to.not.be.null;
        expect(data.message.security).to.be.an('object');
        expect(data.message.security.id).to.not.be.null;
        expect(data.message.security.id).to.be.an('string');
    },
    shouldCreateTheApp(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(200);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('object');
        expect(data.message.id).to.not.be.null;
        expect(data.message.id).to.be.an('string');
        expect(data.message.name).to.not.be.null;
        expect(data.message.name).to.be.an('string');
        expect(data.message.description).to.not.be.null;
        expect(data.message.description).to.be.an('string');
        expect(data.message.isValid).to.not.be.null;
        expect(data.message.isValid).to.be.false;
        expect(data.message.licensesId).to.not.be.null;
        expect(data.message.licensesId).to.be.an('array').that.is.empty;
        expect(data.message.customization).to.not.be.null;
        expect(data.message.customization).to.be.an('string');
        expect(data.message.integrations).to.not.be.null;
        expect(data.message.integrations).to.be.an('object');
        expect(data.message.integrations.chat).to.not.be.null;
        expect(data.message.integrations.chat).to.be.an('object');
        expect(data.message.integrations.chat.publicKey).to.not.be.null;
        expect(data.message.integrations.chat.publicKey).to.be.an('string');
        expect(data.message.countriesAvailable).to.not.be.null;
        expect(data.message.countriesAvailable).to.be.an('array').that.is.empty;
        expect(data.message.games).to.not.be.null;
        expect(data.message.games).to.be.an('array').that.is.empty;
    },
    shouldSet2FAForTheAdmin(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(200);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('object');
        expect(data.message.newSecret).to.not.be.null;
        expect(data.message.newSecret).to.be.an('string');
        expect(data.message.username).to.not.be.null;
        expect(data.message.username).to.be.an('string');
        expect(data.message.isVerifiedToken2FA).to.not.be.null;
        expect(data.message.isVerifiedToken2FA).to.be.true;
        expect(data.message.admin_id).to.not.be.null;
        expect(data.message.admin_id).to.be.an('string');
        expect(data.message.security_id).to.not.be.null;
        expect(data.message.security_id).to.be.an('string');
        expect(data.message._id).to.not.be.null;
        expect(data.message._id).to.be.an('string');
        expect(data.message.name).to.not.be.null;
        expect(data.message.name).to.be.an('string');
        expect(data.message.hash_password).to.not.be.null;
        expect(data.message.hash_password).to.be.an('string');
        expect(data.message.security).to.not.be.null;
        expect(data.message.security).to.be.an('object');
        expect(data.message.security._id).to.not.be.null;
        expect(data.message.security._id).to.be.an('string');
        expect(data.message.security.bearerToken).to.not.be.null;
        expect(data.message.security.bearerToken).to.be.an('string');
        expect(data.message.email).to.not.be.null;
        expect(data.message.email).to.be.an('string');
        expect(data.message.__v).to.not.be.null;
        expect(data.message.__v).to.be.an('number');
        expect(data.message.app).to.not.be.null;
        expect(data.message.app).to.be.an('object');
        expect(data.message.app._id).to.not.be.null;
        expect(data.message.app._id).to.be.an('string');
        expect(data.message.app.isValid).to.not.be.null;
        expect(data.message.app.isValid).to.be.false;
        expect(data.message.app.ownerAddress).to.not.be.null;
        expect(data.message.app.ownerAddress).to.be.an('string');
        expect(data.message.app.authorizedAddresses).to.not.be.null;
        expect(data.message.app.authorizedAddresses).to.be.an('array');
        expect(data.message.app.croupierAddress).to.not.be.null;
        expect(data.message.app.croupierAddress).to.be.an('string');
        expect(data.message.app.games).to.not.be.null;
        expect(data.message.app.games).to.be.an('array');
        expect(data.message.app.listAdmins).to.not.be.null;
        expect(data.message.app.listAdmins).to.be.an('array');
        expect(data.message.app.services).to.not.be.null;
        expect(data.message.app.services).to.be.an('array');
        expect(data.message.app.users).to.not.be.null;
        expect(data.message.app.users).to.be.an('array');
        expect(data.message.app.external_users).to.not.be.null;
        expect(data.message.app.external_users).to.be.an('array');
        expect(data.message.app.deposits).to.not.be.null;
        expect(data.message.app.deposits).to.be.an('array');
        expect(data.message.app.withdraws).to.not.be.null;
        expect(data.message.app.withdraws).to.be.an('array');
        expect(data.message.app.wallet).to.not.be.null;
        expect(data.message.app.wallet).to.be.an('object');
        expect(data.message.app.wallet._id).to.not.be.null;
        expect(data.message.app.wallet._id).to.be.an('string');
        expect(data.message.app.wallet.playBalance).to.not.be.null;
        expect(data.message.app.wallet.playBalance).to.be.an('number');
        expect(data.message.app.name).to.not.be.null;
        expect(data.message.app.name).to.be.an('string');
        expect(data.message.app.affiliateSetup).to.not.be.null;
        expect(data.message.app.affiliateSetup).to.be.an('string');
        expect(data.message.app.customization).to.not.be.null;
        expect(data.message.app.customization).to.be.an('string');
        expect(data.message.app.integrations).to.not.be.null;
        expect(data.message.app.integrations).to.be.an('string');
        expect(data.message.app.description).to.not.be.null;
        expect(data.message.app.description).to.be.an('string');
        expect(data.message.app.bearerToken).to.not.be.null;
        expect(data.message.app.bearerToken).to.be.an('string');
    },
    shouldLoginTheAdminFA(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(200);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('object');
        expect(data.message.username).to.not.be.null;
        expect(data.message.username).to.be.an('string');
        expect(data.message.bearerToken).to.not.be.null;
        expect(data.message.bearerToken).to.be.an('string');
        expect(data.message.name).to.not.be.null;
        expect(data.message.name).to.be.an('string');
        expect(data.message.id).to.not.be.null;
        expect(data.message.id).to.be.an('string');
        expect(data.message.app).to.not.be.null;
        expect(data.message.app).to.be.an('object');
        expect(data.message.app.id).to.not.be.null;
        expect(data.message.app.id).to.be.an('string');
        expect(data.message.app.name).to.not.be.null;
        expect(data.message.app.name).to.be.an('string');
        expect(data.message.app.description).to.not.be.null;
        expect(data.message.app.description).to.be.an('string');
        expect(data.message.app.bearerToken).to.not.be.null;
        expect(data.message.app.bearerToken).to.be.an('string');
        expect(data.message.app.withdraws).to.not.be.null;
        expect(data.message.app.withdraws).to.be.an('array');
        expect(data.message.app.isValid).to.not.be.null;
        expect(data.message.app.isValid).to.be.false;
        expect(data.message.app.services).to.not.be.null;
        expect(data.message.app.services).to.be.an('array');
        expect(data.message.app.games).to.not.be.null;
        expect(data.message.app.games).to.be.an('array');
        expect(data.message.app.wallet).to.not.be.null;
        expect(data.message.app.wallet).to.be.an('object');
        expect(data.message.app.wallet.playBalance).to.not.be.null;
        expect(data.message.app.wallet.playBalance).to.be.an('number');
        expect(data.message.security).to.not.be.null;
        expect(data.message.security).to.be.an('object');
        expect(data.message.security.id).to.not.be.null;
        expect(data.message.security.id).to.be.an('string');
        expect(data.message.security.bearerToken).to.not.be.null;
        expect(data.message.security.bearerToken).to.be.an('string');
    },
    shouldAuthForAdminBearerToken(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(200);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('object');
        expect(data.message.username).to.not.be.null;
        expect(data.message.username).to.be.an('string');
        expect(data.message.name).to.not.be.null;
        expect(data.message.name).to.be.an('string');
        expect(data.message.id).to.not.be.null;
        expect(data.message.id).to.be.an('string');
        expect(data.message.app).to.not.be.null;
        expect(data.message.app).to.be.an('object');
        expect(data.message.app.id).to.not.be.null;
        expect(data.message.app.id).to.be.an('string');
        expect(data.message.app.name).to.not.be.null;
        expect(data.message.app.name).to.be.an('string');
        expect(data.message.app.description).to.not.be.null;
        expect(data.message.app.description).to.be.an('string');
        expect(data.message.app.bearerToken).to.not.be.null;
        expect(data.message.app.bearerToken).to.be.an('string');
        expect(data.message.app.withdraws).to.not.be.null;
        expect(data.message.app.withdraws).to.be.an('array');
        expect(data.message.app.isValid).to.not.be.null;
        expect(data.message.app.isValid).to.be.false;
        expect(data.message.app.services).to.not.be.null;
        expect(data.message.app.services).to.be.an('array');
        expect(data.message.app.games).to.not.be.null;
        expect(data.message.app.games).to.be.an('array');
        expect(data.message.app.wallet).to.not.be.null;
        expect(data.message.app.wallet).to.be.an('object');
        expect(data.message.app.wallet.playBalance).to.not.be.null;
        expect(data.message.app.wallet.playBalance).to.be.an('number');
        expect(data.message.security).to.not.be.null;
        expect(data.message.security).to.be.an('object');
        expect(data.message.security.id).to.not.be.null;
        expect(data.message.security.id).to.be.an('string');
        expect(data.message.security.bearerToken).to.not.be.null;
        expect(data.message.security.bearerToken).to.be.an('string');
    },
    shouldntLoginTheAdminWRONGTOKEN(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(36);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('string');
    },
    shouldntCreateAnAppForExistingAppOnAdmin(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(38);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('string');
    },
    shouldntLoginTheAdminNOTOKEN(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(37);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('string');
    },
    shouldntLoginTheAdminAndNoticeTheUserDoesNotExist(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(4);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('string');
    },
    shouldntLoginTheAdmin(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(5);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('string');
    },
}