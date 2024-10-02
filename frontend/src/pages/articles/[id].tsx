import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Rating from '../../components/feedback/Rating';
import CommentSection from '../../components/feedback/CommentSection';

const ArticleDetails = () => {
    const router = useRouter();
    const { id } = router.query;  // 从动态路由中获取 articleId
    const articleId: string = typeof id === 'string' ? id : '';

    interface Article {
        title: string;
        authors: string[];
        source: string;
        pubyear: number;
        claim: string;
        evidence: string;
    }

    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        const fetchArticleDetails = async () => {
            if (articleId) {
                try {
                    const response = await fetch(`http://localhost:8082/articles/${articleId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setArticle(data);
                    } else {
                        console.error('Failed to fetch article details', response.status);
                    }
                } catch (error) {
                    console.error('An error occurred while fetching article details:', error);
                }
            }
        };

        fetchArticleDetails();
    }, [articleId]);

    if (!article) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container">
            <h1>{article.title}</h1>
            <p><strong>Authors:</strong> {article.authors.join(', ')}</p>
            <p><strong>Source:</strong> {article.source}</p>
            <p><strong>Year:</strong> {article.pubyear}</p>
            <p><strong>Claim:</strong> {article.claim}</p>
            <p><strong>Evidence:</strong> {article.evidence}</p>

            <Rating articleId={articleId} />
            <CommentSection articleId={articleId} />
        </div>
    );
};

export default ArticleDetails;
