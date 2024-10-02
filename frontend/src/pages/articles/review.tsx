import { useState, useEffect } from 'react';

const ReviewArticles = () => {
    interface Article {
        _id: string;
        title: string;
        claim: string;
    }
    
    const [pendingArticles, setPendingArticles] = useState<Article[]>([]);

    const fetchPendingArticles = async () => {
        try {
            const response = await fetch('http://localhost:8082/admin/pending-articles');
            if (response.ok) {
                const data = await response.json();
                setPendingArticles(data);
            } else {
                console.error('Failed to fetch pending articles', response.status);
            }
        } catch (error) {
            console.error('Error fetching pending articles:', error);
        }
    };

    const handleApprove = async (id: string) => {
        await fetch(`http://localhost:8082/admin/approve/${id}`, {
            method: 'POST',
        });
        fetchPendingArticles();  // 更新待审核文章
    };

    const handleReject = async (id: string) => {
        await fetch(`http://localhost:8082/admin/reject/${id}`, {
            method: 'POST',
        });
        fetchPendingArticles();  // 更新待审核文章
    };

    useEffect(() => {
        fetchPendingArticles();
    }, []);

    return (
        <div className="container">
            <h1>Review Pending Articles</h1>
            {pendingArticles.length > 0 ? (
                <ul>
                    {pendingArticles.map((article) => (
                        <li key={article._id}>
                            <h3>{article.title}</h3>
                            <p>{article.claim}</p>
                            <button onClick={() => handleApprove(article._id)}>Approve</button>
                            <button onClick={() => handleReject(article._id)}>Reject</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending articles.</p>
            )}
        </div>
    );
};

export default ReviewArticles;
