// src/pages/articles/[id].tsx

import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useState } from "react";

interface BackendArticle {
    id: string;
    title: string;
    authors: string[];
    source: string;
    pubyear: number | string;
    doi: string;
    claim: string;
    evidence: string;
    averageRating?: number;
    comments?: string[];
}

interface Article {
    id: string;
    title: string;
    authors: string; // Comma-separated string
    source: string;
    pubyear: number | string;
    doi: string;
    claim: string;
    evidence: string;
    averageRating?: number;
    comments?: string[];
}

type ArticleProps = {
    article: Article;
};

const ArticleDetail: NextPage<ArticleProps> = ({ article }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [averageRating, setAverageRating] = useState<number | undefined>(article.averageRating);
    const [comments, setComments] = useState<string[]>(article.comments || []);

    const handleRatingSubmit = async () => {
        if (rating < 1 || rating > 5) {
            alert("Rating must be between 1 and 5.");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/rate/${article.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rating }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedArticle: BackendArticle = await response.json();
            setAverageRating(updatedArticle.averageRating);
            setRating(0); // Reset rating
        } catch (error) {
            console.error("Failed to submit rating:", error);
        }
    };

    const handleCommentSubmit = async () => {
        if (!comment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/comment/${article.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ comment }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedArticle: BackendArticle = await response.json();
            setComments(updatedArticle.comments || []);
            setComment(""); // Reset comment
        } catch (error) {
            console.error("Failed to submit comment:", error);
        }
    };

    return (
        <div className="container">
            <h1>{article.title}</h1>
            <p>Authors: {article.authors}</p>
            <p>Source: {article.source}</p>
            <p>Publication Year: {article.pubyear}</p>
            <p>DOI: {article.doi}</p>
            <p>Claim: {article.claim}</p>
            <p>Evidence: {article.evidence}</p>
            <p>Average Rating: {averageRating !== undefined ? averageRating.toFixed(2) : "No ratings yet"}</p>

            <div className="rating-section">
                <h3>Rate this Article:</h3>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    <option value={0}>Select Rating</option>
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                    ))}
                </select>
                <button onClick={handleRatingSubmit}>Submit Rating</button>
            </div>

            <div className="comment-section">
                <h3>Leave a Comment:</h3>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                ></textarea>
                <button onClick={handleCommentSubmit}>Submit Comment</button>
            </div>

            <div className="comments-list">
                <h3>Comments:</h3>
                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    <ul>
                        {comments.map((c, index) => (
                            <li key={index}>{c}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`);
        const data: BackendArticle[] = await response.json();

        const paths = data.map((article: BackendArticle) => ({
            params: { id: article.id },
        }));

        return {
            paths,
            fallback: "blocking",
        };
    } catch (error) {
        console.error("Failed to fetch articles for paths:", error);
        return {
            paths: [],
            fallback: "blocking",
        };
    }
};

export const getStaticProps: GetStaticProps<ArticleProps> = async (context) => {
    const { id } = context.params!;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BackendArticle[] = await response.json();

        const articleData = data.find((article: BackendArticle) => article.id === id);

        if (!articleData) {
            return {
                notFound: true,
            };
        }

        const article: Article = {
            id: articleData.id,
            title: articleData.title,
            authors: articleData.authors.join(", "), // Convert array to comma-separated string
            source: articleData.source,
            pubyear: articleData.pubyear,
            doi: articleData.doi,
            claim: articleData.claim,
            evidence: articleData.evidence,
            averageRating: articleData.averageRating,
            comments: articleData.comments,
        };

        return {
            props: {
                article,
            },
            revalidate: 10, // Revalidate every 10 seconds
        };
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return {
            notFound: true,
        };
    }
};

export default ArticleDetail;
