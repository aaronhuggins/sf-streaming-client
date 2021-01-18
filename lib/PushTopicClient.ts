import { OnMessage, OnStop, StreamingClientOptions } from './constants'
import { StreamingClient } from './StreamingClient'

export class PushTopicClient {
  constructor ({
    accessToken,
    instanceUrl,
    name,
    version,
    onMessage
  }: StreamingClientOptions) {
    this.client = new StreamingClient({
      name,
      accessToken,
      instanceUrl,
      version,
      onMessage
    })

    this.channelName = '/topic/' + this.client.name
  }

  client: StreamingClient
  channelName: string

  subscribe (onMessage: OnMessage): void {
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
