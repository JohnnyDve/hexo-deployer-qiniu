const deploy = require("../lib/adapter");
describe('deploy', function() {
    //Options need to be modified before testing
    it('upload success', function(done) {
        deploy.call({
            public_dir:"E:\\repository\\hexo-deployer-qiniu\\test"
        },{
            accessKey: "9z7tefG6u5kTJu2ROsWXXXXXXXXXXXXXXXXXXXX",
            secretKey: "tqoc-bdB5K-YVNILQtrgXXXXXXXXXXXXXXXXXXXX",
            zone: "Zone_z2",
            scope: "blog"
        }).then(()=>{
            done();
        }).catch(err=>{
            done(err);
        });
    });
});
