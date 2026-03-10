import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_yURBgXWYb',
      userPoolClientId: '522dd7m8krgsqj1pjmu135to34',
      loginWith: {
        email: true
      }
    }
  }
}, { ssr: true }); // Enable SSR since you're in Next.js