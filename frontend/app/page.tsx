"use client";

import { useState } from "react";

type Paper = {
  title: string;
  abstract: string;
  authors: string[];
  year: number;
  url: string;
};

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);

  const handleAnalyze = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setAnalysis("");
    setPapers([]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/research/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic })
      });

      const data = await res.json();

      setAnalysis(data.analysis || "");
      setPapers(data.papers || []);
    } catch (error) {
      setAnalysis("حدث خطأ أثناء التحليل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>منصة تحليل البحث الطلابي</h1>
      <p>أدخل موضوع البحث ليتم جلب الأوراق العلمية وتحليلها بالذكاء الاصطناعي.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="مثال: Artificial Intelligence in Education"
          style={{
            flex: 1,
            padding: 12,
            fontSize: 16,
            border: "1px solid #ccc",
            borderRadius: 8
          }}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          {loading ? "جاري التحليل..." : "تحليل"}
        </button>
      </div>

      {papers.length > 0 && (
        <section style={{ marginBottom: 30 }}>
          <h2>الأوراق العلمية</h2>
          {papers.map((paper, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: 16,
                borderRadius: 10,
                marginBottom: 12
              }}
            >
              <h3>{paper.title}</h3>
              <p><strong>السنة:</strong> {paper.year}</p>
              <p><strong>المؤلفون:</strong> {paper.authors.join(", ")}</p>
              <p>{paper.abstract}</p>
              {paper.url && (
                <a href={paper.url} target="_blank" rel="noreferrer">
                  عرض البحث
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {analysis && (
        <section>
          <h2>تحليل الذكاء الاصطناعي</h2>
          <div
            style={{
              whiteSpace: "pre-wrap",
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 10
            }}
          >
            {analysis}
          </div>
        </section>
      )}
    </main>
  );
}
