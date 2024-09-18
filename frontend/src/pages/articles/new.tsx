import { FormEvent, useState } from "react";
import formStyles from "../../styles/Form.module.scss";

const NewDiscussion = () => {
    const [title, setTitle] = useState("");
    const [authors, setAuthors] = useState<string[]>([]);
    const [source, setSource] = useState("");
    const [pubYear, setPubYear] = useState<number>(0);  // 确保这个字段为数字类型
    const [doi, setDoi] = useState("");
    const [summary, setSummary] = useState("");
    const [linkedDiscussion, setLinkedDiscussion] = useState("");  // 确认是否需要此字段

    const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // 构建文章数据，确保字段名与数据库匹配
        const newArticle = {
            title,
            authors,
            source,
            pubyear: pubYear,  // 确保与 MongoDB 中的字段名一致
            doi,
            claim: summary,  // 如果 summary 在数据库中作为 claim 保存
            evidence: linkedDiscussion,  // 假设 linkedDiscussion 是 evidence
        };

        try {
            const response = await fetch("http://localhost:8082/articles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newArticle),  // 将数据转换为 JSON 格式
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Article submitted successfully:", data);
            } else {
                console.error("Failed to submit article", response.status);
            }
        } catch (error) {
            console.error("An error occurred while submitting the article:", error);
        }
    };

    // 增加作者的功能
    const addAuthor = () => {
        setAuthors(authors.concat([""]));
    };

    // 移除作者的功能
    const removeAuthor = (index: number) => {
        setAuthors(authors.filter((_, i) => i !== index));
    };

    // 更新作者
    const changeAuthor = (index: number, value: string) => {
        setAuthors(
            authors.map((oldValue, i) => (index === i ? value : oldValue))
        );
    };

    return (
        <div className="container">
            <h1>New Article</h1>
            <form className={formStyles.form} onSubmit={submitNewArticle}>
                <label htmlFor="title">Title:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />

                <label htmlFor="author">Authors:</label>
                {authors.map((author, index) => (
                    <div key={`author ${index}`} className={formStyles.arrayItem}>
                        <input
                            type="text"
                            name="author"
                            value={author}
                            onChange={(event) => changeAuthor(index, event.target.value)}
                            className={formStyles.formItem}
                        />
                        <button
                            onClick={() => removeAuthor(index)}
                            className={formStyles.buttonItem}
                            style={{ marginLeft: "3rem" }}
                            type="button"
                        >
                            -
                        </button>
                    </div>
                ))}
                <button
                    onClick={addAuthor}
                    className={formStyles.buttonItem}
                    style={{ marginLeft: "auto" }}
                    type="button"
                >
                    +
                </button>

                <label htmlFor="source">Source:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    name="source"
                    id="source"
                    value={source}
                    onChange={(event) => setSource(event.target.value)}
                />

                <label htmlFor="pubYear">Publication Year:</label>
                <input
                    className={formStyles.formItem}
                    type="number"
                    name="pubYear"
                    id="pubYear"
                    value={pubYear}
                    onChange={(event) => {
                        const val = event.target.value;
                        setPubYear(val === "" ? 0 : parseInt(val));
                    }}
                />

                <label htmlFor="doi">DOI:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    name="doi"
                    id="doi"
                    value={doi}
                    onChange={(event) => setDoi(event.target.value)}
                />

                <label htmlFor="summary">Claim (Summary):</label>
                <textarea
                    className={formStyles.formTextArea}
                    name="summary"
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                />

                <label htmlFor="linkedDiscussion">Evidence (Linked Discussion):</label>
                <textarea
                    className={formStyles.formTextArea}
                    name="linkedDiscussion"
                    value={linkedDiscussion}
                    onChange={(event) => setLinkedDiscussion(event.target.value)}
                />

                <button className={formStyles.formItem} type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default NewDiscussion;
