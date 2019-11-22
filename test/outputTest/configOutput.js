const fs = require('fs');

module.exports = {
    async saveOutputTest(nameFolder, nameFile, value) {

        if (!fs.existsSync(`test/outputTest/output/${nameFolder}`)) {
            fs.mkdirSync(`test/outputTest/output/${nameFolder}`);
        } else {
            fs.writeFile(`test/outputTest/output/${nameFolder}/${nameFile}.json`, JSON.stringify(value), function (err) {
                if (err) throw err;
            });
        };
    }

}