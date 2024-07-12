import { cookies } from "next/headers";
import fetchApi, { fetchDermsApiWrapper } from "./fetchApi";

const fetchServerApi = async (path: string, options?: any) => {
  const cookieStore = cookies();
  const ckies = cookieStore.getAll().reduce((acc, cookie) => {
    return acc + cookie.name + "=" + cookie.value + "; ";
  }, "");

  return await fetchApi(path, {
    ...options,
    headers: {
      Cookie: ckies,
      ...options?.headers,
    },
  });
};

export default fetchServerApi;

const fetchDermsViaServer = async (
  path: string,
  method: string = "GET",
  body?: any
) => {
  return await fetchDermsApiWrapper(fetchServerApi, path, method, body);
};

export { fetchDermsViaServer };
