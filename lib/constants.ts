export type ServiceState = 'READY' | 'STARTED' | 'STOPPED' | 'RESTARTING' | 'UNDEFINED'
export type OnMessage = (message: any) => void
export type OnStop = (messages: any[]) => void

export interface StreamingClientOptions {
  accessToken: string
  instanceUrl: string
  name: string
  version: string
  replay?: boolean
  onMessage: OnMessage
}

export interface RecvMessagesOpts {
  channelName: string
  ttl?: number
}

export const COMETD = 'cometd'
export const DEFAULT_VERSION = '49.0'
export const REPLAY = 'replay'
export const SERVICE_STATE: Record<ServiceState, ServiceState> = {
  READY: 'READY',
  STARTED: 'STARTED',
  STOPPED: 'STOPPED',
  RESTARTING: 'RESTARTING',
  UNDEFINED: 'UNDEFINED'
}

Object.seal(SERVICE_STATE)
