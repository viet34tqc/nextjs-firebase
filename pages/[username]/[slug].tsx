import AuthCheck from '@components/AuthCheck';
import HeartButton from '@components/HeartButton';
import Metatags from '@components/Metatags';
import { useUserContext } from '@lib/UserContext';
import styles from '@styles/Post.module.css';
import { collectionGroup, doc, getDoc, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import PostContent from './components/PostContent';

export async function getStaticProps({ params }: any) {
	const { username, slug } = params;

	const userDoc = await getUserWithUsername(username);

	let post;
	let path;

	if (userDoc) {
		const postRef = doc(userDoc.ref, 'posts', slug);
		post = postToJSON(await getDoc(postRef));

		path = postRef.path;
	}

	return {
		props: {
			post,
			path,
		},
		revalidate: 5000,
	};
}

export async function getStaticPaths() {
	const postsSnap = await getDocs(collectionGroup(firestore, 'posts'));
	const paths = postsSnap.docs.map(doc => {
		const { slug, username } = doc.data();
		return {
			params: { username, slug },
		};
	});

	return {
		paths,
		// when a user navigate to a page that has not pre-rendered yet (that post might be added in database but not fetched yet)
		// then nextjs will fallback to server-side rendering.
		// Without this feature, you have to rebuild and redeploy your entire site
		fallback: 'blocking',
	};
}

const Post = ({ post, path }: any) => {
	const postRef = doc(firestore, path);
	const [realtimePost] = useDocumentData(postRef);
	const nextPost = realtimePost || post;
	const { user: currentUser } = useUserContext();

	return (
		<main className={styles.container}>
			<Metatags title={post.title} description={post.title} />
			<section>
				<PostContent post={nextPost} />
			</section>

			<aside className="card">
				<p>
					<strong>{post.heartCount || 0} 🤍</strong>
				</p>

				<AuthCheck
					fallback={
						<Link href="/enter">
							<button>💗 Sign Up</button>
						</Link>
					}
				>
					<HeartButton postRef={postRef} />
				</AuthCheck>

				{currentUser?.uid === post.uid && (
					<Link href={`/admin/${post.slug}`}>
						<button className="btn-blue">Edit Post</button>
					</Link>
				)}
			</aside>
		</main>
	);
};

export default Post;
