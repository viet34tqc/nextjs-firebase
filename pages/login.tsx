import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import router, { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { useUserContext } from '../lib/UserContext';
type Props = {};

function SignInWithEmail() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		try {
			await router.push('/dashboard');
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			setError(error.message);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h2>Signin With Email</h2>
			<label htmlFor="">
				Email:
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					name="email"
				/>
			</label>
			<label htmlFor="">
				Password:
				<input
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					name="password"
				/>
			</label>
			{error && <p>{error}</p>}

			<button>Submit</button>
		</form>
	);
}

function SignInWithGG() {
	const router = useRouter();

	const signInWithGoogle = async () => {
		try {
			const user = await signInWithPopup(auth, googleAuthProvider);
			router.push('/dashboard');

			// Get document reference. This is like query statement.
			const docRef = doc(firestore, 'users', user.user.uid);

			// Get document
			const docSnap = await getDoc(docRef); // Return a snapshot object, not the data
			if (!docSnap.exists()) {
				// create or update document with custom id
				await setDoc(doc(firestore, 'users', user.user.uid), {
					email: user.user.email,
					displayName: user.user.displayName,
				});
				if (user.user.displayName) {
					await setDoc(doc(firestore, 'usernames', user.user.displayName), {
						uid: user.user.uid,
					});
				} else {
					await addDoc(collection(firestore, 'usernames'), {
						uid: user.user.uid,
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<button className="btn-google" onClick={signInWithGoogle}>
			Sign in with Google
		</button>
	);
}

const Login = (props: Props) => {
	const { user, username } = useUserContext();
	useEffect(() => {
		if (user) {
			router.push('/dashboard');
		}
	}, [user]);
	return (
		!user && (
			<main>
				<SignInWithEmail />
				<div>or</div>
				<SignInWithGG />
			</main>
		)
	);
};

export default Login;
