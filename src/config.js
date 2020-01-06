const dev = {
//  STRIPE_KEY: "YOUR_STRIPE_DEV_PUBLIC_KEY",
  s3: {
    REGION: "us-east-1",
    BUCKET: "jackrobertscom2"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.jack-roberts.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_9lsJw3rzu",
    APP_CLIENT_ID: "3k80sq4uqrqobilv7ilgovh7lo",
    IDENTITY_POOL_ID: "us-east-1:91ec91fe-6f26-48f7-8dcf-176a3e439766"
  }
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "mrspeaker-prod"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://bamzqbftnb.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_9lsJw3rzu",
    APP_CLIENT_ID: "3k80sq4uqrqobilv7ilgovh7lo",
    IDENTITY_POOL_ID: "us-east-1:91ec91fe-6f26-48f7-8dcf-176a3e439766"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};