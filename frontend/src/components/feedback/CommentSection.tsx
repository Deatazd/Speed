import { useState } from 'react';

interface Props {
    articleId: string;  // 显式声明类型
}

const CommentSection: React.FC<Props> = ({ articleId }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<string[]>([]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:8082/articles/${articleId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment }),
        });

        if (response.ok) {
            const data = await response.json();
            setComments(data.comments);  // Assuming the updated comments array is returned
        }
    };

    return (
        <div>
            <h3>Comments</h3>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit">Add Comment</button>
            </form>
            <div>
                {comments.map((c, index) => (
                    <p key={index}>{c}</p>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
