import Footer from '@/components/Footer';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState() {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    title: '小曼同学',
    logo: './favicon.png',
    menu: {
      locale: false,
    },
  };
};
