import AuthCheck from '@components/AuthCheck';
import CreateNewPost from './components/CreateNewPost';
import PostList from './components/PostList';

type Props = {};

const AdminPostPage = (props: Props) => {
	return (
		<main>
			<AuthCheck>
				<PostList />
				<CreateNewPost />
			</AuthCheck>
		</main>
	);
};

export default AdminPostPage;
