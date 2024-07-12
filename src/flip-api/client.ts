import {
  Device,
  DeviceType,
  DeviceUpdate,
  Enrollment,
  EnrollmentCreate,
  Event,
  EventUpdate,
  Program,
  Site,
} from './types'

type ConstructorParameters = {
  baseURL: string
  siteAccessToken?: string
  siteAccessTokenFetcher?: (
    siteId: string
  ) => Promise<SiteAccessTokenFetchResponse>
  siteId?: string
  tokenExpiresAt?: string
}

export type SiteAccessTokenFetchResponse = {
  site_access_token: string
  expires_at: string
}

const API_PREFIX = '/v1/site'

export default class FlipSiteAPIClient {
  private readonly baseURL: string
  private siteAccessToken: string | undefined
  private siteAccessTokenFetcher:
    | ((siteId: string) => Promise<SiteAccessTokenFetchResponse>)
    | undefined
  private siteId: string | undefined
  private tokenExpiresAt: Date | undefined

  private requestCache: Record<string, Promise<any>> = {}

  constructor({
    baseURL,
    siteAccessToken,
    siteAccessTokenFetcher,
    siteId,
    tokenExpiresAt,
  }: ConstructorParameters) {
    if (!baseURL)
      throw new Error('A base URL is required to initialize the API client.')

    this.baseURL = baseURL
    this.siteAccessToken = siteAccessToken
    this.siteAccessTokenFetcher = siteAccessTokenFetcher
    this.siteId = siteId
    this.tokenExpiresAt = tokenExpiresAt ? new Date(tokenExpiresAt) : undefined
  }

  private createCacheKey(path: string, config?: RequestInit): string {
    return `path:${path}.config:${JSON.stringify(config)}`
  }

  private async request<T>(path: string, config?: RequestInit): Promise<T> {
    try {
      const cacheKey = this.createCacheKey(path, config)
      if (this.requestCache.hasOwnProperty(cacheKey)) {
        // Return the ongoing request promise if it exists
        return this.requestCache[cacheKey]
      }

      if (!config) {
        config = {}
      }

      if (!this.siteId)
        throw new Error('A site ID is required to make API requests.')

      if (
        (!this.siteAccessToken ||
          (this.tokenExpiresAt && this.tokenExpiresAt < new Date())) &&
        this.siteAccessTokenFetcher
      ) {
        const { site_access_token, expires_at } =
          await this.siteAccessTokenFetcher(this.siteId)
        this.setSiteAccessToken(site_access_token, expires_at)
      }

      if (!this.siteAccessToken)
        throw new Error('A site access token is required to make API requests.')

      if (this.tokenExpiresAt && this.tokenExpiresAt < new Date())
        throw new Error('The site access token has expired.')

      const headers = (config.headers || {}) as Record<string, string>
      headers.Authorization = `Bearer ${this.siteAccessToken}`
      headers['Content-Type'] = 'application/json'
      config.headers = headers

      const requestPromise = (async () => {
        const response = await fetch(
          `${this.baseURL}${API_PREFIX}/${this.siteId}${path}`,
          config
        )
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }
        return response.status !== 204 ? response.json() : null
      })()

      // Store the request promise in the cache
      this.requestCache[cacheKey] = requestPromise

      // Ensure the cache is cleared once the request is completed
      requestPromise.finally(() => {
        delete this.requestCache[cacheKey]
      })

      return requestPromise
    } catch (error: any) {
      throw new Error(`API request failed: ${error.message}`)
    }
  }

  private async get<T>(path: string): Promise<T> {
    const config: RequestInit = {
      method: 'GET',
    }

    return this.request<T>(path, config)
  }

  private async post<T>(path: string, body: any): Promise<T> {
    const config: RequestInit = {
      method: 'POST',
      body: JSON.stringify(body),
    }

    return this.request<T>(path, config)
  }

  private async patch<T>(path: string, body: any): Promise<T> {
    const config: RequestInit = {
      method: 'PATCH',
      body: JSON.stringify(body),
    }

    return this.request<T>(path, config)
  }

  private async delete<T>(path: string): Promise<T> {
    const config: RequestInit = {
      method: 'DELETE',
    }

    return this.request<T>(path, config)
  }

  // Public methods

  // Set the site ID to be used in API requests
  public setSiteId(siteId: string): void {
    this.siteId = siteId
  }

  // Set the site access token and expiry
  public setSiteAccessToken(token: string, expiresAt: string): void {
    this.siteAccessToken = token
    this.tokenExpiresAt = new Date(expiresAt)
  }

  // GET /v1/site/{siteId}/devices
  public async getDevices(): Promise<Device[]> {
    return this.get<Device[]>('/devices')
  }

  // GET /v1/site/{siteId}/device/{deviceId}
  public async getDevice(id: string): Promise<Device> {
    return this.get<Device>(`/device/${id}`)
  }

  // PATCH /v1/site/{siteId}/device/{deviceId}
  public async updateDevice(id: string, device: DeviceUpdate): Promise<Device> {
    return this.patch<Device>(`/device/${id}`, device)
  }

  // POST /v1/site/{siteId}/enrollments
  public async createEnrollment(
    enrollment: EnrollmentCreate
  ): Promise<Enrollment> {
    return this.post<Enrollment>('/enrollments', enrollment)
  }

  // GET /v1/site/{siteId}/enrollments
  public async getEnrollments(): Promise<Enrollment[]> {
    return this.get<Enrollment[]>('/enrollments')
  }

  // GET /v1/site/{siteId}/enrollment/{enrollmentId}
  public async getEnrollment(id: string): Promise<Enrollment> {
    return this.get<Enrollment>(`/enrollment/${id}`)
  }

  // DELETE /v1/site/{siteId}/enrollment/{enrollmentId}
  public async deleteEnrollment(id: string): Promise<void> {
    return this.delete<void>(`/enrollment/${id}`)
  }

  // GET /v1/site/{siteId}/events
  public async getEvents(): Promise<Event[]> {
    return this.get<Event[]>('/events')
  }

  // GET /v1/site/{siteId}/event/{eventId}
  public async getEvent(id: string): Promise<Event> {
    return this.get<Event>(`/event/${id}`)
  }

  // PATCH /v1/site/{siteId}/event/{eventId}
  public async updateEvent(id: string, event: EventUpdate): Promise<Event> {
    return this.patch<Event>(`/event/${id}`, event)
  }

  // GET /v1/site/{siteId}/programs
  public async getPrograms({
    deviceType,
    zipCode,
  }: {
    deviceType: DeviceType
    zipCode: string
  }): Promise<Program[]> {
    return this.get<Program[]>(
      `/programs?zip_code=${zipCode}&device_type=${deviceType}`
    )
  }

  // GET /v1/site/{siteId}/program/{programId}
  public async getProgram(id: string): Promise<Program> {
    return this.get<Program>(`/program/${id}`)
  }

  // GET /v1/site/{siteId}
  public async getSite(): Promise<Site> {
    return this.get<Site>('')
  }

  // PATCH /v1/site/{siteId}
  public async updateSite(site: Site): Promise<Site> {
    return this.patch<Site>('', site)
  }
}
