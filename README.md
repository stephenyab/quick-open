# Vue Quick Open

一个基于 Vue 3 的 uTools 插件，用于快速打开文件/文件夹或执行 Shell 脚本。

## 功能特性

- **快捷打开**: 通过自定义关键字快速打开指定的文件或文件夹
- **脚本执行**: 通过关键字执行预设的 Shell 命令
- **数据管理**: 提供图形化界面来添加、编辑和删除快捷方式
- **备份恢复**: 支持 WebDAV 远程备份和本地备份
- **跨设备同步**: 通过 WebDAV 实现多设备间数据同步

## 技术栈

- Vue 3 (Composition API)
- Vuetify 3 (UI 组件库)
- uTools API (插件框架)
- WebDAV 客户端 (数据同步)

## 安装与使用

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 在 uTools 中使用

1. 将插件添加到 uTools
2. 在 uTools 中打开插件设置
3. 添加快捷方式：
   - 类型选择"文件/文件夹"用于打开文件或文件夹
   - 类型选择"Shell 脚本"用于执行命令
4. 设置关键字并保存
5. 通过关键字快速调用功能

## 功能说明

### 列表管理
- 添加、编辑、删除快捷方式
- 支持两种类型：
  - 文件/文件夹：直接打开指定路径
  - Shell 脚本：执行指定命令（支持多行命令）

### 备份与恢复
- **远端备份**：通过 WebDAV 协议将数据备份到远程服务器
- **本地备份**：将数据备份到本地指定路径
- 支持从备份文件恢复数据

### WebDAV 设置
1. 配置 WebDAV 服务器地址
2. 输入账号和密码
3. 设置子文件夹（可选）

### 本地备份设置
设置本地备份文件夹路径

## 项目结构

```
src/
├── App.vue              # 主应用组件
├── main.js              # 应用入口
├── config/              # 配置文件
│   ├── webDavConfig.js  # WebDAV 配置
│   └── localConfig.js   # 本地配置
├── plugins/             # 插件配置
│   └── vuetify.js       # Vuetify 配置
├── util/                # 工具函数
│   ├── commonUtil.js    # 通用工具函数
│   ├── utoolsUtil.js    # uTools API 封装
│   └── webDavUtil.js    # WebDAV 客户端封装
└── views/               # 页面视图
    ├── list.vue         # 列表管理页面
    └── setting.vue      # 设置页面
```

## 许可证

本项目采用 MIT 许可证授权。