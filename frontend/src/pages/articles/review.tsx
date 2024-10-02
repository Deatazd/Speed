// src/pages/articles/review.tsx

import { NextPage } from "next";
import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Alert,
    CircularProgress,
    Box,
} from "@mui/material";

interface Article {
    id: string;
    title: string;
    authors: string;
    source: string;
    pubyear: number | string;
    doi: string;
    claim: string;
    evidence: string;
    status: string;
}

const ReviewPage: NextPage = () => {
    const [pendingArticles, setPendingArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null); // Track loading state for individual actions

    useEffect(() => {
        const fetchPendingArticles = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/pending`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Article[] = await response.json();
                setPendingArticles(data);
            } catch (error) {
                console.error("Failed to fetch pending articles:", error);
                setMessage({ type: "error", text: "Unable to fetch pending articles." });
            } finally {
                setLoading(false);
            }
        };

        fetchPendingArticles();
    }, []);

    const handleApproval = async (id: string) => {
        setActionLoading(id); // Start loading for this action
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/approve/${id}`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Approval response:', data);

            setPendingArticles(prev => prev.filter(article => article.id !== id));
            setMessage({ type: "success", text: "Article approved." });
        } catch (error) {
            console.error("Failed to approve article:", error);
            setMessage({ type: "error", text: "Failed to approve article. Please try again." });
        } finally {
            setActionLoading(null); // End loading for this action
        }
    };

    const handleRejection = async (id: string) => {
        setActionLoading(id); // Start loading for this action
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/reject/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Rejection response:', data);

            setPendingArticles(prev => prev.filter(article => article.id !== id));
            setMessage({ type: "success", text: "Article rejected and deleted." });
        } catch (error) {
            console.error("Failed to reject article:", error);
            setMessage({ type: "error", text: "Failed to reject article. Please try again." });
        } finally {
            setActionLoading(null); // End loading for this action
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ textAlign: 'center', mt: 5 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Review Articles
            </Typography>
            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}
            {pendingArticles.length === 0 ? (
                <Typography variant="h6">No articles pending review.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Authors</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Publication Year</TableCell>
                                <TableCell>DOI</TableCell>
                                <TableCell>Claim</TableCell>
                                <TableCell>Evidence</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingArticles.map(article => (
                                <TableRow key={article.id}>
                                    <TableCell>{article.title}</TableCell>
                                    <TableCell>{article.authors}</TableCell>
                                    <TableCell>{article.source}</TableCell>
                                    <TableCell>{article.pubyear}</TableCell>
                                    <TableCell>{article.doi}</TableCell>
                                    <TableCell>{article.claim}</TableCell>
                                    <TableCell>{article.evidence}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={() => handleApproval(article.id)}
                                                disabled={actionLoading === article.id}
                                            >
                                                {actionLoading === article.id ? <CircularProgress size={20} color="inherit" /> : 'Approve'}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleRejection(article.id)}
                                                disabled={actionLoading === article.id}
                                            >
                                                {actionLoading === article.id ? <CircularProgress size={20} color="inherit" /> : 'Reject'}
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default ReviewPage;
