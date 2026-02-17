import { createMiddleware } from "@solidjs/start/middleware";

export default createMiddleware({
  onRequest: (event) => {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

    event.locals.nonce = nonce;

    const cspHeader = `
      default-src 'none';
      script-src 'self' 'nonce-${nonce}';
      style-src 'self' ${
        import.meta.env.NODE_ENV === "production"
          ? `'nonce-${nonce}'`
          : "'unsafe-inline'"
      };
      connect-src 'self'${
        import.meta.env.NODE_ENV !== "production" ? " ws://localhost:*" : ""
      };
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `;

    // Replace newline characters and spaces
    const csp = cspHeader.replace(/\s{2,}/g, " ").trim();

    event.response.headers.set("Content-Security-Policy", csp);
  },
});
