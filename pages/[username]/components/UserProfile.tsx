type UserProfileProps = {
	username: string | null;
};

const UserProfile = ({ username }: UserProfileProps) => {
	return (
		<div className="box-center">
			<h1>{username || 'Anonymous User'}</h1>
		</div>
	);
};

export default UserProfile;
