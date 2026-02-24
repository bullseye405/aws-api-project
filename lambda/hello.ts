export const handler = async (event: any) => {
  console.log('[hello.ts lambda handler]');
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
    body: `Hello! Your API is working perfectly.`,
  };
};
