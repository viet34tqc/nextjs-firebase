import { useUserContext } from '@lib/UserContext';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
	children: ReactNode;
	fallback?: ReactNode;
};

const AuthCheck = (props: Props) => {
	const { username } = useUserContext();

	return username ? (
		<>{props.children}</>
	) : (
		<>{props.fallback || <Link href="/enter">You must be signed in</Link>}</>
	);
};

export default AuthCheck;
