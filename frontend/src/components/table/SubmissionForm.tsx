import React, { useState } from "react";
import formStyles from "../../styles/Form.module.scss";

// 定义 Article 接口
interface Article {
    title: string;
    authors: string[];
    source: string;
    pubyear: number;
    doi?: string;
    claim: string;
    evidence: string;
    seMethod?: string;
    studyType?: string;
    evidenceResult?: string;
}

// 定义组件 Props 接口，包括 onSubmit 函数类型
interface Props {
    onSubmit: (article: Article) => void;  // onSubmit 函数接收一个 Article 对象并不返回值
}

// 定义 SubmissionForm 组件，接收 Props
const SubmissionForm: React.FC<Props> = ({ onSubmit }) => {
    const [title, setTitle] = useState("");
    const [authors, setAuthors] = useState<string[]>([""]);
    const [source, setSource] = useState("");
    const [pubYear, setPubYear] = useState<number>(0);
    const [doi, setDoi] = useState("");
    const [claim, setClaim] = useState("");
    const [evidence, setEvidence] = useState("");
    const [seMethod, setSeMethod] = useState("");
    const [studyType, setStudyType] = useState("");
    const [evidenceResult, setEvidenceResult] = useState("");

    // 处理表单提交
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // 构建新的 Article 对象
        const newArticle: Article = {
            title,
            authors,
            source,
            pubyear: pubYear,
            doi,
            claim,
            evidence,
            seMethod,
            studyType,
            evidenceResult,
        };

        // 调用传递的 onSubmit 函数
        onSubmit(newArticle);
    };

    // 增加作者输入框
    const addAuthor = () => {
        setAuthors([...authors, ""]);
    };

    // 更新特定作者的值
    const updateAuthor = (index: number, value: string) => {
        const updatedAuthors = authors.map((author, i) =>
            i === index ? value : author
        );
        setAuthors(updatedAuthors);
    };

    return (
        <form className={formStyles.form} onSubmit={handleSubmit}>
            <label htmlFor="title">Title:</label>
            <input
                className={formStyles.formItem}
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <label htmlFor="authors">Authors:</label>
            {authors.map((author, index) => (
                <div key={index} className={formStyles.formItem}>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => updateAuthor(index, e.target.value)}
                        required
                    />
                    {authors.length > 1 && (
                        <button
                            type="button"
                            onClick={() => setAuthors(authors.filter((_, i) => i !== index))}
                            className={formStyles.removeButton}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={addAuthor}>
                Add Author
            </button>

            <label htmlFor="source">Source:</label>
            <input
                className={formStyles.formItem}
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
            />

            <label htmlFor="pubYear">Publication Year:</label>
            <input
                className={formStyles.formItem}
                type="number"
                id="pubYear"
                value={pubYear}
                onChange={(e) => setPubYear(parseInt(e.target.value))}
            />

            <label htmlFor="doi">DOI:</label>
            <input
                className={formStyles.formItem}
                type="text"
                id="doi"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
            />

            <label htmlFor="claim">Claim:</label>
            <textarea
                className={formStyles.formTextArea}
                id="claim"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                required
            />

            <label htmlFor="evidence">Evidence:</label>
            <textarea
                className={formStyles.formTextArea}
                id="evidence"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                required
            />

            <label htmlFor="seMethod">SE Method:</label>
            <input
                className={formStyles.formItem}
                type="text"
                id="seMethod"
                value={seMethod}
                onChange={(e) => setSeMethod(e.target.value)}
            />

            <label htmlFor="studyType">Study Type:</label>
            <input
                className={formStyles.formItem}
                type="text"
                id="studyType"
                value={studyType}
                onChange={(e) => setStudyType(e.target.value)}
            />

            <label htmlFor="evidenceResult">Evidence Result:</label>
            <input
                className={formStyles.formItem}
                type="text"
                id="evidenceResult"
                value={evidenceResult}
                onChange={(e) => setEvidenceResult(e.target.value)}
            />

            <button type="submit">Submit</button>
        </form>
    );
};

export default SubmissionForm;
