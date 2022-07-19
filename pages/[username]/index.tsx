import {
	collection,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	Timestamp,
	where,
	writeBatch,
} from 'firebase/firestore';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
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
	let user = userDoc.data();

	const postsRef = collection(userDoc.ref, 'posts');
	const postsQuery = query(
		postsRef,
		where('published', '==', true),
		orderBy('createdAt', 'desc'),
		limit(5)
	);
	const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

	const postArr = {
		'hello-world': {
			content:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis soluta atque voluptatum laudantium, dolorum ipsam. Facilis veritatis in, nisi ad aperiam non! Ex non libero consectetur, beatae ratione atque asperiores!',
			createdAt: Timestamp.fromDate(new Date()),
			heartCount: 0,
			published: true,
			slug: 'hello-world',
			title: 'Hello world',
			uid: '35zAk16V76baDbGMJj1Q3KtqZkS2',
			updatedAt: Timestamp.fromDate(new Date()),
			username: 'hungviet91',
		},
		'new-day': {
			content:
				'123 Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos delectus a esse reiciendis harum. Eos sed libero dolorum sint esse exercitationem animi. Cupiditate praesentium perferendis veniam corrupti quaerat architecto odio.',
			createdAt: Timestamp.fromDate(new Date()),
			heartCount: 0,
			published: true,
			slug: 'new-day',
			title: 'New day',
			uid: '35zAk16V76baDbGMJj1Q3KtqZkS2',
			updatedAt: Timestamp.fromDate(new Date()),
			username: 'hungviet91',
		},
	};

	const batch = writeBatch(firestore);
	Object.entries(postArr).forEach(([id, post]) => {
		batch.set(doc(userDoc.ref, 'posts', id), post);
	});
	batch.commit();

	return {
		props: { user, posts }, // will be passed to the page component as props
	};
}

export default UserProfilePage;
