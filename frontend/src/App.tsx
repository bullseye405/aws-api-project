import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { useEffect, useState } from 'react';

import './App.css';
import Header from './components/Header';
import type { Config } from './types/config';
import FileUploader from './components/FileUploader';
import FileGrid from './components/FileGrid';

function App() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/config.json');
        if (!res.ok) {
          throw new Error(`Failed to load config.json (HTTP ${res.status})`);
        }
        const data = await res.json();

        setConfig(data);

        Amplify.configure({
          Auth: {
            Cognito: {
              userPoolId: data.userPoolId,
              userPoolClientId: data.userPoolClientId,
            },
          },
        });
      } catch (err) {
        console.error('Failed to load config', err);
      }
    };

    loadConfig();
  }, []);

  if (!config) return <div className="container">Loading configuration...</div>;

  return (
    <Authenticator
      socialProviders={['google', 'amazon']}
      loginMechanisms={['email']}
    >
      <Header apiUrl={config.apiUrl} />
      <FileUploader apiUrl={config.apiUrl} />
      <FileGrid apiUrl={config.apiUrl} />
    </Authenticator>
  );
}

export default App;
