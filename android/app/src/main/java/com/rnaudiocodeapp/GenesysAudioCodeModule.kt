package com.rnaudiocodeapp

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule

@ReactModule(name = NativeAudioCodeCall.NAME)
interface NativeAudioCodeCall : TurboModule {
  companion object {
    const val NAME = "NativeAudioCodeCall"
  }

  // Initialize SDK
  fun init(config: ReadableMap, promise: Promise)

  // Update OAuth token
  fun setAccessToken(accessToken: String, expiresAt: Double?, promise: Promise)

  // Start outbound call
  fun startCall(params: ReadableMap, promise: Promise)

  // End active call
  fun endCall(callId: String, reason: String?, promise: Promise)

  // Mute/unmute
  fun mute(callId: String, promise: Promise)
  fun unmute(callId: String, promise: Promise)

  // Hold/resume
  fun hold(callId: String, promise: Promise)
  fun resume(callId: String, promise: Promise)

  // Send DTMF digits
  fun sendDTMF(callId: String, digits: String, promise: Promise)

  // Audio route control
  fun setAudioRoute(route: String, promise: Promise)
  fun getAudioRoute(promise: Promise)
  fun setSpeakerphoneOn(enabled: Boolean, promise: Promise)

  // Proximity sensor
  fun enableProximitySensor(enabled: Boolean, promise: Promise)

  // Call state queries
  fun getCallStatus(callId: String, promise: Promise)
  fun isMuted(callId: String, promise: Promise)
  fun isOnHold(callId: String, promise: Promise)

  // Network quality metrics
  fun getCurrentNetworkQuality(callId: String, promise: Promise)

  // RN Event Emitter hooks
  fun addListener(eventName: String)
  fun removeListeners(count: Double)
}
