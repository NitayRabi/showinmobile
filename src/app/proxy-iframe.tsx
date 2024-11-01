export default function ProxyIframe({ src }: { src: string }) {
  const encodedUrl = encodeURIComponent(src); // Encode the URL for safe usage in the query string
  const iframeSrc = `localhost:3000/api/proxy?url=${encodedUrl}`;

  return (
    <iframe
      src={iframeSrc}
      width="100%"
      height="100%"
      style={{ border: "none" }}
      referrerPolicy="unsafe-url"
    ></iframe>
  );
}
