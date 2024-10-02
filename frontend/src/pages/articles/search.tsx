import { useState } from 'react';

interface Article {
    _id: string;
    title: string;
    authors: string[];
    source: string;
    pubyear: number;
    claim: string;
    evidence: string;
}

const SearchArticles = () => {
    const [method, setMethod] = useState('');
    const [claim, setClaim] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [articles, setArticles] = useState<Article[]>([]);

    const handleSearch = async () => {
        const searchParams = {
            method,
            claim,
            startYear: parseInt(startYear, 10) || undefined,
            endYear: parseInt(endYear, 10) || undefined,
        };

        try {
            const response = await fetch('http://localhost:8082/articles/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams),
            });

            if (response.ok) {
                const data = await response.json();
                setArticles(data);
            } else {
                console.error('Failed to search articles', response.status);
            }
        } catch (error) {
            console.error('Error searching articles:', error);
        }
    };

    return (
        <div className="container">
            <h1>Search Articles</h1>
            <div>
                <label>SE Method:</label>
                <input type="text" value={method} onChange={(e) => setMethod(e.target.value)} />
                <label>Claim:</label>
                <input type="text" value={claim} onChange={(e) => setClaim(e.target.value)} />
                <label>Start Year:</label>
                <input type="number" value={startYear} onChange={(e) => setStartYear(e.target.value)} />
                <label>End Year:</label>
                <input type="number" value={endYear} onChange={(e) => setEndYear(e.target.value)} />
                <button onClick={handleSearch}>Search</button>
            </div>
            {articles.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Authors</th>
                            <th>Source</th>
                            <th>Year</th>
                            <th>Claim</th>
                            <th>Evidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article._id}>
                                <td>{article.title}</td>
                                <td>{article.authors.join(', ')}</td>
                                <td>{article.source}</td>
                                <td>{article.pubyear}</td>
                                <td>{article.claim}</td>
                                <td>{article.evidence}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SearchArticles;
