module.exports = {
    shouldCreateTheApp(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(200);
        expect(data.message.id).to.not.be.null;
        expect(data.message.id).to.be.an('string');
        expect(data.message.name).to.not.be.null;
        expect(data.message.name).to.be.an('string');
        expect(data.message.description).to.not.be.null;
        expect(data.message.description).to.be.an('string');
        expect(data.message.isValid).to.not.be.null;
        expect(data.message.isValid).to.be.false;
        expect(data.message.licensesId).to.be.an('array').that.is.empty;
        expect(data.message.customization).to.not.be.null;
        expect(data.message.customization).to.be.an('string')
        expect(data.message.integrations).to.not.be.null;
        expect(data.message.integrations).to.not.be.empty;
        expect(data.message.integrations.chat).to.not.be.null;
        expect(data.message.integrations.chat).to.not.be.empty;
        expect(data.message.integrations.chat.publicKey).to.not.be.null;
        expect(data.message.countriesAvailable).to.be.an('array').that.is.empty;;
        expect(data.message.games).to.be.an('array').that.is.empty;;
        
    },
    shouldGetNewBearerToken(data, expect) {
        expect(data.status).to.not.be.null;
        expect(data.status).to.equal(200);
        expect(data.message).to.not.be.null;
        expect(data.message).to.be.an('object');
        expect(data.message).to.include({username: data.message.username, email: data.message.email, name: data.message.name, id: data.message.id, app: data.message.app, security: data.message.security});
        expect(data.message.username).to.not.be.null;
        expect(data.message.username).to.be.an('string');
        expect(data.message.email).to.not.be.null;
        expect(data.message.email).to.be.an('string');
        expect(data.message.name).to.not.be.null;
        expect(data.message.name).to.be.an('string');
        expect(data.message.id).to.not.be.null;
        expect(data.message.id).to.be.an('string');
        expect(data.message.app).to.not.be.null;
        expect(data.message.app).to.be.an('object');
        expect(data.message.app).to.include({id: data.message.app.id, name: data.message.app.name, description: data.message.app.description, bearerToken: data.message.app.bearerToken, withdraws: data.message.app.withdraws, isValid: data.message.app.isValid, services: data.message.app.services, games: data.message.app.games, wallet: data.message.app.wallet});
        expect(data.message.app.id).to.not.be.null;
        expect(data.message.app.id).to.be.an('string');
        expect(data.message.app.name).to.not.be.null;
        expect(data.message.app.name).to.be.an('string');
        expect(data.message.app.description).to.not.be.null;
        expect(data.message.app.description).to.be.an('string');
        expect(data.message.app).to.have.property('bearerToken');
        expect(data.message.app.bearerToken).to.not.be.null;
        expect(data.message.app.withdraws).to.be.an('array').that.is.empty;
        expect(data.message.app.isValid).to.not.be.null;
        expect(data.message.app.isValid).to.be.false;
        expect(data.message.app.services).to.be.an('array').that.is.empty;
        expect(data.message.app.games).to.be.an('array').that.is.empty;
        expect(data.message.app.wallet).to.not.be.null;
        expect(data.message.app.wallet).to.be.an('object');
        expect(data.message.app.wallet).to.include({playBalance: data.message.app.wallet.playBalance});
        expect(data.message.app.wallet.playBalance).to.not.be.null;
        expect(data.message.app.wallet.playBalance).to.equal(0);
        expect(data.message.security).to.not.be.null;
        expect(data.message.security).to.be.an('object');
        expect(data.message.security).to.include({id: data.message.security.id, bearerToken: data.message.security.bearerToken});
        expect(data.message.security.id).to.not.be.null;
        expect(data.message.security.id).to.be.an('string');
        expect(data.message.security).to.have.property('bearerToken');
        expect(data.message.security.bearerToken).to.not.be.null;
        expect(data.message.security.bearerToken).to.be.an('string');
    }
}