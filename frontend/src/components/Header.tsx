import {
  Button,
  Flex,
  Heading,
  Text,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useState } from 'react';

function Header({ apiUrl }: { apiUrl: string }) {
  const { user, signOut } = useAuthenticator((context) => [
    context.user,
    context.signOut,
  ]);

  const [apiResponse, setApiResponse] = useState(0);

  const callApi = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const res = await fetch(`${apiUrl}hello`, {
        headers: { Authorization: token || '' },
      });

      const data = await res.json();
      setApiResponse(data.count);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Flex
        // as="header"
        as="nav"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem 2rem"
        backgroundColor="background.secondary"
        // borderBottom="1px solid"
        border={'1px solid'}
        borderColor="border.primary"
      >
        <Heading level={4}>🚀 My App</Heading>

        <Flex alignItems="center" gap="1rem">
          <Text>
            Signed in as <b>{user.signInDetails?.loginId || user?.username}</b>
          </Text>

          <Button variation="primary" size="small" onClick={callApi}>
            Count: {apiResponse}
          </Button>

          <Button variation="link" size="small" onClick={signOut}>
            Sign Out
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export default Header;
