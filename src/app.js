export async function getInitialState() {
  return {
    name: '你好！',
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
    errorHandler(error){
      console.error('请求错误:', error);
      // 可以根据后端返回的状态码进行不同的处理
      if (error?.response?.status === 401) {
        console.warn('未授权，请重新登录');
      }
    },
    errorThrower(response){
      if (!response.success) {
        throw new Error(response.message || '请求失败');
      }
    }
  },
  requestInterceptors: [
    (url, options) => {
      const token = localStorage.getItem('token') || '';
      const headers = { Authorization: token }
      return { url, options: { ...options, headers } }
    }
  ],
  responseInterceptors: []
};
