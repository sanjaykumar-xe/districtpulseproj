'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';
import { errorEmitter } from './error-emitter';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<void> {
  return new Promise((resolve, reject) => {
    signInAnonymously(authInstance)
      .then(() => resolve())
      .catch((error) => {
        // We don't use the permission error here as it's not a security rule violation
        console.error("Anonymous Sign-In Error:", error);
        reject(error);
      });
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(authInstance, email, password)
      .then(() => resolve())
      .catch((error) => {
        console.error("Email Sign-Up Error:", error);
        reject(error);
      });
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
   return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(authInstance, email, password)
      .then(() => resolve())
      .catch((error) => {
        console.error("Email Sign-In Error:", error);
        reject(error);
      });
  });
}
