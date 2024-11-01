
self.addEventListener('fetch', (event) => {
  const clientId = event.clientId;
  console.log('PRE PROXY:', event.request.method, event.request.url)
  if (event.request.url.includes('/api/proxy')) {
    
    return event.respondWith(fetch(event.request));
  }
  if (clientId) {
    event.respondWith(
      clients.get(clientId).then(client => {
        // Check if the client is an iframe and if it matches your criteria
        if (client && client.frameType === 'nested') {
          // Handle the request specific to the iframe
        //   event.request.url = `/api/proxy?url=${encodeURIComponent(event.request.url)}`
          console.log('PROXY IFRAME FROM URL:', event.request.method, event.request.url, client)
          const baseUrl = client.url
          .replace('http://localhost:3000/api/proxy?url=', '')
          .replace('https://showinmobile.app/api/proxy?url=', '')
          const url = `/api/proxy?url=${encodeURIComponent(
            event.request.url
            .replace('http://localhost:3000', baseUrl)
            .replace('https://showinmobile.app', baseUrl)
          )}`
          console.log('PROXY IFRAME TO URL:', event.request.method, url, client)
          return fetch(url, {headers: event.request.headers, method: event.request.method}).then(response => {
            // Possibly modify response here
            return response;
          }).catch(error => {
            // Handle errors
            console.error(error);
          });
        } else {
            console.log('direct:', event.request.method, event.request.url, client)
          // Handle requests from other clients (not the specific iframe)
          return fetch(event.request);
        }
      })
    );
  } else if (
    event.request.referrer.startsWith('http://localhost:3000/api/proxy')
  ) {
    // Modify the request to include the proxy
    const url = `/api/proxy?url=${encodeURIComponent(event.request.url)}`
    event.respondWith(fetch(url, {headers: event.request.headers, method: event.request.method}))
  } else {
    console.log("OTHER:", event.request.method, event.request.url)
    // No clientId (e.g., for cross-origin requests), just perform default fetch
    event.respondWith(fetch(event.request));
  }
});

