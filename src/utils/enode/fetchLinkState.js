import { ENODE_API_BASE_URL } from '@/constants';

const fetchLinkState = async ({ vendorType, userId, accessToken }) => {
  const url = `${ENODE_API_BASE_URL}/users/${userId}/link`;

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  const data = { vendorType };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  const responseData = await response.json();

  if (!response.ok) {
    console.error('Failed to fetch link state', responseData);
    return null;
  }

  return responseData.linkState;
};

export default fetchLinkState;
