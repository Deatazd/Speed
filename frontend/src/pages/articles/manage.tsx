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
    TextField,
} from "@mui/material";
import { ManageAccounts } from "@mui/icons-material";  // 引入图标

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
    ratings: number[];
    averageRating: number;
    comments: string[];
    seMethod: string;
    studyType: string;
    evidenceResult: string;
}

interface ManageArticleDto {
    rating?: number;
    seMethod?: string;
    studyType?: string;
    evidenceResult?: string;
}

const ManagePage: NextPage = () => {
    const [approvedArticles, setApprovedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);  // Track loading state for individual actions
    const [manageData, setManageData] = useState<{ [key: string]: ManageArticleDto }>({});

    useEffect(() => {
        const fetchApprovedArticles = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/approved`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Article[] = await response.json();
                setApprovedArticles(data);
            } catch (error) {
                console.error("Failed to fetch approved articles:", error);
                setMessage({ type: "error", text: "Unable to fetch approved articles." });
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedArticles();
    }, []);

    const handleManage = async (id: string) => {
        setActionLoading(id);
        try {
            const manageArticleDto = manageData[id];
            if (!manageArticleDto || !manageArticleDto.rating) {
                throw new Error("Rating is required.");
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/manage/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(manageArticleDto),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedArticle: Article = await response.json();
            setApprovedArticles((prev) => prev.filter((article) => article.id !== id));
            setMessage({ type: "success", text: `Article "${updatedArticle.title}" managed successfully.` });
        } catch (error) {
            console.error("Failed to manage article:", error);
            setMessage({ type: "error", text: "Failed to manage article. Please try again." });
        } finally {
            setActionLoading(null);
        }
    };

    const handleInputChange = (id: string, field: keyof ManageArticleDto, value: string | number) => {
        setManageData((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: field === "rating" ? Number(value) : value,
            },
        }));
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Manage Articles
            </Typography>
            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}
            {approvedArticles.length === 0 ? (
                <Typography variant="h6">No articles available for management.</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Title</strong></TableCell>
                                <TableCell><strong>Authors</strong></TableCell>
                                <TableCell><strong>Source</strong></TableCell>
                                <TableCell><strong>Publication Year</strong></TableCell>
                                <TableCell><strong>DOI</strong></TableCell>
                                <TableCell><strong>Claim</strong></TableCell>
                                <TableCell><strong>Evidence</strong></TableCell>
                                <TableCell><strong>Rating (1-5)</strong></TableCell>
                                <TableCell><strong>SE Method</strong></TableCell>
                                <TableCell><strong>Study Type</strong></TableCell>
                                <TableCell><strong>Evidence Result</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {approvedArticles.map((article) => (
                                <TableRow key={article.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                    <TableCell>{article.title}</TableCell>
                                    <TableCell>{article.authors}</TableCell>
                                    <TableCell>{article.source}</TableCell>
                                    <TableCell>{article.pubyear}</TableCell>
                                    <TableCell>{article.doi}</TableCell>
                                    <TableCell>{article.claim}</TableCell>
                                    <TableCell>{article.evidence}</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="numeric"
                                            inputProps={{
                                                min: 1,
                                                max: 5,
                                                style: {
                                                    MozAppearance: 'textfield', // 去除 Firefox 的默认数字输入箭头
                                                },
                                            }}
                                            onInput={(e) => {
                                                const input = e.target as HTMLInputElement;
                                                if (input.value !== '') {
                                                    let value = parseInt(input.value);
                                                    if (value > 5) value = 5;
                                                    if (value < 1) value = 1;
                                                    input.value = value.toString();
                                                }
                                            }}
                                            value={manageData[article.id]?.rating || ''}
                                            onChange={(e) => handleInputChange(article.id, 'rating', e.target.value)}
                                            placeholder="1-5"
                                            fullWidth
                                            size="small"
                                        />

                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            value={manageData[article.id]?.seMethod || ''}
                                            onChange={(e) => handleInputChange(article.id, 'seMethod', e.target.value)}
                                            placeholder="SE Method"
                                            fullWidth
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={manageData[article.id]?.studyType || ''}
                                            onChange={(e) => handleInputChange(article.id, 'studyType', e.target.value)}
                                            placeholder="Study Type"
                                            fullWidth
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={manageData[article.id]?.evidenceResult || ''}
                                            onChange={(e) => handleInputChange(article.id, 'evidenceResult', e.target.value)}
                                            placeholder="Evidence Result"
                                            fullWidth
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<ManageAccounts />}
                                            onClick={() => handleManage(article.id)}
                                            disabled={actionLoading === article.id}
                                        >
                                            {actionLoading === article.id ? <CircularProgress size={20} color="inherit" /> : 'Manage'}
                                        </Button>
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

export default ManagePage;
