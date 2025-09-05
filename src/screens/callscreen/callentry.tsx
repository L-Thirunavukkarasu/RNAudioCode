// Example usage (e.g., CallEntry.tsx)
import React, { useEffect } from 'react';
import { View } from 'react-native';
import CallScreen from './index';
import NativeAudioCodeCall, {
  InitConfig,
} from '../../../specs/NativeAudioCodeCall';

export default function CallEntry() {
  useEffect(() => {
    const cfg: InitConfig = {
      env: 'prod',
      oauth: { accessToken: 'YOUR_TOKEN', expiresAt: Date.now() + 3600_000 },
      vendor: {
        apiKey: 'GENESYS_KEY',
        deploymentId: 'DEPLOY_ID',
        orgId: 'ORG_ID',
      },
      debug: true,
      enableProximitySensor: true,
    };
    NativeAudioCodeCall.init(cfg).catch(console.warn);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CallScreen
        params={{
          destination: '+6599990000',
          preferredRoute: 'earpiece',
          userName: 'Test',
        }}
        onClosed={info => {
          // Navigate away, log analytics, etc.
          console.log('Call closed', info);
        }}
      />
    </View>
  );
}
