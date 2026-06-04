import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '$lib/firebase.client';

export async function load({ url }) {
 function getAuthUser() {
  return new Promise((resolve) => {
   onAuthStateChanged(auth, (user) => {
    resolve(user ?? false);
   });
  });
 }

 return {
  getAuthUser,
  url: url.pathname
 };
}