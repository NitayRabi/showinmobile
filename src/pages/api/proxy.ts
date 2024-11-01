import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle raw requests
  },
};

// Middleware to add CORS headers
const addCORSHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allowed methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allowed headers
};

export default function handler(req, res) {
  const target = req.query.url;

  // Check if target URL is provided
  if (!target) {
    return res.status(400).json({ error: "Target URL is required" });
  }

  // Handle preflight request
  if (req.method === "OPTIONS") {
    addCORSHeaders(res);
    return res.status(204).end(); // End response for preflight
  }

  // Apply CORS headers for all responses
  addCORSHeaders(res);

  const proxy = createProxyMiddleware({
    target, // Target URL
    changeOrigin: true, // Change origin of the host header to the target URL
    followRedirects: true, // Prevent following redirects automatically
    selfHandleResponse: false, // Enable self-handling of the response for full control
    pathRewrite: { "^/api/proxy": "" }, // Remove the '/api/proxy' prefix from the target URL
  });

  return proxy(req, res, (err) => {
    if (err) {
      res.status(500).send("Proxy error");
    }
  });
}
