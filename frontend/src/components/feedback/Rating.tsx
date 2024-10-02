import { useState } from 'react';

interface Props {
    articleId: string;  // 显式声明类型
}

const Rating: React.FC<Props> = ({ articleId }) => {
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    const handleRatingSubmit = async () => {
        const response = await fetch(`http://localhost:8082/articles/${articleId}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating }),
        });

        if (response.ok) {
            const data = await response.json();
            setAverageRating(data.averageRating);  // Assuming the updated average rating is returned
        }
    };

    return (
        <div>
            <h3>Average Rating: {averageRating}</h3>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <button onClick={handleRatingSubmit}>Submit Rating</button>
        </div>
    );
};

export default Rating;
