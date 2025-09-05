// CallScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  NativeEventEmitter,
  Platform,
  AppState,
  Modal,
} from 'react-native';
import NativeAudioCodeCall, {
  type AudioRoute,
  type CallStatus,
  type CallUpdatedPayload,
  type CallDisconnectedPayload,
  type ErrorPayload,
  type AudioRouteChangedPayload,
  type MuteChangedPayload,
  type HoldChangedPayload,
  type NetworkQualityPayload,
  type StartCallParams,
} from '../../../specs/NativeAudioCodeCall';
import { useNavigation } from '@react-navigation/native';
type Props = {
  params: StartCallParams; // destination, customData, preferredRoute
  onClosed?: (info: { callId?: string; reason?: string }) => void;
  enableProximity?: boolean; // default true
};

const EVENTS = {
  CallUpdated: 'CallUpdated',
  CallDisconnected: 'CallDisconnected',
  Error: 'Error',
  AudioRouteChanged: 'AudioRouteChanged',
  MuteChanged: 'MuteChanged',
  HoldChanged: 'HoldChanged',
  NetworkQuality: 'NetworkQuality',
} as const;

export const CallScreen: React.FC<Props> = ({
  params,
  onClosed,
  enableProximity = true,
}) => {
  const emitter = useMemo(
    () => new NativeEventEmitter(NativeAudioCodeCall as any),
    [],
  );
  const [callId, setCallId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<CallStatus>('idle');
  const [muted, setMuted] = useState(false);
  const [onHold, setOnHold] = useState(false);
  const [route, setRoute] = useState<AudioRoute>('earpiece');
  const [error, setError] = useState<string | undefined>(undefined);
  const [dtmfOpen, setDtmfOpen] = useState(false);
  const [connectedAt, setConnectedAt] = useState<number | undefined>();
  const [elapsed, setElapsed] = useState<string>('00:00');
  const [network, setNetwork] = useState<
    Pick<NetworkQualityPayload, 'rttMs' | 'jitterMs' | 'packetLossPct'>
  >({});
  const navigation = useNavigation();

  const timerRef = useRef<NodeJS.Timer | null>(null);
  const appState = useRef(AppState.currentState);

  // Start the call when screen mounts
  useEffect(() => {
    let mounted = true;

    const start = async () => {
      try {
        if (enableProximity) {
          await NativeAudioCodeCall.enableProximitySensor(true);
        }
        if (params.preferredRoute) {
          await NativeAudioCodeCall.setAudioRoute(params.preferredRoute);
          setRoute(params.preferredRoute);
        } else {
          const r = await NativeAudioCodeCall.getAudioRoute();
          setRoute(r);
        }
        const id = await NativeAudioCodeCall.startCall(params);
        if (!mounted) return;
        setCallId(id);
        setStatus('dialing');
      } catch (e: any) {
        setError(e?.message ?? 'Failed to start call');
      }
    };

    start();

    return () => {
      mounted = false;
    };
  }, [params, enableProximity]);

  // Subscribe to native events
  useEffect(() => {
    const subs = [
      emitter.addListener(EVENTS.CallUpdated, (p: CallUpdatedPayload) => {
        if (p.callId !== callId && callId) return;
        setStatus(p.status);
        if (p.status === 'connected' && !connectedAt) {
          setConnectedAt(Date.now());
        }
      }),
      emitter.addListener(
        EVENTS.CallDisconnected,
        (p: CallDisconnectedPayload) => {
          if (callId && p.callId !== callId) return;
          setStatus('disconnected');
          stopTimer();
          if (enableProximity) {
            NativeAudioCodeCall.enableProximitySensor(false).catch(() => {});
          }
          onClosed?.({
            callId: p.callId,
            reason: p.reason ?? p.code ?? 'disconnected',
          });
        },
      ),
      emitter.addListener(EVENTS.Error, (p: ErrorPayload) => {
        setError(`${p.code}: ${p.message}`);
      }),
      emitter.addListener(
        EVENTS.AudioRouteChanged,
        (p: AudioRouteChangedPayload) => {
          setRoute(p.route);
        },
      ),
      emitter.addListener(EVENTS.MuteChanged, (p: MuteChangedPayload) => {
        if (callId && p.callId !== callId) return;
        setMuted(p.isMuted);
      }),
      emitter.addListener(EVENTS.HoldChanged, (p: HoldChangedPayload) => {
        if (callId && p.callId !== callId) return;
        setOnHold(p.isOnHold);
      }),
      emitter.addListener(EVENTS.NetworkQuality, (p: NetworkQualityPayload) => {
        if (callId && p.callId !== callId) return;
        setNetwork({
          rttMs: p.rttMs,
          jitterMs: p.jitterMs,
          packetLossPct: p.packetLossPct,
        });
      }),
    ];
    return () => {
      subs.forEach(s => s.remove());
      // Required by RN event emitter contract
      try {
        NativeAudioCodeCall.removeListeners(subs.length);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emitter, callId, enableProximity]);

  // AppState: pause/resume sensor logic if needed
  useEffect(() => {
    const sub = AppState.addEventListener('change', async next => {
      const prev = appState.current;
      appState.current = next;
      if (!enableProximity) return;
      if (prev.match(/active/) && next.match(/background|inactive/)) {
        // Optionally disable to save battery
        if (
          status !== 'connected' &&
          status !== 'ringing' &&
          status !== 'dialing'
        )
          return;
        try {
          await NativeAudioCodeCall.enableProximitySensor(false);
        } catch {}
      }
      if (prev.match(/background|inactive/) && next === 'active') {
        if (
          status === 'connected' ||
          status === 'ringing' ||
          status === 'dialing'
        ) {
          try {
            await NativeAudioCodeCall.enableProximitySensor(true);
          } catch {}
        }
      }
    });
    return () => sub.remove();
  }, [status, enableProximity]);

  // Connected call timer
  useEffect(() => {
    if (status === 'connected') {
      startTimer();
    } else {
      stopTimer();
      if (status !== 'connected') setElapsed('00:00');
    }
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setElapsed(formatElapsed(connectedAt ?? Date.now()));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatElapsed = (start: number) => {
    const secs = Math.max(0, Math.floor((Date.now() - start) / 1000));
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Actions
  const endCall = async () => {
    try {
      if (callId) await NativeAudioCodeCall.endCall(callId, 'user_ended');
    } catch (e: any) {
      setError(e?.message ?? 'Failed to end call');
    } finally {
      if (enableProximity) {
        try {
          await NativeAudioCodeCall.enableProximitySensor(false);
        } catch {}
      }
      onClosed?.({ callId, reason: 'user_ended' });
    }
    navigation.goBack();
  };

  const toggleMute = async () => {
    if (!callId) return;
    try {
      if (muted) await NativeAudioCodeCall.unmute(callId);
      else await NativeAudioCodeCall.mute(callId);
    } catch {}
  };

  const toggleHold = async () => {
    if (!callId) return;
    try {
      if (onHold) await NativeAudioCodeCall.resume(callId);
      else await NativeAudioCodeCall.hold(callId);
    } catch {}
  };

  const toggleSpeaker = async () => {
    try {
      const next: AudioRoute = route === 'speaker' ? 'earpiece' : 'speaker';
      await NativeAudioCodeCall.setAudioRoute(next);
      setRoute(next);
      // Optional: for Android speakerphone global toggle
      if (Platform.OS === 'android') {
        await NativeAudioCodeCall.setSpeakerphoneOn(next === 'speaker');
      }
    } catch {}
  };

  const sendDigit = async (d: string) => {
    if (!callId) return;
    try {
      await NativeAudioCodeCall.sendDTMF(callId, d);
    } catch {}
  };

  // Header + status line
  const statusLine = useMemo(() => {
    switch (status) {
      case 'dialing':
      case 'ringing':
      case 'connecting':
      case 'reconnecting':
        return 'Calling...';
      case 'connected':
        return elapsed;
      case 'held':
        return 'On hold';
      case 'failed':
        return 'Failed';
      case 'disconnected':
        return 'Ended';
      default:
        return '';
    }
  }, [status, elapsed]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {params.destination}
        </Text>
        <Text style={styles.subtitle}>{statusLine}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <NetworkPill
        rtt={network.rttMs}
        jitter={network.jitterMs}
        loss={network.packetLossPct}
      />

      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, onHold && styles.avatarOnHold]}>
          <Text style={styles.avatarText}>{initials(params?.userName)}</Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <RoundButton
          label={muted ? 'Unmute' : 'Mute'}
          icon={muted ? '🔈' : '🔇'}
          onPress={toggleMute}
          accessibilityLabel="Toggle mute"
        />
        {/* <RoundButton
          label="Keypad"
          icon="🔢"
          onPress={() => setDtmfOpen(true)}
          accessibilityLabel="Open keypad"
        /> */}
        <RoundButton
          label={route === 'speaker' ? 'Earpiece' : 'Speaker'}
          icon={route === 'speaker' ? '📞' : '📢'}
          onPress={toggleSpeaker}
          accessibilityLabel="Toggle speaker"
        />
      </View>

      <View style={styles.controlsRow}>
        {/* <RoundButton
          label={onHold ? 'Resume' : 'Hold'}
          icon="⏸️"
          onPress={toggleHold}
          disabled={status !== 'connected' && status !== 'held'}
          accessibilityLabel="Toggle hold"
        /> */}
        <RoundButton
          label="End"
          icon="⛔"
          onPress={endCall}
          danger
          accessibilityLabel="End call"
        />
      </View>

      <DtmfModal
        open={dtmfOpen}
        onClose={() => setDtmfOpen(false)}
        onPressDigit={sendDigit}
      />
    </SafeAreaView>
  );
};

// Simple round button
const RoundButton: React.FC<{
  label: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
  accessibilityLabel?: string;
}> = ({ label, icon, onPress, disabled, danger, accessibilityLabel }) => (
  <TouchableOpacity
    style={[
      styles.button,
      danger && styles.buttonDanger,
      disabled && styles.buttonDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel ?? label}
  >
    <Text style={styles.buttonIcon}>{icon}</Text>
    <Text style={[styles.buttonLabel, danger && styles.buttonLabelDanger]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Network quality compact pill
const NetworkPill: React.FC<{
  rtt?: number;
  jitter?: number;
  loss?: number;
}> = ({ rtt, jitter, loss }) => {
  const grade = (() => {
    if (loss !== undefined && loss > 5) return 'Poor';
    if (jitter !== undefined && jitter > 30) return 'Fair';
    if (rtt !== undefined && rtt > 250) return 'Fair';
    return 'Good';
  })();
  return (
    <View style={styles.netPill}>
      <Text style={styles.netPillText}>
        {`Net: ${grade}`}
        {rtt != null ? `  RTT ${rtt}ms` : ''}
        {jitter != null ? `  Jit ${jitter}ms` : ''}
        {loss != null ? `  Loss ${loss}%` : ''}
      </Text>
    </View>
  );
};

// DTMF keypad modal
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
const DtmfModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onPressDigit: (d: string) => void;
}> = ({ open, onClose, onPressDigit }) => {
  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Keypad</Text>
          <View style={styles.keypadGrid}>
            {digits.map(d => (
              <TouchableOpacity
                key={d}
                style={styles.key}
                onPress={() => onPressDigit(d)}
                accessibilityLabel={`DTMF ${d}`}
              >
                <Text style={styles.keyText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={onClose}
            accessibilityLabel="Close keypad"
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const initials = (t: string) => {
  const clean = t.replace(/[^\w]/g, ' ').trim();
  const parts = clean.split(/\s+/);
  const a = parts[0]?.[0] ?? '';
  const b = parts[1]?.[0] ?? '';
  return (a + b).toUpperCase() || '•';
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },

  header: { paddingTop: 24, paddingHorizontal: 20, alignItems: 'center' },
  title: { color: '#eb1800', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#555555', fontSize: 16, marginTop: 6 },
  error: { color: '#eb1800', fontSize: 12, marginTop: 8 },

  avatarWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#eb1800',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  avatarOnHold: { opacity: 0.6, borderColor: '#FFC857' },
  avatarText: { color: '#eb1800', fontSize: 36, fontWeight: '700' },

  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  button: {
    width: 96,
    height: 96,
    borderRadius: 52,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#eb1800',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDanger: {
    backgroundColor: '#eb1800',
    borderColor: '#eb1800',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonIcon: { fontSize: 26, marginBottom: 6 },
  buttonLabel: { color: '#eb1800', fontSize: 13, fontWeight: '600' },
  buttonLabelDanger: { color: '#FFFFFF' },

  netPill: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
  },
  netPillText: { color: '#eb1800', fontSize: 12 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  modalTitle: {
    color: '#eb1800',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  key: {
    width: '28%',
    aspectRatio: 1,
    margin: '2%',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F8BBD0',
  },
  keyText: { color: '#eb1800', fontSize: 24, fontWeight: '700' },
  modalClose: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#eb1800',
  },
  modalCloseText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});

export default CallScreen;
