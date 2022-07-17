import { signInWithPopup } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { useUserContext } from '../lib/UserContext';
type Props = {};

function SignIn() {
	return <>Username Form</>;
}

function NotSignIn() {
	return (
		<>
			<SignInWithEmail />
			<div>or</div>
			<SignInWithGG />
		</>
	);
}

function SignInWithEmail() {
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);

	return (
		<form>
			<h2>Signin With Email</h2>
			<label htmlFor="">
				Email:
				<input type="email" name="email" id="" />
			</label>
			<label htmlFor="">
				Password:
				<input type="password" name="password" id="" />
			</label>
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
			const docSnap = await getDoc(docRef);
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
