require("dotenv").config();

const { TENANT, APP_ID, HOST_URL, PORT, APP_SECRET, SESSION_SECRET, URL_FRONTEND } = process.env

module.exports = {
  AZURE: {
    identityMetadata: `https://login.microsoftonline.com/${TENANT}/.well-known/openid-configuration`,
    clientID: APP_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: `${HOST_URL}:${PORT}/signin`,
    allowHttpForRedirectUrl: true,
    clientSecret: APP_SECRET,
    validateIssuer: true,
    isB2C: false,
    issuer: '',
    //passReqToCallback: false,
    //passReqToCallback: true,
    scope: '',
    loggingLevel: 'error',
    nonceLifetime: 0,
    nonceMaxAmount: 5,
    useCookieInsteadOfSession: true,
    cookieEncryptionKeys: [
      { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
      { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
    ]
  },
  SESSION_SECRET,
  URL_FRONTEND,
  destroySessionUrl: `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${HOST_URL}:${PORT}`
};
