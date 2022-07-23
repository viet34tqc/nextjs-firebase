import styles from '@styles/Admin.module.css';
import { serverTimestamp, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function PostForm({ defaultValues, postRef, preview }: any) {
	const {
		register,
		handleSubmit,
		formState,
		reset,
		watch,
	} = useForm<{content: string, published: boolean}>({
		defaultValues,
		mode: 'onChange',
	});

	const { isValid, isDirty, errors } = formState;

	const updatePost = async ({ content, published }: any) => {
		await updateDoc(postRef, {
			content,
			published,
			updatedAt: serverTimestamp(),
		});

		reset({ content, published });

		toast.success('Post updated successfully!');
	};

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{preview && (
				<div className="card">
					<ReactMarkdown>{watch('content')}</ReactMarkdown>
				</div>
			)}

			<div className={preview ? styles.hidden : styles.controls}>
				<textarea
					{...register('content', {
						maxLength: { value: 20000, message: 'content is too long' },
						minLength: { value: 10, message: 'content is too short' },
						required: { value: true, message: 'content is required' },
					})}
				></textarea>

				{errors.content && (
					<p className="text-danger">{errors.content?.message}</p>
				)}

				<fieldset>
					<input
						className={styles.checkbox}
						type="checkbox"
						{...register('published')}
					/>
					<label>Published</label>
				</fieldset>

				<button
					type="submit"
					className="btn-green"
					disabled={!isDirty || !isValid}
				>
					Save Changes
				</button>
			</div>
		</form>
	);
}
