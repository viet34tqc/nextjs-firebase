import { createContext, ReactNode, useContext } from 'react';
import { useUserData } from './hooks';

interface IUserContext {
	user: any;
	email: string;
	username: string | null;
}

export const UserContext = createContext<IUserContext | null>({
	user: {},
	email: '',
	username: '',
});

const UserContextProvider = ({ children }: { children: ReactNode }) => {
	const { user, username } = useUserData();

	const value = {
		user,
		username,
	};
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserContextProvider;
export const useUserContext = () => {
	const context = useContext(UserContext) as IUserContext;
	if (context === undefined) {
		throw new Error('useSomething must be used within a SomethingProvider');
	}
	return context;
};
