// NativeAudioCodeCall.ts (or NativeAudioCodeCallSpec.ts)
// TurboModule spec for Genesys + AudioCode OUTGOING calls only

import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

// Aliases (keep primitives simple)
export type CallId = string;
export type Environment = string; // simplify: was 'dev' | 'staging' | 'prod' | string
export type AudioRoute = 'earpiece' | 'speaker' | 'wired' | 'bluetooth';
export type CallStatus =
  | 'idle'
  | 'dialing'
  | 'ringing'
  | 'connecting'
  | 'connected'
  | 'held'
  | 'reconnecting'
  | 'disconnected'
  | 'failed';

// Config objects
export type InitConfig = {
  env: Environment;
  region?: string;
  oauth: {
    accessToken: string;
    expiresAt?: number;
  };
  vendor?: {
    apiKey?: string;
    deploymentId?: string;
    orgId?: string;
  };
  debug?: boolean;
  enableProximitySensor?: boolean;
};

export type StartCallParams = {
  destination: string; // phone number, SIP URI, queue, etc.
  customData?: { [key: string]: string };
  preferredRoute?: AudioRoute;
};

// Payloads (pure objects with supported primitives only)
export type CallUpdatedPayload = {
  callId: CallId;
  status: CallStatus;
  timestamp: number;
};

export type CallDisconnectedPayload = {
  callId: CallId;
  reason?: string;
  code?: string;
  timestamp: number;
};

export type ErrorPayload = {
  code: string;
  message: string;
  details?: { [key: string]: string | number | boolean | null };
};

export type AudioRouteChangedPayload = {
  route: AudioRoute;
};

export type MuteChangedPayload = {
  callId: CallId;
  isMuted: boolean;
};

export type HoldChangedPayload = {
  callId: CallId;
  isOnHold: boolean;
};

export type NetworkQualityPayload = {
  callId: CallId;
  rttMs?: number;
  jitterMs?: number;
  packetLossPct?: number;
};

// Event names (keep as string to avoid any union parsing edge cases)
export type GenesysAudioCodeEvent = string;

// Return wrapper instead of nullable/union to avoid mixed-type unions
export type NetworkQualityResult = {
  available: boolean;
  metrics?: NetworkQualityPayload; // present only if available === true
};

export interface Spec extends TurboModule {
  /** Initialize SDK */
  init(config: InitConfig): Promise<void>;

  /** Update OAuth token */
  setAccessToken(accessToken: string, expiresAt?: number): Promise<void>;

  /** Start outbound call */
  startCall(params: StartCallParams): Promise<CallId>;

  /** End active call */
  endCall(callId: CallId, reason?: string): Promise<void>;

  /** Mute/unmute */
  mute(callId: CallId): Promise<void>;
  unmute(callId: CallId): Promise<void>;

  /** Hold/resume */
  hold(callId: CallId): Promise<void>;
  resume(callId: CallId): Promise<void>;

  /** Send DTMF digits */
  sendDTMF(callId: CallId, digits: string): Promise<void>;

  /** Audio route control */
  setAudioRoute(route: AudioRoute): Promise<void>;
  getAudioRoute(): Promise<AudioRoute>;
  setSpeakerphoneOn(enabled: boolean): Promise<void>;

  /** Proximity sensor */
  enableProximitySensor(enabled: boolean): Promise<void>;

  /** Call state queries */
  getCallStatus(callId: CallId): Promise<CallStatus>;
  isMuted(callId: CallId): Promise<boolean>;
  isOnHold(callId: CallId): Promise<boolean>;

  /** Network quality metrics (no unions) */
  getCurrentNetworkQuality(callId: CallId): Promise<NetworkQualityResult>;

  /** Required for RN event emitter */
  addListener(eventName: GenesysAudioCodeEvent): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAudioCodeCall');
