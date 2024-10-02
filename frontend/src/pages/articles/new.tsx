import { FormEvent, useState } from "react";
import formStyles from "../../styles/Form.module.scss";



const NewDiscussion = () => {
    const [title, setTitle] = useState<string>("");
    const [authors, setAuthors] = useState<string[]>([""]); // 初始值为一个空的输入框
    const [source, setSource] = useState<string>("");
    const [pubYear, setPubYear] = useState<number>(new Date().getFullYear());  // 设置为当前年份
    const [doi, setDoi] = useState<string>("");
    const [summary, setSummary] = useState<string>(""); // Claim/summary
    const [linkedDiscussion, setLinkedDiscussion] = useState<string>("");  // Evidence

    const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // 简单验证，确保表单必填项被填写
        if (!title || authors.length === 0 || !source || !summary || !linkedDiscussion) {
            alert("Please fill in all required fields.");
            return;
        }

        // 构建文章数据，确保字段名与数据库匹配
        const newArticle = {
            title,
            authors,
            source,
            pubyear: pubYear,
            doi,
            claim: summary,
            evidence: linkedDiscussion,
            status: 'pending',  // 设置文章状态为待审核
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
                // 重置表单
                resetForm();
            } else {
                console.error("Failed to submit article", response.status);
            }
        } catch (error) {
            console.error("An error occurred while submitting the article:", error);
        }
    };

    const resetForm = () => {
        setTitle("");
        setAuthors([""]);
        setSource("");
        setPubYear(new Date().getFullYear());
        setDoi("");
        setSummary("");
        setLinkedDiscussion("");
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
                    required
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
                            required
                        />
                        {authors.length > 1 && (
                            <button
                                onClick={() => removeAuthor(index)}
                                className={formStyles.buttonItem}
                                style={{ marginLeft: "3rem" }}
                                type="button"
                            >
                                -
                            </button>
                        )}
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
                    required
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
                    required
                />

                <label htmlFor="doi">DOI (optional):</label>
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
                    required
                />

                <label htmlFor="linkedDiscussion">Evidence (Linked Discussion):</label>
                <textarea
                    className={formStyles.formTextArea}
                    name="linkedDiscussion"
                    value={linkedDiscussion}
                    onChange={(event) => setLinkedDiscussion(event.target.value)}
                    required
                />

                <button className={formStyles.formItem} type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default NewDiscussion;
