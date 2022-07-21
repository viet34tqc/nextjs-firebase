type Props = {
    post: any
};

export function getServerSideProps() {
    return {
        props: {
            post: null
        }
    }
}

const EditPostPage = ({post}: Props) => {
return <main>EditPostPage</main>;
};

export default EditPostPage;
