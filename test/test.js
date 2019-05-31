const deploy = require("../lib/adapter");
describe('deploy', function() {
    //Options need to be modified before testing
    it('upload success', function(done) {
        deploy.call({
            public_dir:"E:\\blog\\blog\\public"
        },{
            accessKey: "9z7tefG6u5kTJu2ROsWFvAXXXXXXXXXXXXXXXXX",
            secretKey: "tqoc-bdB5K-YVNILQtrgOqXXXXXXXXXXXXXXXXXX",
            zone: "Zone_z2",
            scope: "blog",
            dirsToRefresh:"http://blog.icting.cn/"
        }).then(()=>{
            done();
        }).catch(err=>{
            done(err);
        });
    });
});
