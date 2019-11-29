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
    USER_POOL_ID: "us-east-1_3sKOosx98",
    APP_CLIENT_ID: "64vf8rpikdp51natnuv2fjof31",
    IDENTITY_POOL_ID: "us-east-1:0372d745-2711-4d02-9a02-a58ae2b7c147"
  }
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "jackrobertscom2-prod"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.jack-roberts.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_8GnBpUCkC",
    APP_CLIENT_ID: "7thnkijjrs70jra07dgo5t12i8",
    IDENTITY_POOL_ID: "us-east-1:5f449e36-6274-4e23-b430-271811cb5926"
  }
};

// Default to dev if not set
const config = process.env.APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};