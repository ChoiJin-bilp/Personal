// current use server
const ACTIVE_SERVER = 'official'; // 当前使用的服务器
// all servers
const ALL_SERVERS = {
  // 1-1. 正式服务器
  official: {
    portalServer: 'http://192.168.32.85:18087/els-cqm',
    gxtServer: 'http://192.168.32.85:18087/els-cqm',
    baseServer: 'http://192.168.32.85:18087/els-cqm',
  },
  // 1-2. 测试服务器
  localhost: {
    portalServer: 'http://192.168.32.36:9009/els-cqm',
    gxtServer: 'http://192.168.32.36:9009/els-cqm',
    baseServer: 'http://192.168.32.36:9009/els-cqm',
  },
  // 1-3. 稳定服务器
  stable: {
    portalServer: 'http://192.168.32.44:8091/els-cqm',
    gxtServer: 'http://192.168.32.44:8091/els-cqm',
    baseServer: 'http://192.168.32.44:8091/els-cqm',
  },
};

window.SYSTEM_CONFIG = {
  portalServer: ALL_SERVERS[ACTIVE_SERVER].portalServer, // 门户服务器地址
  gxtServer: ALL_SERVERS[ACTIVE_SERVER].gxtServer, // 业务服务器地址
  baseServer: ALL_SERVERS[ACTIVE_SERVER].baseServer, // 登录服务器地址
};
