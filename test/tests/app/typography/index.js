import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { editTypographyApp, getAppAuth } from '../../../methods';
import { get_app } from '../../../models/apps';
const expect = chai.expect;

context('Edit Typography', async () => {
    var app;

    before( async () =>  {
        app = global.test.app;
    });


    it('should be able to edit app typography', mochaAsync(async () => {

        const postData = {
            typography : [
                {
                    "local"  : [
                        "Open Sans Regular",
                        "OpenSans-Regular"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem8YaGs126MiZpBA-UFWJ0bf8pkAp6a.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Regular",
                        "OpenSans-Regular"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem8YaGs126MiZpBA-UFUZ0bf8pkAp6a.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Regular",
                        "OpenSans-Regular"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem8YaGs126MiZpBA-UFWZ0bf8pkAp6a.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Regular",
                        "OpenSans-Regular"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem8YaGs126MiZpBA-UFVp0bf8pkAp6a.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Regular",
                        "OpenSans-Regular"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem8YaGs126MiZpBA-UFWp0bf8pkAp6a.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Regular",
                        "OpenSans-Regular"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem8YaGs126MiZpBA-UFW50bf8pkAp6a.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Regular",
                        "OpenSans-Regular"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem8YaGs126MiZpBA-UFVZ0bf8pkAg.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans SemiBold",
                        "OpenSans-SemiBold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UNirkOX-hpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans SemiBold",
                        "OpenSans-SemiBold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UNirkOVuhpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans SemiBold",
                        "OpenSans-SemiBold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UNirkOXuhpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans SemiBold",
                        "OpenSans-SemiBold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UNirkOUehpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans SemiBold",
                        "OpenSans-SemiBold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UNirkOXehpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans SemiBold",
                        "OpenSans-SemiBold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UNirkOXOhpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans SemiBold",
                        "OpenSans-SemiBold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Bold",
                        "OpenSans-Bold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UN7rgOX-hpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Bold",
                        "OpenSans-Bold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UN7rgOVuhpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Bold",
                        "OpenSans-Bold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UN7rgOXuhpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Bold",
                        "OpenSans-Bold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UN7rgOUehpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local"  : [
                        "Open Sans Bold",
                        "OpenSans-Bold"
                    ],
                    "url"    : "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UN7rgOXehpKKSTj5PW.woff2",
                    "format" : "woff2"
                },
                {
                    "local": [
                        "Open Sans Bold",
                        "OpenSans-Bold"
                    ],
                    "url": "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UN7rgOXOhpKKSTj5PW.woff2",
                    "format": "woff2"
                },
                {
                    "local": [
                        "Open Sans Bold",
                        "OpenSans-Bold"
                    ],
                    "url": "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UN7rgOUuhpKKSTjw.woff2",
                    "format": "woff2"
                }
            ],
            app : app.id
        };

        // console.log ("PostData: ", postData);
        // console.log ("App Bearer: ", app.bearerToken);
        // console.log ("Id: ", app.id);
        let res = await editTypographyApp(postData, app.bearerToken , {id : app.id});
        console.log ("Typography: ", res);

        expect(detectValidationErrors(res)).to.be.equal(false);

        const { status } = res.data;
        expect(status).to.be.equal(200);
    }));
});
