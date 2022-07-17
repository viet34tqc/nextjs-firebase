import type { NextPage } from 'next';
import toast from 'react-hot-toast';

const Home: NextPage = () => {
	return <button onClick={() => toast.success('hello world')}>Toast</button>;
};

export default Home;
