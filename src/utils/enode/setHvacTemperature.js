import { ENODE_API_BASE_URL } from "@/constants";

const MODE_COOL = 'COOL';
const MODE_HEAT = 'HEAT';
const MODE_OFF = 'OFF';
const MODE_SCHEDULE = 'SCHEDULE';

const buildBody = ({ mode, temperature }) => {
  switch (mode) {
    case MODE_COOL:
      return JSON.stringify({
        coolSetpoint: temperature,
        mode: MODE_COOL,
      });
    case MODE_HEAT:
      return JSON.stringify({
        heatSetpoint: temperature,
        mode: MODE_HEAT,
      });
    case MODE_OFF:
      return JSON.stringify({
        mode: MODE_OFF,
      });
    default:
      return;
  }
}

const setHvacTemperature = async ({ accessToken, deviceId, mode, temperature }) => {
  const holdUrl = `${ENODE_API_BASE_URL}/hvacs/${deviceId}/permanent-hold`;
  const scheduleUrl = `${ENODE_API_BASE_URL}/hvacs/${deviceId}/follow-schedule`;

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(mode === MODE_SCHEDULE ? scheduleUrl : holdUrl, {
    method: 'POST',
    headers: headers,
    body: buildBody({ mode, temperature })
  });

  if (response.ok) {
    return { success: true };
  } else {
    const responseData = await response.json();
    return {
      success: false,
      error: responseData
    }
  };
}

export default setHvacTemperature;
