import PostFeed from '@components/PostFeed';
import { firestore } from '@lib/firebase';
import { useUserContext } from '@lib/UserContext';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

type Props = {};

const PostList = (props: Props) => {
	const { user } = useUserContext();
	const userRef = doc(firestore, 'users', user.uid);
	const postsRef = collection(userRef, 'posts');
	const q = query(postsRef, orderBy('createdAt'));
	const [querySnapshot] = useCollection(q);

	const posts = querySnapshot?.docs.map(doc => doc.data());

    return (
		<>
			<h1>Manage your Posts</h1>
			<PostFeed posts={posts} admin />
		</>
	);
};

export default PostList;
