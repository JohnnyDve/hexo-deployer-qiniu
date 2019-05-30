const Deployer  = require("./deployer");
module.exports = function(args){
    //参数配置
    if (!args.accessKey || !args.secretKey || !args.zone || !args.scope|| !args.dirsToRefresh) {
       console.log(`You should configure deployment settings in _config.yml first!\n\n
        Example:\n
          deploy:\n
            type: qiniu\n
            accessKey: <accessKey>\n
            secretKey: <secretKey>\n
            zone: <zone>\n
            scope: <scope>\n
            expires: [expires]\n
            cover: [true|false]\n
        For more help, you can check the docs: ' http://hexo.io/docs/deployment.html'`);
        return;
    }
    //文件上传
    let deployer = new Deployer({
        cover:true,
        accessKey:args.accessKey,
        secretKey:args.secretKey,
        dirsToRefresh:args.dirsToRefresh.split(","),
        tokenOptions:{
            scope:args.scope,
            expires:args.expires
        },
        configOptions:{
            zone:args.zone
        }
    });
    return deployer.deploy(this.public_dir);
}
