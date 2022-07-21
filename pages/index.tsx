import {
	collectionGroup,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	Timestamp,
	where,
} from 'firebase/firestore';
import type { NextPage } from 'next';
import { useState } from 'react';
import Loader from '../components/Loader';
import { firestore, postToJSON } from '../lib/firebase';
import PostFeed from '../components/PostFeed';

const LIMIT = 1;

export async function getServerSideProps() {
	const postsRef = collectionGroup(firestore, 'posts');
	const postsQuery = query(
		postsRef,
		where('published', '==', true),
		orderBy('createdAt', 'desc'),
		limit(LIMIT)
	);
	const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

	return {
		props: {
			posts,
		},
	};
}

const Home: NextPage = (props: any) => {
	const [posts, setPosts] = useState(props.posts);
	const [loading, setLoading] = useState(false);

	const [postsEnd, setPostsEnd] = useState(false);

	// Get next page in pagination query
	const getMorePosts = async () => {
		setLoading(true);
		const last = posts[posts.length - 1];

		const cursor =
			typeof last.createdAt === 'number'
				? Timestamp.fromMillis(last.createdAt)
				: last.createdAt;

		const q = query(
			collectionGroup(firestore, 'posts'),
			where('published', '==', true),
			orderBy('createdAt', 'desc'),
			startAfter(cursor),
			limit(LIMIT)
		);

		const newPosts = (await getDocs(q)).docs.map(doc => doc.data());

		setPosts(posts.concat(newPosts));
		setLoading(false);

		if (newPosts.length < LIMIT) {
			setPostsEnd(true);
		}
	};
	return (
		<main>
			<PostFeed posts={posts} />

			{!loading && !postsEnd && (
				<button onClick={getMorePosts}>Load more</button>
			)}

			<Loader show={loading} />

			{postsEnd && 'You have reached the end!'}
		</main>
	);
};

export default Home;
