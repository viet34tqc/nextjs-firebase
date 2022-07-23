import AuthCheck from '@components/AuthCheck';
import PostManager from './components/PostManager';

export default function AdminPostEdit() {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	);
}
