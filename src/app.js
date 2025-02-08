import service from './services';

let headers = { Authorization: "" }
export async function getInitialState() {
  const { token } = await service.MultiFruitApi.login({username: 'dong', password: 'dong'});
  headers.Authorization = token;
  return { name: '你好！' };
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
