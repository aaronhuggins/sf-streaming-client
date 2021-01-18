import { OnMessage, OnStop, StreamingClientOptions } from './constants'
import { StreamingClient } from './StreamingClient'

export class ChannelClient {
  constructor ({
    accessToken,
    instanceUrl,
    name,
    version,
    onMessage
  }: StreamingClientOptions) {
    let replay = name.indexOf('/u/') === 0

    this.client = new StreamingClient({
      name,
      accessToken,
      instanceUrl,
      version,
      replay,
      onMessage
    })

    this.channelName = this.client.name
  }

  client: StreamingClient
  channelName: string

  subscribe(onMessage: OnMessage) {
    this.client.subscribe(this.channelName, onMessage)
  }

  unsubscribe (onStop?: OnStop): void {
    this.client.unsubscribe(onStop)
  }

  async start (timeToLive: number = 0) {
    return await this.client.start(this.channelName, timeToLive)
  }

  async restart (timeToLive: number = 0) {
    return await this.client.restart(this.channelName, timeToLive)
  }

  async receiveMessages(options: { ttl?: number } = {}) {
    return await this.client.receiveMessages({ channelName: this.channelName, ttl: options.ttl })
  }
}
