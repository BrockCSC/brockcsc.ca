import type { FirebaseOptions } from 'firebase/app';

type FirebaseEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY?: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
  NEXT_PUBLIC_FIREBASE_DATABASE_URL?: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
  NEXT_PUBLIC_FIREBASE_APP_ID?: string;
};

const defaultFirebaseConfig = {
  apiKey: 'AIzaSyDQDfY9LihVJctR7xkiaSAK3oY_gWymzMo',
  authDomain: 'brockcsc-test.firebaseapp.com',
  databaseURL: 'https://brockcsc-test.firebaseio.com',
  projectId: 'brockcsc-test',
  storageBucket: 'brockcsc-test.appspot.com',
  messagingSenderId: '616874187714',
  appId: '1:616874187714:web:7c2991b562ffab0944d45b',
};

const env = process.env as FirebaseEnv;

const resolvedFirebaseConfig = (): FirebaseOptions => ({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain:
    env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  databaseURL:
    env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || defaultFirebaseConfig.databaseURL,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket:
    env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId:
    env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    defaultFirebaseConfig.messagingSenderId,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
});

export const getMissingFirebaseEnvKeys = (): string[] => {
  const config = resolvedFirebaseConfig();
  const missingKeys: string[] = [];

  if (!config.apiKey) missingKeys.push('NEXT_PUBLIC_FIREBASE_API_KEY');
  if (!config.authDomain) missingKeys.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  if (!config.databaseURL) missingKeys.push('NEXT_PUBLIC_FIREBASE_DATABASE_URL');
  if (!config.projectId) missingKeys.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  if (!config.storageBucket) missingKeys.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  if (!config.messagingSenderId)
    missingKeys.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');

  return missingKeys;
};

export const getFirebaseConfig = (): FirebaseOptions => {
  const missingRequiredKeys = getMissingFirebaseEnvKeys();

  if (missingRequiredKeys.length > 0) {
    throw new Error(
      `Missing Firebase env vars: ${missingRequiredKeys.join(', ')}. ` +
        'See .env.'
    );
  }

  return resolvedFirebaseConfig();
};
