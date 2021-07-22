# jianzhibao
- 2021/05/12
更改了RCTCxxBridge.mm  623行
(void)_initModules:(NSArray<id<RCTBridgeModule>> *)modules
(void)_initModules:(NSArray<Class> *)modules

## 目录结构

```bash
├── android                             # 安卓原生代码
├── ios                                 # ios原生代码
├── ios证书                              # ios打包证书
├── app                                 # 业务源代码
│   ├── assembly                        # 组件
│   ├── config                          # 主题 字体等静态资源
│   ├── ├── navigator                   # 配置路由
│   ├── └── theme                       # 主题样式配置
│   ├── components                      # 公共组件
│   ├── pages                           # 公共组件
│   ├── ├── HomeFragment                # 首页
│   ├── └── idCard                      # 身份证上传
│   └── resource               
├── node_modules                        # 依赖组件，不可随意替换
├── Configuration                       # 配置文件，用来更改接口地址
└── package.json                        # package.json
```
- 各个页面的备注在组件顶部有备注