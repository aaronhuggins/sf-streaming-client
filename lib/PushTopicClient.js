const { StreamingClient } = require('./StreamingClient')

class PushTopicClient extends StreamingClient {
  constructor ({
    accessToken,
    instanceUrl,
    name,
    version,
    onMessage
  }) {
    super({
      name,
      accessToken,
      instanceUrl,
      version,
      onMessage
    })

    this.channelName = '/topic/' + this.name
  }

  subscribe(onMessage) {
    super.subscribe(this.channelName, onMessage)
  }

  async start (timeToLive = 0) {
    return await super.start(this.channelName, timeToLive)
  }

  async restart (timeToLive = 0) {
    return await super.restart(this.channelName, timeToLive)
  }

  async receiveMessages({ ttl } = {}) {
    return await super.receiveMessages({ channelName: this.channelName, ttl })
  }
}

module.exports = {
  PushTopicClient
}
