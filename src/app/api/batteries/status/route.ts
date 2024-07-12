import { getServerUser } from "@/utils";
import fetchAccessToken from "@/utils/enode/fetchAccessToken";
import fetchDeviceState from "@/utils/enode/fetchDeviceState";

export async function GET(req: Request) {
  const { supabase, user } = await getServerUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data: batteryRef, error } = await supabase
    .from("batteries")
    .select("enode_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (error || !batteryRef || !batteryRef.enode_id)
    return Response.json({ error: "No battery found" }, { status: 404 });

  const accessToken = await fetchAccessToken();
  const status = await fetchDeviceState({
    accessToken,
    deviceId: batteryRef.enode_id,
  });
  return Response.json(status);
}
