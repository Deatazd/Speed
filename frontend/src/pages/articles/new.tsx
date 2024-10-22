// frontend/src/pages/articles/new.tsx

import { NextPage } from "next";
import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

interface NewArticle {
  title: string;
  authors: string; // 用逗号分隔的字符串
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
  const [submitting, setSubmitting] = useState<boolean>(false); // 声明提交状态

  // 处理表单输入变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pubyear" ? Number(value) : value,
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); // 开始提交

    // 简单的表单验证
    for (const key in formData) {
      if (formData[key as keyof NewArticle] === "") {
        setMessage({ type: "error", text: "All fields are required." });
        setSubmitting(false);
        return;
      }
    }

    // 将作者字符串拆分为数组
    const authorsArray = formData.authors
      .split(",")
      .map((author) => author.trim())
      .filter((author) => author !== "");

    if (authorsArray.length === 0) {
      setMessage({ type: "error", text: "Please provide at least one author." });
      setSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      authors: authorsArray, // 将 authors 转换为数组
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      setMessage({ type: "success", text: "Submission successful!" });
      setFormData({
        title: "",
        authors: "",
        source: "",
        pubyear: new Date().getFullYear(),
        doi: "",
        claim: "",
        evidence: "",
      });
    } catch (error: unknown) {
      let errorMessage = "Submission failed. Please try again.";
      if (error instanceof Error) {
        errorMessage = `Submission failed: ${error.message}`;
      }
      console.error("Failed to submit article:", error);
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSubmitting(false); // 结束提交
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default NewArticlePage;
