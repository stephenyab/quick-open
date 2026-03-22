/**
 * WebDAV 配置模块
 * 定义 WebDAV 远程备份相关的配置字段
 */

/** WebDAV 配置存储前缀 */
export const WEB_DAV_FIELD_PREFIX = 'webDav/config/'

/** WebDAV 配置字段定义 */
export const WEB_DAV_FIELD_CONFIG = [
    {key: 'webDavUrl', title: 'WebDav 服务器地址'},
    {key: 'webDavAccount', title: 'WebDav 账号'},
    {key: 'webDavPassword', title: 'WebDav 密码'},
    {key: 'webDavSubFolder', title: '子文件夹'},
]
