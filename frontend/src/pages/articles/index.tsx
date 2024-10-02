// src/pages/articles/index.tsx

import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable";

interface ArticlesInterface {
    id: string;
    title: string;
    authors: string;
    source: string;
    pubyear: number | string;
    doi: string;
    claim: string;
    evidence: string;
}

type ArticlesProps = {
    articles: ArticlesInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
    const headers: { key: keyof ArticlesInterface; label: string }[] = [
        { key: "title", label: "Title" },
        { key: "authors", label: "Authors" },
        { key: "source", label: "Source" },
        { key: "pubyear", label: "Publication Year" },
        { key: "doi", label: "DOI" },
        { key: "claim", label: "Claim" },
        { key: "evidence", label: "Evidence" },
    ];

    return (
        <div className="container">
            <h1>Articles Index Page</h1>
            <p>Page containing a table of articles:</p>

            <SortableTable 
                headers={headers} 
                data={articles.map(article => ({
                    ...article,
                    pubyear: article.pubyear ?? "N/A",
                }))} 
                rowKey="id"
            />
        </div>
    );
};

// 获取后端数据并处理 pubyear 字段
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
        }) => ({
            id: article.id ?? article._id,
            title: article.title,
            authors: article.authors, // Assuming authors are stored as a string
            source: article.source,
            pubyear: article.pubyear ?? "N/A",
            doi: article.doi,
            claim: article.claim,
            evidence: article.evidence,
        }));

        return {
            props: {
                articles,
            },
            revalidate: 10, // 每10秒重新验证数据
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

export default Articles;
