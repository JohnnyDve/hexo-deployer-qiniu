const fs  = require("fs");
const qiniu = require("qiniu");
const pathlib = require("path");
//文件遍历
const traversal = function(src,cb){
    //请求队列
    let queue = [];
    let stat = fs.statSync(src);
    if(stat.isFile()){
        //文件上传
        queue.push(cb(src));
    }else if(stat.isDirectory()){
        for(let path of fs.readdirSync(src)){
            queue.push(...traversal(pathlib.join(src,path),cb));
        }
    }
    return queue;
}
module.exports = class Deployer {
    constructor(options){
        //参数
        this.options = {
            cover:false,
            mac:null,
            accessKey:null,
            secretKey:null,
            dirsToRefresh:[],
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
    createCdnManager(){
        return new qiniu.cdn.CdnManager(this.options.mac);
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
    //部署方法
    deploy(public_dir){
        let cdnManager = this.createCdnManager();
        //文件遍历
        return Promise.all([
        Promise.all(
            //附件上传
            traversal(public_dir,src=>this.upload(src,src.replace(public_dir+"\\","").replace(/\\/g,"/"))
                .finally(()=>{
                    console.log(src);
                })
            )).then(()=>{
            console.log("upload finish!");
        }).catch(()=>{
            console.log("upload fail!");
        }),
        //目录刷新
        new Promise((resolve, reject) => {
            console.log(this.options.dirsToRefresh);
            cdnManager.refreshDirs(this.options.dirsToRefresh,(respErr,respBody, respInfo)=>{
                if (respInfo.statusCode == 200) {
                    resolve(respErr,respBody, respInfo);
                } else {
                    reject(respErr,respBody, respInfo);
                }
            });
        }).then(()=>{
            console.log("refresh finish!");
        }).catch(()=>{
            console.log("refresh fail!");
        })]);
    }
    //上传方法
    upload(src,key,tokenOptions,configOptions){
        //cover 覆盖上传
        let uploadToken = this.createToken(Object.assign({},this.options.tokenOptions,tokenOptions,this.options.cover?{scope:this.options.tokenOptions.scope+":"+key}:{}));
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
