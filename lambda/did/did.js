
const router = path => {
  switch(path) {
    case '/did/qr':
      return 'I am a code.';
    case '/did/callback':
      return 'I am a callback';
    default:
      return 'I am default.' + path;  
  }
};

const handler = async (event, context) =>
  ({
    statusCode: 200,
    body: JSON.stringify({
      response: router(event.path),
      event
    }),
  });

export {handler};