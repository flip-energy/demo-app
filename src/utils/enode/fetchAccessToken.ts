import { ENODE_OAUTH_TOKEN_URL } from "@/constants";

const fetchAccessToken = async (): Promise<string> => {
  const headers = {
    Authorization:
      "Basic " +
      btoa(`${process.env.ENODE_CLIENT_ID}:${process.env.ENODE_CLIENT_SECRET}`),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const response = await fetch(ENODE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: headers,
    body: "grant_type=client_credentials",
  });

  if (response.ok) {
    const data = await response.json();
    return data.access_token;
  } else {
    const error = new Error(`Enode Access Token: ${response.statusText}`);
    // error.response = response;
    throw error;
  }
};

export default fetchAccessToken;
