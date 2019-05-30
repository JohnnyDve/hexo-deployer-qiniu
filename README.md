# hexo-deployer-qiniu
Hexo`s Qiniu deployment plug-in
# Installation
$ npm install hexo-deployer-qiniu --save
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
           expires: [expires] # default is 3600
           cover: [true|false] # default is true
```
- **accessKey:** account  accessKey
- **secretKey:** account secretKey
- **zone:** computer room corresponding to bucket
    - 华东 Zone_z0
    - 华北 Zone_z1
    - 华南 Zone_z2
    - 北美 Zone_na0
- **scope:** bucket name
- **expires:** the expiration time for uploading tokens
- **cover:** overlay upload


# License
MIT
