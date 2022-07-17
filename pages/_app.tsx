import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import NavBar from '../components/NavBar';
import { useUserData } from '../lib/hooks';
import UserContextProvider from '../lib/UserContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserContextProvider>
			<NavBar />
			<Component {...pageProps} />
			<Toaster />
		</UserContextProvider>
	);
}

export default MyApp;
