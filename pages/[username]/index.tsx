import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import PostFeed from './components/PostFeed';
import UserProfile from './components/UserProfile';

type Props = {
	user: any;
	posts: any[];
};

const UserProfilePage = ({ user, posts }: Props) => {
	return (
		<main>
			<UserProfile username={user.displayName} />
			<PostFeed posts={posts} />
		</main>
	);
};

export async function getServerSideProps({ query: q }: any) {
	const { username } = q;

	const userDoc = await getUserWithUsername(username);

	// If no user, short circuit to 404 page
	if (!userDoc) {
		return {
			notFound: true,
		};
	}

	// JSON serializable data
	let user = null;
	let posts = null;

	if (userDoc) {
		user = userDoc.data();
		const postsQuery = query(
			collection(userDoc.ref, 'posts'),
			where('published', '==', true),
			orderBy('createdAt', 'desc'),
			limit(5)
		);
		posts = (await getDocs(postsQuery)).docs.map(postToJSON);
	}

	return {
		props: { user, posts }, // will be passed to the page component as props
	};
}

export default UserProfilePage;
