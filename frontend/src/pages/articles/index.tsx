import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable";

// 允许 pubyear 为 string、number 或 null
interface ArticlesInterface {
    id: string;
    title: string;
    authors: string;
    source: string;
    pubyear: string | number | null;
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
            
            {/* 在渲染时处理 null 或 undefined 的情况 */}
            <SortableTable 
                headers={headers} 
                data={articles.map(article => ({
                    ...article,
                    pubyear: article.pubyear ?? "N/A"  // 如果 pubyear 是 null 或 undefined，显示 N/A
                }))} 
            />
        </div>
    );
};

// 获取后端数据并处理 pubyear 字段
export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
    try {
        const response = await fetch("http://localhost:8082/articles"); // 改成你的 API 路径
        const data = await response.json();

        // Map the data to ensure all articles have consistent property names
        const articles = data.map((article: any) => ({
            id: article.id ?? article._id,
            title: article.title,
            authors: article.authors.join(", "), // authors 是一个数组，拼接成字符串
            source: article.source,
            pubyear: article.publication_year ?? null, // 如果 pubyear 是 undefined，使用 null
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
