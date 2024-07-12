import fetchAccessToken from "@/utils/enode/fetchAccessToken";
import fetchLinkState from "@/utils/enode/fetchLinkState";
import { ENODE_LINK_BASE_URL } from "@/constants";
import { getServerUser } from "@/utils";

export async function GET(req: Request) {
  const { user } = await getServerUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const redirectUri = searchParams.get("redirect_uri") || "about:blank";
  const vendorType = searchParams.get("device_type") || "battery";

  const accessToken = await fetchAccessToken();
  const linkState = await fetchLinkState({
    accessToken,
    userId: user.id,
    vendorType,
  });
  if (!linkState) {
    return Response.json(
      { error: "Failed to fetch link state" },
      { status: 500 }
    );
  }
  const link = `${ENODE_LINK_BASE_URL}?link_state=${encodeURIComponent(
    linkState
  )}&requested_scope=all&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return Response.json({ link });
}
