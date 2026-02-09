'use client';

import type { FirebaseApp } from 'firebase/app';
import { getApp, getApps, initializeApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import type { Database } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import { getStorage } from 'firebase/storage';

import { getFirebaseConfig } from './config';

type FirebaseClient = {
  app: FirebaseApp;
  auth: Auth;
  database: Database;
  firestore: Firestore;
  storage: FirebaseStorage;
};

let firebaseClient: FirebaseClient | null = null;

export const getFirebaseClient = (): FirebaseClient => {
  if (firebaseClient !== null) {
    return firebaseClient;
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());

  firebaseClient = {
    app,
    auth: getAuth(app),
    database: getDatabase(app),
    firestore: getFirestore(app),
    storage: getStorage(app),
  };

  return firebaseClient;
};
