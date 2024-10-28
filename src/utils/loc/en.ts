const loc: Record<string, string> = {
  'server-started': `
============================
{{serverName}} successfully started!
Url: {{url}}:{{port}};
Listening on port {{port}};
============================
  `,
  'ws-client-connected': 'Client connected with id: {{clientId}}',
  'ws-client-disconnected': 'Client disconnected with id: {{clientId}}',
  'ws-client-message': 'Client with id: {{clientId}} sent message: {{message}}',
  'server-invalid-json-format': 'Invalid JSON format',
  'server-data-not-provided': 'Data not provided',
  'endpoint-not-found': 'Endpoint not found, please check your URL',
  'server-unknown-error': 'Iternal server error',
  'server-parse-error': 'Field {{field}} should be {{expectedType}} but got {{gotValue}}',
};

export default loc;
