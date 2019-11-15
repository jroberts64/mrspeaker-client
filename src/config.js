export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-s3-bucket-jcr"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://so4x6zvqrg.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_JMOzKqV2l",
    APP_CLIENT_ID: "3ofu710bjf6craud49nd99qqkl",
    IDENTITY_POOL_ID: "us-east-1:4f02717b-cc32-420b-b85b-c18a03ce85b8"
  }
};