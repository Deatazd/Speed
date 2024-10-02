import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable";
import { useState } from "react";
import { Container, Typography, Alert, Paper } from "@mui/material";

interface ArticlesInterface {
    id: string;
    title: string;
    authors: string;
    source: string;
    pubyear: number | string;
    doi: string;
    claim: string;
    evidence: string;
    averageRating: number;
}

type ArticlesProps = {
    articles: ArticlesInterface[];
};

const ViewArticles: NextPage<ArticlesProps> = ({ articles }) => {
    const headers: { key: keyof ArticlesInterface; label: string }[] = [
        { key: "title", label: "Title" },
        { key: "authors", label: "Authors" },
        { key: "source", label: "Source" },
        { key: "pubyear", label: "Publication Year" },
        { key: "doi", label: "DOI" },
        { key: "claim", label: "Claim" },
        { key: "evidence", label: "Evidence" },
        { key: "averageRating", label: "Average Rating" },
    ];

    const [viewArticles] = useState<ArticlesInterface[]>(articles);
    const [message] = useState<string>("");

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                View Articles
            </Typography>
            {message && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}
            {viewArticles.length === 0 ? (
                <Typography variant="h6">No articles available.</Typography>
            ) : (
                <Paper elevation={3} sx={{ p: 2 }}>
                    <SortableTable 
                        headers={headers} 
                        data={viewArticles} 
                        rowKey="id"
                    />
                </Paper>
            )}
        </Container>
    );
};

// 获取后端数据并处理 pubyear 和 averageRating 字段
export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/view`); 
        const data = await response.json();

        const articles: ArticlesInterface[] = data.map((article: { 
            id?: string; 
            _id?: string; 
            title: string; 
            authors: string; 
            source: string; 
            pubyear?: number; 
            doi: string; 
            claim: string; 
            evidence: string; 
            averageRating?: number; 
        }) => ({
            id: article.id ?? article._id,
            title: article.title,
            authors: article.authors,
            source: article.source,
            pubyear: article.pubyear ?? "N/A",
            doi: article.doi,
            claim: article.claim,
            evidence: article.evidence,
            averageRating: article.averageRating ?? 0,
        }));

        return {
            props: {
                articles,
            },
            revalidate: 10,
        };
    } catch (error) {
        console.error("Failed to fetch articles:", error);
        return {
            props: {
                articles: [],
            },
        };
    }
};

export default ViewArticles;
