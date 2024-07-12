import fetchAccessToken from "@/utils/enode/fetchAccessToken";
import fetchDeviceState from "@/utils/enode/fetchDeviceState";

export async function GET(
  req: Request,
  { params }: { params: { deviceId: string } }
) {
  const deviceId = params.deviceId;

  const accessToken = await fetchAccessToken();
  const status = await fetchDeviceState({
    accessToken,
    deviceId,
  });

  return Response.json({ ...status });
}
