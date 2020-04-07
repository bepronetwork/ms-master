import chai from 'chai';
import { mochaAsync, detectValidationErrors } from '../../../utils';
import { editLoadingGifCustomizationApp } from '../../../methods';
const expect = chai.expect;

const image_data = "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+r014GEyDBZ+ApnyU62dyXQTTo1c+is9vr5MyFUnbKYWAl47VPnDfmUKSUpHU71rlHViyxZxYdWVJw487GZTzsxS1B13XehTKejCVucuymILzGzzMqz8NCAX3XS+BZrs1ykLQeEGzNfRLBX5ePiUVh2HX12ekrLClafU2GZDi6uhjLj1LncitZ6DtveDwvaflAKzadRZquVIUpNTmc/X3d9rRiDE4WQyycuq7RelBIWv2Xh7GnaWudgYtIGGAT6C0TevliTEenL5e3ez6Wjo7+nUkZfKEZWq8SfZLmmTMlkczXMt3ocm50krV6xVVy7Nq5YKtzXrVgHOXyteu7et449kbLMwhVakixeunS+fF1T5ZnYDl3rcYtXs9KK4u89iEI9ZutPjMT//xAAiEAACAgMBAAMBAQEBAAAAAAABAgADBBESEAUTIBQwFQb/2gAIAQEAAQIBrasidd9li3fU1rTA+CABda1yF30x1XFnRb7ft+w2vc9iWKTGva1HQzQXRDjSwRyQ6lSgQJxWlShSvPHBrNfHPPOirIQsUAa1rWta1yCt33NaSD2zwIztmvd12luPlpOfCGGl8MaEcleeeaxWoGueeeSnPPPPBVkavhYJr96I1rnnWuSP+n9isPNbC0ZdOR4Y0MHmzCDNa1KggUaAA1rXPPPPJQoUNfCze9zex6RrkDWuQMqZyqTWK0MLaaU213dli2973vfu91RIvog/Gta1yVKlSDOut9Aga1rWgNRms+QOe12SUVQIlfhhAOLb932db3vf42TtIhDddAj861qENGLFm6666SLAOWvfI/qGSltlmVlGaAchtsLHZRFq+gVddht72Pzsne4r/b9odSP8SWNhZ2fre1iRfMz5JXDidCy2yJK6jEr4Bcph2ILGuLiwHoPXfNg79MJPm99BqykWD9mNHNzNZubBWIfsy88AKsHjv9fPP1WGbpw7GsckwTgBbNy2VWfownwHflcQoR/g0cWo6a1yAsQ5zAaYarXWgFKx21qmmzILS2NLolVNYmyljg0X1nXhjeAaEHqFChX873uEOtlfHPPIUDIXUQCPFHH18nGOH/KuL9bV6tQCaPgcD6wenOHdqGEkcheQANaErZGQg+luugTGjArrnkLzfUssQSqvnWljZD5QvFnYYtl2mE/Z0xg/B8WcEGEQALoLr0RGRgQYSzdh1bbRoRrn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";

context('Edit Loading Gif', async () => {
    var app, admin;

    before( async () =>  {
        app = global.test.app;
        admin = global.test.admin;
    });

    it('should be able to edit Loading Gif', mochaAsync(async () => {
        const postData = {
            loadingGif  : image_data,
            app         : app.id
        };

        let res = await editLoadingGifCustomizationApp({...postData, admin: admin.id}, admin.security.bearerToken , {id : admin.id});

        expect(detectValidationErrors(res)).to.be.equal(false);

        const { status } = res.data;
        expect(status).to.be.equal(200);

    }));
});