import { defineConfig } from '@umijs/max';

export default defineConfig({
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
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      layout: true
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

