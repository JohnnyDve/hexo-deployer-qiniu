const qiniu = require("qiniu");
module.exports = class Deployer {
    constructor(options){
        //参数
        this.options = {
            cover:false,
            accessKey:null,
            secretKey:null,
            mac:null,
            tokenOptions:{
                scope:null
            },
            configOptions:{
                zone:null
            }
        };
        //设置参数
        Object.assign(this.options,options);
        this.options.mac = new qiniu.auth.digest.Mac(options.accessKey, options.secretKey);
        this.options.configOptions.zone = qiniu.zone[options.configOptions.zone];
    }
    //构建token
    createToken(options){
       return new qiniu.rs.PutPolicy(options).uploadToken(this.options.mac);
    }
    //构建配置类
    createConfig(options){
        let config = new qiniu.conf.Config();
        return Object.assign(config,options);
    }
    //上传方法
    upload(src,key,cover,tokenOptions,configOptions){
        //cover 覆盖上传
        let uploadToken = this.createToken(Object.assign({},this.options.tokenOptions,tokenOptions,cover?{scope:this.options.tokenOptions.scope+":"+key}:{}));
        let formUploader = new qiniu.form_up.FormUploader(this.createConfig(Object.assign({},this.options.configOptions,configOptions)));
        let putExtra = new qiniu.form_up.PutExtra();
        return new Promise((resolve, reject) => {
            formUploader.putFile(uploadToken, key, src, putExtra,(respErr,respBody, respInfo)=>{
                if (respInfo.statusCode == 200) {
                    resolve(respErr,respBody, respInfo);
                } else {
                    reject(respErr,respBody, respInfo);
                }
            });
        });
    }
};