import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from './firebase';

// Custom hook to read auth record and user profile doc
export function useUserData() {
	const [user] = useAuthState(auth);
	console.log('user', user);
	const [username, setUsername] = useState(null);

	useEffect(() => {
		// turn off realtime subscription
		let unsubscribe;
		if (user) {
			unsubscribe = onSnapshot(
				doc(firestore, 'users', user.uid),
				doc => {
					setUsername(doc.data()?.displayName);
				}
			);
		} else {
			setUsername(null);
		}

		return unsubscribe;
	}, [user]);

	return { user, username };
}
