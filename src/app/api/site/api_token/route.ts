import { fetchDerms } from '@/utils'

export async function POST(req: Request) {
  const { site_id } = await req.json()

  if (!site_id) {
    return Response.json({ error: 'site_id is required' }, { status: 400 })
  }

  try {
    const data = await fetchDerms(
      `/auth/site/${site_id}`,
      process.env.FLIP_API_TOKEN!,
      {
        method: 'POST',
      }
    )
    return Response.json(data, { status: 200 })
  } catch (error: any) {
    console.error(error)
    return Response.json({ message: error.message }, { status: 400 })
  }
}
