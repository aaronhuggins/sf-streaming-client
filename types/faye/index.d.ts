declare module 'faye' {
  export interface Subscription extends PromiseLike<any> {
    cancel (): Promise<void>
  }

  export class Client {
    constructor (endpoint: string, options: any)
    subscribe (channelName: string, onMessage: (message: any) => void): Subscription
    setHeader (key: string, value: string): void
    disconnect (): Promise<void>
  }
}
