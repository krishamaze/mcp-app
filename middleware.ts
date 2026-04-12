import { NextRequest, NextResponse } from "next/server";

const oauthMetadata = {
  issuer: "https://sheets-mcp-xi.vercel.app",
  authorization_endpoint:
    "https://sheets-mcp-xi.vercel.app/api/auth/mcp/authorize",
  token_endpoint: "https://sheets-mcp-xi.vercel.app/api/auth/mcp/token",
  userinfo_endpoint:
    "https://sheets-mcp-xi.vercel.app/api/auth/mcp/userinfo",
  jwks_uri: "https://sheets-mcp-xi.vercel.app/api/auth/mcp/jwks",
  registration_endpoint:
    "https://sheets-mcp-xi.vercel.app/api/auth/mcp/register",
  scopes_supported: ["openid", "profile", "email", "offline_access"],
  response_types_supported: ["code"],
  response_modes_supported: ["query"],
  grant_types_supported: ["authorization_code", "refresh_token"],
  acr_values_supported: [
    "urn:mace:incommon:iap:silver",
    "urn:mace:incommon:iap:bronze",
  ],
  subject_types_supported: ["public"],
  id_token_signing_alg_values_supported: ["RS256", "none"],
  token_endpoint_auth_methods_supported: [
    "client_secret_basic",
    "client_secret_post",
    "none",
  ],
  code_challenge_methods_supported: ["S256"],
  claims_supported: [
    "sub",
    "iss",
    "aud",
    "exp",
    "nbf",
    "iat",
    "jti",
    "email",
    "email_verified",
    "name",
  ],
};

export function middleware(request: NextRequest) {
  if (
    request.method === "GET" &&
    request.nextUrl.pathname ===
      "/api/auth/.well-known/openid-configuration"
  ) {
    return NextResponse.json(oauthMetadata);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/.well-known/openid-configuration"],
};
