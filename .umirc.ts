import { defineConfig } from '@umijs/max';

export default defineConfig({
  history: { type: 'hash' },
  hash: true,  //让 build 之后的产物包含 hash 后缀, 避免浏览器加载缓存
  esbuildMinifyIIFE: true,
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {},
  outputPath: 'ptdchatbot.cn',
  routes: [
    {
      path: '/',
      redirect: '/AIHome',
    },
    {
      name: 'AI主页',
      path: '/AIHome',
      component: './AIHome',
      layout: false
    },
    {
      name: 'AI对话',
      path: '/AIDialogue',
      component: './AIDialogue',
      layout: false
    },
    {
      name: '单词卡',
      path: '/access',
      component: './Access',
    },
    {
      name: '翻译',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'pnpm',
});

