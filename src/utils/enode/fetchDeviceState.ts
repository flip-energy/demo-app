import { ENODE_API_BASE_URL } from "@/constants";

interface FuncProps {
  accessToken: string;
  deviceId: string;
  deviceType?: string;
}

const fetchDeviceState = async ({
  accessToken,
  deviceId,
  deviceType = "batteries",
}: FuncProps) => {
  const url = `${ENODE_API_BASE_URL}/${deviceType}/${deviceId}`;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const responseData = await response.json();
  return { data: responseData, status: response.status };
};

export default fetchDeviceState;
