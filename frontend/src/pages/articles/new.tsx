// src/pages/articles/new.tsx

import { NextPage } from "next";
import { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
} from "@mui/material";

interface NewArticle {
    title: string;
    authors: string;
    source: string;
    pubyear: number;
    doi: string;
    claim: string;
    evidence: string;
}

const NewArticlePage: NextPage = () => {
    const [formData, setFormData] = useState<NewArticle>({
        title: "",
        authors: "",
        source: "",
        pubyear: new Date().getFullYear(),
        doi: "",
        claim: "",
        evidence: "",
    });

    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "pubyear" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 简单的表单验证
        for (const key in formData) {
            if (formData[key as keyof NewArticle] === "") {
                setMessage({ type: "error", text: "所有字段都是必填的。" });
                return;
            }
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setMessage({ type: "success", text: "submit success！" });
            setFormData({
                title: "",
                authors: "",
                source: "",
                pubyear: new Date().getFullYear(),
                doi: "",
                claim: "",
                evidence: "",
            });
        } catch (error) {
            console.error("Failed to submit article:", error);
            setMessage({ type: "error", text: "something wrong,retry。" });
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Submit New Article
                </Typography>
                {message && (
                    <Alert severity={message.type} sx={{ mb: 2 }}>
                        {message.text}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Authors"
                        name="authors"
                        value={formData.authors}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        helperText="Separate multiple authors with commas"
                    />
                    <TextField
                        label="Source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Publication Year"
                        name="pubyear"
                        type="number"
                        value={formData.pubyear}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
                    />
                    <TextField
                        label="DOI"
                        name="doi"
                        value={formData.doi}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Claim"
                        name="claim"
                        value={formData.claim}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        label="Evidence"
                        name="evidence"
                        value={formData.evidence}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default NewArticlePage;
