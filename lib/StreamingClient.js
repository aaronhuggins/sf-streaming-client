const Faye = require('faye')
const { SERVICE_STATE, DEFAULT_VERSION, COMETD, REPLAY } = require('./constants')

class StreamingClient {
  constructor ({
    accessToken,
    instanceUrl,
    name,
    version,
    replay,
    onMessage
  }) {
    if (typeof version === 'undefined' || version === null) {
      version = DEFAULT_VERSION
    }

    const endpoint = [ instanceUrl, COMETD, version ]

    if (replay) {
      endpoint.splice(2, 0, REPLAY)
    }

    this.name = name
    this.messages = []
    this.client = new Faye.Client(endpoint.join('/'), {})

    this.client.setHeader('Authorization', 'OAuth ' + accessToken)

    if (typeof onMessage === 'function') {
      this.onMessage = onMessage.bind(this)
    } else {
      this.onMessage = function onMessage () {}
    }

    this.state = SERVICE_STATE.READY
  }

  subscribe (channelName, onMessage) {
    this.onMessage = onMessage
    this.start(channelName, 0)
  }

  unsubscribe (onStop = () => {}) {
    this.stop(0).then(onStop)
  }

  async start (channelName, timeToLive = 0) {
    if (this.state === SERVICE_STATE.STARTED) return

    this.subscription = this.client.subscribe(channelName, (message) => {
      this.messages.push(message)
      this.onMessage(message)
    })

    await this.subscription

    this.state = SERVICE_STATE.STARTED

    if (timeToLive > 0) {
      this.stop(timeToLive)
    }
  }

  async stop (timeToLive = 0) {
    if (this.state === SERVICE_STATE.STOPPED) return

    if (timeToLive > 0) {
      const _this = this

      return new Promise((resolve) => {
        let timeToLiveMs = timeToLive * 1000
        let timePart = timeToLiveMs / 10
        let timePassed = timePart

        const timeout = setInterval(() => {
          if (timePassed < timeToLiveMs) {
            timePassed += timePart
          } else {
            clearInterval(timeout)
            _this.stop(0).then((messages) => {
              resolve(messages)
            })
          }
        }, timePart)
      })
    }

    if (typeof this.subscription === 'object' && typeof this.subscription.cancel === 'function') {
      await this.subscription.cancel()
    }

    await this.client.disconnect()

    this.state = SERVICE_STATE.STOPPED

    return this.messages
  }

  async restart (channelName, timeToLive = 0) {
    if (this.state === SERVICE_STATE.RESTARTING) return

    this.state = SERVICE_STATE.RESTARTING

    await this.stop()
    await this.start(channelName, timeToLive)
  }

  async receiveMessages ({ channelName, ttl } = {}) {
    if (typeof ttl === 'undefined') ttl = 30

    this.start(channelName, 0)

    return this.stop(ttl)
  }
}

module.exports = {
  StreamingClient
}
