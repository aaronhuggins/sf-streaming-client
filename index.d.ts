declare module 'sf-streaming-api' {
  type ServiceState = 'READY' | 'STARTED' | 'STOPPED' | 'RESTARTING' | 'UNDEFINED'

  const Constants: {
    COMETD: 'cometd'
    DEFAULT_VERSION: '49.0'
    REPLAY: 'replay'
    SERVICE_STATE: {
      [string: ServiceState]: ServiceState
      READY: 'READY'
      STARTED: 'STARTED'
      STOPPED: 'STOPPED'
      RESTARTING: 'RESTARTING'
      UNDEFINED: 'UNDEFINED'
    }
  }

  class StreamingClient {
    constructor (options: {
      accessToken: string
      instanceUrl: string
      name: string
      version: string
      replay: boolean
      onMessage: (message: any) => void
    })

    subscribe (channelName: string, onMessage: (message: any) => void): void
    unsubscribe (onStop?: (messages: any[]) => void): void

    start (channelName: string, timeToLive: number = 0): Promise<void>
    stop (timeToLive: number = 0): Promise<any[]>
    restart (channelName: string, timeToLive: number = 0): Promise<void>
    receiveMessages (options: { channelName: string, ttl: number } = {}): Promise<any[]>

    name: string
    state: ServiceState
    messages: any[]
  }

  class ChannelClient extends StreamingClient {
    constructor (options: {
      accessToken: string
      instanceUrl: string
      name: string
      version: string
      onMessage: (message: any) => void
    })

    subscribe (onMessage: (message: any) => void): void

    start (timeToLive: number = 0): Promise<void>
    restart (timeToLive: number = 0): Promise<void>
    receiveMessages (options: { ttl: number } = {}): Promise<any[]>

    channelName: string
  }

  class PushTopicClient extends StreamingClient {
    constructor (options: {
      accessToken: string
      instanceUrl: string
      name: string
      version: string
      onMessage: (message: any) => void
    })

    subscribe (onMessage: (message: any) => void): void

    start (timeToLive: number = 0): Promise<void>
    restart (timeToLive: number = 0): Promise<void>
    receiveMessages (options: { ttl: number } = {}): Promise<any[]>

    channelName: string
  }

  exports = {
    Constants,
    StreamingClient,
    ChannelClient,
    PushTopicClient
  }
}
