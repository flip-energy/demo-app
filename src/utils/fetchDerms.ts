async function fetchDerms<T>(
  path: string,
  apiToken: string,
  options?: { body?: any; method?: string }
) {
  const { method = 'GET', body } = options || {}

  if (
    !process.env.NEXT_PUBLIC_FLIP_API_BASE_URL ||
    process.env.NEXT_PUBLIC_FLIP_API_BASE_URL === ''
  ) {
    throw new Error('DERMS API base URL is required')
  }
  if (!apiToken || apiToken === '') {
    throw new Error('API token is required')
  }

  const headers = {
    Authorization: `Bearer ${apiToken}`,
  } as any

  if (body) {
    headers['Content-Type'] = 'application/json'
  }
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_FLIP_API_BASE_URL}/v1${path}`,
    {
      method,
      headers,
      body: body && JSON.stringify(body),
    }
  )
  let response: any | null = null
  if (req.status !== 204) {
    const contentType = req.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      response = await req.json()
    }
  }
  if (!req.ok || req.status >= 400) {
    console.error('fetchDerms failed: ', response)
    const message = response
      ? response?.message || response?.error || 'Unknown error'
      : 'Unknown error'
    throw new Error(message)
  }

  return response
}

export default fetchDerms
