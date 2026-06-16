"use client";

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_DvWek4Epl',
      userPoolClientId: '3p5eigog16lkenb1qs7q1r3kr8',
      loginWith: {
        email: true
      }
    }
  }
}, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
