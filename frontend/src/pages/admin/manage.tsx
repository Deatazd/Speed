import { useState, useEffect } from 'react';
import formStyles from '../../styles/Form.module.scss';

const ManageArticles = () => {
    interface Article {
        _id: string;
        title: string;
        claim: string;
    }

    const [articles, setArticles] = useState<Article[]>([]);

    const fetchArticles = async () => {
        try {
            const response = await fetch('http://localhost:8082/admin/articles');
            if (response.ok) {
                const data = await response.json();
                setArticles(data);
            } else {
                console.error('Failed to fetch articles', response.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching articles:', error);
        }
    };

    const deleteArticle = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8082/admin/articles/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setArticles(articles.filter(article => article._id !== id));
            } else {
                console.error('Failed to delete article', response.status);
            }
        } catch (error) {
            console.error('An error occurred while deleting the article:', error);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <div className="container">
            <h1>Manage Articles</h1>
            {articles.length > 0 ? (
                <div className={formStyles.articleList}>
                    {articles.map((article) => (
                        <div key={article._id} className={formStyles.articleItem}>
                            <h2>{article.title}</h2>
                            <p>{article.claim}</p>
                            <button onClick={() => deleteArticle(article._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No articles available for management.</p>
            )}
        </div>
    );
};

export default ManageArticles;
