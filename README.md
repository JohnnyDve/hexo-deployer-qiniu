# hexo-deployer-qiniu
Hexo`s Qiniu deployment plug-in
# Installation
$ npm install hexo-deployer-qinius --save
# Options
You can configure this plugin in _config.yml.
``` yaml
    # You can use this:
    deploy:
           type: qiniu
           accessKey: <accessKey>
           secretKey: <secretKey>
           zone: <zone>
           scope: <scope>
           # example http://www.a.com/,http://www.b.cn/
           dirsToRefresh: <dirsToRefresh> 
           # default is 3600
           expires: [expires]
           # default is true
           cover: [true|false]
```
- **accessKey:** account  accessKey
- **secretKey:** account secretKey
- **zone:** computer room corresponding to bucket
    - 华东 Zone_z0
    - 华北 Zone_z1
    - 华南 Zone_z2
    - 北美 Zone_na0
- **scope:** bucket name
- **dirsToRefresh:** cdn fresh dirs
- **expires:** the expiration time for uploading tokens
- **cover:** overlay upload


# License
MIT
