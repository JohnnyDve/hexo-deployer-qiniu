const fs  = require("fs");
const Deployer  = require("./deployer");
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
            queue.push(...traversal(`${src}\\${path}`,cb));
        }
    }
    return queue;
}
module.exports = function(args){
    //参数配置
    if (!args.accessKey || !args.secretKey || !args.zone || !args.scope) {
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
        tokenOptions:{
            scope:args.scope,
            expires:args.expires
        },
        configOptions:{
            zone:args.zone
        }
    });
    //文件遍历
    return Promise.all(traversal(this.public_dir,src=>deployer.upload(src,src.replace(this.public_dir+"\\","").replace(/\\/g,"/"))
        .finally(()=>{
            console.log(src);
        })
    )).then(()=>{
        console.log("upload finish!");
    }).catch(()=>{
        console.log("upload fail!");
    });
}
