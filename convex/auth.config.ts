const domain = process.env.CLERK_JWT_ISSUER_DOMAIN;

if (!domain) {
  throw new Error("Missing CLERK_JWT_ISSUER_DOMAIN environment variable");
}

export default {
    providers: [
        {
            domain: domain,
            applicationID: "convex"
        }
    ]
}