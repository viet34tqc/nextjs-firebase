import { firestore } from '@lib/firebase';
import { useUserContext } from '@lib/UserContext';
import styles from '@styles/Admin.module.css';
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import kebabCase from 'lodash.kebabcase';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

type Props = {};

const CreateNewPost = (props: Props) => {
	const router = useRouter();
	const { user, username } = useUserContext();
	const [title, setTitle] = useState('');

	// Ensure slug is URL safe
	const slug = encodeURI(kebabCase(title));

	// Validate length
	const isValid = title.length > 3 && title.length < 100;

	// Create a new post in firestore
	const createPost = async (e: any) => {
		e.preventDefault();
		const uid = user.uid;
		const userRef = doc(firestore, 'users', uid);
		const postsRef = collection(userRef, 'posts');

		// Tip: give all fields a default value here
		const data = {
			title,
			slug,
			uid,
			username,
			published: false,
			content: '# hello world!',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			heartCount: 0,
		};

		await addDoc(postsRef, data);

		toast.success('Post created!');

		// Imperative navigation after doc is set
		router.push(`/admin/${slug}`);
	};

	return (
		<form onSubmit={createPost}>
			<input
				value={title}
				onChange={e => setTitle(e.target.value)}
				placeholder="My Awesome Article!"
				className={styles.input}
			/>
			<p>
				<strong>Slug:</strong> {slug}
			</p>
			<button type="submit" disabled={!isValid} className="btn-green">
				Create New Post
			</button>
		</form>
	);
};

export default CreateNewPost;
