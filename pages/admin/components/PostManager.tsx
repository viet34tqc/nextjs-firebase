import { firestore } from '@lib/firebase';
import { useUserContext } from '@lib/UserContext';
import styles from '@styles/Admin.module.css';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import DeletePostButton from './DeletePostButton';
import PostForm from './PostForm';

export default function PostManager() {
	const [preview, setPreview] = useState(false);
	const { user } = useUserContext();

	const router = useRouter();
	const { slug } = router.query;
	const nextSlug = slug as string;

	const postRef = doc(firestore, 'users', user.uid, 'posts', nextSlug);
	const [post] = useDocumentData(postRef);

	return (
		<main className={styles.container}>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm
							postRef={postRef}
							defaultValues={post}
							preview={preview}
						/>
					</section>

					<aside>
						<h3>Tools</h3>
						<button onClick={() => setPreview(!preview)}>
							{preview ? 'Edit' : 'Preview'}
						</button>
						<Link href={`/${post.username}/${post.slug}`}>
							<button className="btn-blue">Live view</button>
						</Link>
						<DeletePostButton postRef={postRef} />
					</aside>
				</>
			)}
		</main>
	);
}
