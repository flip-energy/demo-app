export async function POST(req: Request) {
  const { path, method, body, headers } = await req.json()

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_FLIP_API_BASE_URL}${path}`,
    { method, body, headers }
  )

  const data = await resp.json()
  return Response.json(data, { status: resp.status })
}
