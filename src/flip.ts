import FlipSiteAPIClient, {
  SiteAccessTokenFetchResponse,
} from '@/flip-api/client'

const siteAccessTokenFetcher = async (
  siteId: string
): Promise<SiteAccessTokenFetchResponse> => {
  const req = await fetch(`/api/site/api_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ site_id: siteId }),
  })
  const data = await req.json()
  if (!req.ok || req.status >= 400) {
    throw new Error('Error fetching site access token: ' + data.message)
  }
  return data
}

export const flip = new FlipSiteAPIClient({
  baseURL: process.env.NEXT_PUBLIC_FLIP_API_BASE_URL!,
  siteAccessTokenFetcher,
})
