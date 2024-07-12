const fetchApi = async (path: string, options: any = {}) => {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api${path}`,
      options
    )
    const contentType = request.headers.get('content-type')
    let response = null

    if (contentType && contentType.includes('application/json')) {
      response = await request.json()
    }

    const error = request.ok
      ? null
      : request.status === 404
      ? { error: 'Not found' }
      : response || { error: `${request.status} error` }
    return { data: error ? null : response, error }
  } catch (error: any) {
    return { data: null, error: { error: error.message } }
  }
}

export default fetchApi

const fetchDermsApiWrapper = async (
  fetcher: (path: string, options: any) => Promise<any>,
  path: string,
  method: string = 'GET',
  body?: any
) => {
  return await fetcher(`/derms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path, method, body }),
  })
}

const fetchDermsApi = async (
  path: string,
  method: string = 'GET',
  body?: any
) => {
  return await fetchDermsApiWrapper(fetchApi, path, method, body)
}

export { fetchDermsApi, fetchDermsApiWrapper }
