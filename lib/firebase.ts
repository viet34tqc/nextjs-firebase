import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import {
	collection,
	getDocs,
	getFirestore,
	limit,
	query,
	where,
} from 'firebase/firestore';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCTiDULuSkkw7p_2hs32iapL6fPVYhBJ6E',
	authDomain: 'nextfirebasedemo-1c3f3.firebaseapp.com',
	projectId: 'nextfirebasedemo-1c3f3',
	storageBucket: 'nextfirebasedemo-1c3f3.appspot.com',
	messagingSenderId: '957791827529',
	appId: '1:957791827529:web:e89d6cbdced3bdd2427198',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();

export async function getUserWithUsername(username: string) {
	const usersRef = collection(firestore, 'users');
	const q = query(usersRef, where('displayName', '==', username), limit(1));
	const userDoc = (await getDocs(q)).docs[0];
	return userDoc;
}

export function postToJSON(doc: any) {
	const data = doc.data();
	return {
		...data,
		// Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
		createdAt: data?.createdAt.toMillis() || 0,
		updatedAt: data?.updatedAt.toMillis() || 0,
	};
}
