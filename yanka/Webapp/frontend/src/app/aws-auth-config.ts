import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_yURBgXWYb',
      userPoolClientId: '1pet7h6f4ddn8fam0v1681gpdm',
      loginWith: { email: true },
    },
  },
});