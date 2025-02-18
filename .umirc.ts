import { defineConfig } from '@umijs/max';

export default defineConfig({
  history: { type: 'hash' },
  hash: true,  //让 build 之后的产物包含 hash 后缀, 避免浏览器加载缓存
  esbuildMinifyIIFE: true,
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: ''
  },
  layout: {

  },
  outputPath: 'ptdchatbot.cn',
  proxy: {
    '/prod-api': {
      'target': 'http://damin.portuguesa.cn/prod-api',
      'changeOrigin': true,
      'pathRewrite': { '^/prod-api' : '' },
    }
  },
  routes: [
    { path: '/', redirect: '/AIHome' },
    { name: '小曼同学', path: '/AIHome', component: './AIHome', layout: true },
    { name: '小曼同学', path: '/AIDialogue', component: './AIDialogue', layout: false },

    { name: '印尼语东仔', path: '/Login', component: './Login', layout: true},
    { name: '印尼语东仔', path: '/MultiFruit', component: './MultiFruit', layout: false },
  ],
  npmClient: 'pnpm',
});

