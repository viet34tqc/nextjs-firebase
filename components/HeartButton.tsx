import { increment, updateDoc } from 'firebase/firestore';
import { useReducer } from 'react';

type Props = {
	postRef: any;
};

const HeartButton = ({ postRef }: Props) => {
	const [heart, toggleHeart] = useReducer(heart => !heart, true);

	// Create a user-to-post relationship
	const addHeart = async () => {
		await updateDoc(postRef, { heartCount: increment(1) });
	};

	// Remove a user-to-post relationship
	const removeHeart = async () => {
		await updateDoc(postRef, { heartCount: increment(-1) });
	};

	return !heart ? (
		<button onClick={removeHeart}>💔 Unheart</button>
	) : (
		<button onClick={addHeart}>💗 Heart</button>
	);
};

export default HeartButton;
