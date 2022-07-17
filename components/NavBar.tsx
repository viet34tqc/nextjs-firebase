import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { useUserContext } from '../lib/UserContext';

const NavBar = () => {
	const { user, username } = useUserContext();
	const router = useRouter();
	async function handleSignOut() {
		await auth.signOut();
		router.push('/login');
	}
	return (
		<nav className="navbar">
			<ul>
				<li>
					<Link href="/">
						<button className="btn-logo">NXT</button>
					</Link>
				</li>

				{/* user is signed-in and has username */}
				{user && (
					<>
						<li className="push-left">
							<button onClick={handleSignOut}>Sign Out</button>
						</li>
						<li>
							<Link href="/admin">
								<button className="btn-blue">Write Posts</button>
							</Link>
						</li>
						{username && (
							<li>
								<Link href={`/${username}`}>{username}</Link>
							</li>
						)}
					</>
				)}

				{/* user is not signed OR has not created username */}
				{!user && (
					<li style={{ display: 'flex', alignItems: 'center' }}>
						<Link href="/login">
							<button className="btn-blue">Log in</button>
						</Link>
						<Link href="/register">
							<button>Register</button>
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
};

export default NavBar;
