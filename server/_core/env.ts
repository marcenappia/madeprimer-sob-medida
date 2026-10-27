// Platform values are read at use time. See the Webdev service/authentication skills.
export const ENV = {
  get appId() { return process.env.MANUS_PROJECT_ID ?? ""; },
  get cookieSecret() { return process.env.MANUS_JWT_SECRET ?? ""; },
  get databaseUrl() { return process.env.DATABASE_URL ?? ""; },
  get oAuthServerUrl() { return process.env.MANUS_OAUTH_API_URL ?? ""; },
  get forgeApiUrl() { return process.env.MANUS_API_URL ?? process.env.BUILT_IN_FORGE_API_URL ?? ""; },
  get forgeApiKey() { return process.env.MANUS_API_KEY ?? process.env.BUILT_IN_FORGE_API_KEY ?? ""; },
  get adminEmails() { return process.env.MADEPRIMER_ADMIN_EMAILS ?? ""; },
  get isProduction() { return process.env.NODE_ENV === "production"; },
};
