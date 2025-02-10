import service from './services';

let headers = { Authorization: "" }
export async function getInitialState() {
  const { token } = await service.MultiFruitApi.login({username: 'dong', password: 'dong'});
  headers.Authorization = token;
  return {
    name: '你好！',
    isMembershipMode: false,     //是否是会员模式
  };
}

export const layout = () => {
  return {
    title: '学习系统',
    logo: 'https://taioassets.oss-cn-beijing.aliyuncs.com/Pics/DongDictionary/icon_indonesia.png',
    menu: {
      locale: false,
    },
  };
};

export const request = {
  timeout: 1000,
  errorConfig: {
    errorHandler(){
    },
    errorThrower(){
    }
  },
  requestInterceptors: [
    (url, options) => ({ url, options: { ...options, headers } })
  ],
  responseInterceptors: []
};
