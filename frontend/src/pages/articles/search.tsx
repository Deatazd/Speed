// src/pages/articles/search.tsx

import { NextPage } from "next";
import { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
} from "@mui/material";

interface SearchParams {
    method?: string;
    claim?: string;
    startYear?: number;
    endYear?: number;
    studyType?: string;
    evidenceResult?: string;
}

interface SearchArticle {
    id: string;
    title: string;
    authors: string;
    source: string;
    pubyear: number | string;
    doi: string;
    claim: string;
    evidence: string;
    // 其他字段可以根据需要添加
}

const SearchPage: NextPage = () => {
    const [searchParams, setSearchParams] = useState<SearchParams>({});
    const [results, setResults] = useState<SearchArticle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: "info" | "error"; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: name.includes("year") ? (value ? Number(value) : undefined) : value,
        }));
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setResults([]);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    method: searchParams.method || undefined,
                    claim: searchParams.claim || undefined,
                    startYear: searchParams.startYear || undefined,
                    endYear: searchParams.endYear || undefined,
                    studyType: searchParams.studyType || undefined,
                    evidenceResult: searchParams.evidenceResult || undefined,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: SearchArticle[] = await response.json();
            setResults(data);
            if (data.length === 0) {
                setMessage({ type: "info", text: "No articles found." });
            }
        } catch (error) {
            console.error("Failed to search articles:", error);
            setMessage({ type: "error", text: "Search failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 5, mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Search Articles
                </Typography>
                {message && (
                    <Alert severity={message.type} sx={{ mb: 2 }}>
                        {message.text}
                    </Alert>
                )}
                <form onSubmit={handleSearch}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Software Engineering Method"
                            name="method"
                            value={searchParams.method || ""}
                            onChange={handleChange}
                            placeholder="e.g., Test-Driven Development"
                        />
                        <TextField
                            label="Claim"
                            name="claim"
                            value={searchParams.claim || ""}
                            onChange={handleChange}
                            placeholder="e.g., Improves Code Quality"
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                label="Publication Year From"
                                name="startYear"
                                type="number"
                                value={searchParams.startYear || ""}
                                onChange={handleChange}
                                InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
                                fullWidth
                            />
                            <TextField
                                label="To"
                                name="endYear"
                                type="number"
                                value={searchParams.endYear || ""}
                                onChange={handleChange}
                                InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
                                fullWidth
                            />
                        </Box>
                        <TextField
                            select
                            label="Study Type"
                            name="studyType"
                            value={searchParams.studyType || ""}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select Type</MenuItem>
                            <MenuItem value="case-study">Case Study</MenuItem>
                            <MenuItem value="experiment">Experiment</MenuItem>
                            <MenuItem value="survey">Survey</MenuItem>
                            {/* Add more types as needed */}
                        </TextField>
                        <TextField
                            select
                            label="Evidence Result"
                            name="evidenceResult"
                            value={searchParams.evidenceResult || ""}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select Result</MenuItem>
                            <MenuItem value="agree">Agree</MenuItem>
                            <MenuItem value="disagree">Disagree</MenuItem>
                            {/* Add more results as needed */}
                        </TextField>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
                        </Button>
                    </Box>
                </form>
            </Box>

            {results.length > 0 && (
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h5" gutterBottom>
                        Search Results
                    </Typography>
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map(article => (
                                    <TableRow key={article.id}>
                                        <TableCell>{article.title}</TableCell>
                                        <TableCell>{article.authors}</TableCell>
                                        <TableCell>{article.source}</TableCell>
                                        <TableCell>{article.pubyear}</TableCell>
                                        <TableCell>{article.doi}</TableCell>
                                        <TableCell>{article.claim}</TableCell>
                                        <TableCell>{article.evidence}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Container>
    );
};

export default SearchPage;
