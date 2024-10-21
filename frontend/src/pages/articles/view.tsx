// src/pages/articles/view.tsx

import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable";
import { Container, Typography, Paper } from "@mui/material";

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

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                View Approved Articles
            </Typography>
            {articles.length === 0 ? (
                <Typography variant="h6">No approved articles available.</Typography>
            ) : (
                <Paper elevation={3} sx={{ p: 2 }}>
                    <SortableTable 
                        headers={headers} 
                        data={articles} 
                        rowKey="id"
                    />
                </Paper>
            )}
        </Container>
    );
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/approved`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const articles: ArticlesInterface[] = data.map((article: { 
            id?: string; 
            _id?: string; 
            title: string; 
            authors: string[] | string; 
            source: string; 
            pubyear?: number; 
            doi: string; 
            claim: string; 
            evidence: string; 
            averageRating?: number; 
        }) => ({
            id: article.id ?? article._id,
            title: article.title,
            authors: Array.isArray(article.authors) ? article.authors.join(', ') : article.authors,
            source: article.source,
            pubyear: article.pubyear ?? "N/A",
            doi: article.doi,
            claim: article.claim,
            evidence: article.evidence,
            averageRating: article.averageRating ?? 0,
        }));

        console.log("Fetched articles:", articles); // 调试日志

        return {
            props: {
                articles,
            },
            revalidate: 10,
        };
    } catch (error: unknown) {
        console.error("Failed to fetch articles:", error);
        return {
            props: {
                articles: [],
            },
        };
    }
};

export default ViewArticles;
