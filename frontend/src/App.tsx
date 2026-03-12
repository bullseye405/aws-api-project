import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [apiResponse, setApiResponse] = useState('');
  const [config, setConfig] = useState<any>(null);

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
        setApiResponse('Error loading config. Check console.');
      }
    };

    loadConfig();
  }, []);

  const callApi = async () => {
    if (!config) {
      setApiResponse('Missing config; cannot call API.');
      return;
    }

    setApiResponse('Calling API...');
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const res = await fetch(config.apiUrl, {
        headers: { Authorization: token || '' },
      });
      const text = await res.text();
      setApiResponse(text);
    } catch (err) {
      setApiResponse('API Error');
    }
  };

  if (!config) return <div className="container">Loading configuration...</div>;

  return (
    <Authenticator>
      {({ signOut, user }) => {
        console.log({ user });
        const { loginId } = user?.signInDetails || {};
        return (
          <div id="main-content">
            <h2>🚀 Welcome</h2>
            <p>
              Logged in as: <b>{loginId || user?.username}</b>
            </p>
            <button className="primary" onClick={callApi}>
              Call Locked API
            </button>
            <button className="danger" onClick={signOut}>
              Sign Out
            </button>
            <div id="api-response">{apiResponse}</div>
          </div>
        );
      }}
    </Authenticator>
  );
}

export default App;
