import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { auth, firestore } from '../lib/firebase';

function RegisterForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();
	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		try {
			const user = await createUserWithEmailAndPassword(auth, email, password);
			await setDoc(doc(firestore, 'users', user.user.uid), {
				email: user.user.email,
				displayName: user.user.displayName,
			});
			await addDoc(collection(firestore, 'usernames'), {
				uid: user.user.uid,
			});
			await router.push('/dashboard');
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			setError(error.message);
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			<h2>Register With Email</h2>
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

const Register = () => {
	return (
		<main>
			<RegisterForm />
		</main>
	);
};

export default Register;
