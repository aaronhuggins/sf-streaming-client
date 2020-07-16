# sf-streaming-client

A client implementation for [Salesforce Streaming API](https://developer.salesforce.com/docs/atlas.en-us.api_streaming.meta/api_streaming/intro_stream.htm) built on top of [Faye](https://faye.jcoglan.com/).

## Architecture

The client has been designed as a service state-mchine that can be started, stopped, and restarted. The client also provides a convenience method called `receiveMessages` which will return a promise which fulfills with the results of listening for a period of time.

The client constructor also optionally takes an argument of `onMessage` as a callback function for each message.

The `onMessage` callback can also be provided when subscribing; `subscribe` sets a callback for each message and calls `start`, and `unsubscribe` calls `stop`. These methods return void, as they are intended for use in scenarios which require callbacks.

## Example

The following code sample demonstrates listening for messages in a specific window of time and returning the result. The library can listen for an unlimited amount of time,

```js
const util = require('util')
let getToken = require('salesforce-jwt-bearer-token-flow').getToken
getToken = util.promisify(getToken)
const { PushTopicClient } = require('./index')

async function main () {
  const jwt = await getToken({
    iss: '...',
    sub: '...',
    aud: 'https://login.salesforce.com',
    privateKey: '...'
  })
  const topic = new PushTopicClient({
    name: 'SomePushTopic',
    accessToken: jwt.access_token,
    instanceUrl: jwt.instance_url
  })

  const messages = await topic.receiveMessages({ ttl: 60 })

  console.log(messages)
}

main()

```

## API

See [the typescript definition](./index.d.ts) for more details.

