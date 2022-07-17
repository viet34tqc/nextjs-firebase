import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	writeBatch,
} from 'firebase/firestore';
import debounce from 'lodash.debounce';
import {
	ChangeEvent,
	FormEvent,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { firestore } from '../lib/firebase';
import { useUserContext } from '../lib/UserContext';

function UsernameMessage({
	username,
	isValid,
	loading,
}: {
	username: string;
	isValid: boolean;
	loading: boolean;
}) {
	if (!username.length) {
		return null;
	}
	if (loading) {
		return <p>Checking...</p>;
	} else if (isValid) {
		return <p className="text-success">{username} is available!</p>;
	} else if (username && !isValid) {
		return <p className="text-danger">That username is taken!</p>;
	} else {
		return <p></p>;
	}
}

const Dashboard = () => {
	const [formValue, setFormValue] = useState('');
	const [isValid, setIsValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const { user, username } = useUserContext();

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		try {
			// Get a new write batch
			const batch = writeBatch(firestore);

			const usernameRef = doc(firestore, 'usernames', formValue);
			const userRef = doc(firestore, 'users', user.uid);

			batch.update(userRef, { displayName: formValue });
			batch.set(usernameRef, { uid: user.uid });

			// Delete the old username document.

			// If username exists (login with google)
			if (username) {
				batch.delete(doc(firestore, 'usernames', username));
			} else {
				// Find the old username document by uID
				// Then delete
				const usernameCollectionRef = collection(firestore, 'usernames');
				const q = query(usernameCollectionRef, where('uid', '==', user.uid));
				const querySnapshot = await getDocs(q);
				let docId = '';
				querySnapshot.forEach(doc => {
					docId = doc.id;
				});
				batch.delete(doc(firestore, 'usernames', docId));
			}

			await batch.commit();
		} catch (error) {
			console.log(error.message);
		}
	}
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setFormValue(e.target.value);
		setLoading(true);
		setIsValid(false);
	}
	const checkUsername = useCallback(
		debounce(async username => {
			if (username.length >= 3) {
				// Get document reference. This is like query statement.
				const usernamesRef = doc(firestore, 'usernames', username);
				// Get document
				const docSnap = await getDoc(usernamesRef);
				const exists = docSnap.exists();
				setIsValid(!exists);
				setLoading(false);
			}
		}, 500),
		[] // If we dont pass the username and use formValue state, then we have to pass formValue to the dependancy array that makes useCallback useless.
	);
	useEffect(() => {
		checkUsername(formValue);
	}, [formValue, checkUsername]);
	return (
		<main>
			<h1>Welcome</h1>
			<p>Here is where you can update your username</p>
			<h3>Choose Username</h3>
			<form onSubmit={handleSubmit}>
				<input
					name="username"
					placeholder="myname"
					value={formValue}
					onChange={handleChange}
				/>
				<UsernameMessage
					username={formValue}
					isValid={isValid}
					loading={loading}
				/>
				<button type="submit" className="btn-green" disabled={!isValid}>
					Choose
				</button>

				<h3>Debug State</h3>
				<div>
					Username: {formValue}
					<br />
					Loading: {loading.toString()}
					<br />
					Username Valid: {isValid.toString()}
				</div>
			</form>
		</main>
	);
};

export default Dashboard;
