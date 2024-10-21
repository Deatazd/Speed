// frontend/src/pages/articles/review.tsx

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
  authors: string[];
  source: string;
  pubyear: number;
  doi: string;
  claim: string;
  evidence: string;
  status: string;
}

const ReviewPage: NextPage = () => {
  const [managedArticles, setManagedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // 跟踪每个操作的加载状态

  useEffect(() => {
    const fetchManagedArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/managed`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Article[] = await response.json();
        setManagedArticles(data);
      } catch (error) {
        console.error("Failed to fetch managed articles:", error);
        setMessage({ type: "error", text: "Unable to fetch managed articles." });
      } finally {
        setLoading(false);
      }
    };

    fetchManagedArticles();
  }, []);

  // 处理批准操作
  const handleApprove = async (id: string) => {
    setActionLoading(id); // 开始加载状态
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/approve/${id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedArticle = await response.json();
      setManagedArticles(prev => prev.filter(article => article.id !== id));
      setMessage({ type: "success", text: `Article "${updatedArticle.title}" approved.` });
    } catch (error) {
      console.error("Failed to approve article:", error);
      setMessage({ type: "error", text: "Failed to approve article. Please try again." });
    } finally {
      setActionLoading(null); // 结束加载状态
    }
  };

  // 处理拒绝操作
  const handleReject = async (id: string) => {
    setActionLoading(id); // 开始加载状态
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/reject/${id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedArticle = await response.json();
      setManagedArticles(prev => prev.filter(article => article.id !== id));
      setMessage({ type: "success", text: `Article "${updatedArticle.title}" rejected.` });
    } catch (error) {
      console.error("Failed to reject article:", error);
      setMessage({ type: "error", text: "Failed to reject article. Please try again." });
    } finally {
      setActionLoading(null); // 结束加载状态
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
        Review Managed Articles
      </Typography>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}
      {managedArticles.length === 0 ? (
        <Typography variant="h6">No articles available for review.</Typography>
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
              {managedArticles.map(article => (
                <TableRow key={article.id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.authors.join(', ')}</TableCell>
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
                        onClick={() => handleApprove(article.id)}
                        disabled={actionLoading === article.id}
                      >
                        {actionLoading === article.id ? <CircularProgress size={20} color="inherit" /> : 'Approve'}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleReject(article.id)}
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
