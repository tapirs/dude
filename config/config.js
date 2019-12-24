var env = process.env.NODE_ENV || 'dev';

var dev = {
  email: {
    auth: {
      user: 'info@tapirs.co.uk',
      pass: 'Sbu3Z,Pg:@Bvc-g'
    },
    host: 'smtp.ionos.co.uk',
    port: 465,
    secure: true
  },
  okta: {
    issuer: "https://dev-149529.okta.com/oauth2/default",
    client_id: "0oa1v5lgiotV0rNRS357",
    client_secret: "8339nQeOtrjU782RFwOlju8yplYHj2ZBViEx4Vwr",
    redirect_uri: "https://dev.tapirs.co.uk/dude/authorization-code/callback",
    scope: "openid profile",
    appBaseUrl: "https://dev.tapirs.co.uk/dude",
    routes: {
      login: {
        path: "/dude/login"
      }
    }
  }
}

var prod = {
  email: {
    username: "andrew.partis@tapirs.co.uk",
    password: "GRac!329",
    host: 'smtp.ionos.co.uk',
    port: 465,
    secure: true
  },
  okta: {
    issuer: "https://dev-149529.okta.com/oauth2/default",
    client_id: "0oa27fbrumwNQw1Hi357",
    client_secret: "q6XhQN3fBid326awX_Mrz697eGLE9pesNa9Ohfh0",
    redirect_uri: "https://tapirs.co.uk/dude/authorization-code/callback",
    scope: "openid profile",
    appBaseUrl: "https://tapirs.co.uk/dude",
    routes: {
      login: {
        path: "/dude/login"
      }
    }
  }
}

const config = {
 dev,
 prod
};

module.exports = config[env];
