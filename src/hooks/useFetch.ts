import { HttpManager, fakeController } from '../utils';

const useFetch = () => {
  const API = HttpManager.getInstance({
    baseURL: 'http://localhost:3000',
  });

  const getData = async (endpoint: string, params = null) => {
    const res = await API.get(endpoint, { params });
    return res?.data;
  };

  const postData = async (endpoint: string, reqData: any) => {
    const res = await fakeController(endpoint, reqData);
    return res?.data;
  };

  return {
    getData,
    postData,
  };
};

export default useFetch;