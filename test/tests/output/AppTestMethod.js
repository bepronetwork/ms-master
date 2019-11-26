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
        expect(data.status).to.equal(200);
        expect(data.message.app).to.have.property('bearerToken');
    }
}