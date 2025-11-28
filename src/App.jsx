import React, { useState, useMemo } from 'react';
import topicsData from './data/topics.json';
import passagesData from './data/passages.json';
import './index.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');

  // Extract unique disciplines
  const disciplines = useMemo(() => {
    const allDisciplines = new Set();
    topicsData.forEach(item => {
      item.discipline.split(', ').forEach(d => allDisciplines.add(d));
    });
    return ['All', ...Array.from(allDisciplines).sort()];
  }, []);

  // Filter topics
  const filteredTopics = useMemo(() => {
    return topicsData.filter(item => {
      const matchesSearch =
        item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDiscipline =
        selectedDiscipline === 'All' ||
        item.discipline.includes(selectedDiscipline);

      return matchesSearch && matchesDiscipline;
    });
  }, [searchTerm, selectedDiscipline]);

  const handleSearchLink = (topic, type, keywords = []) => {
    // Smart linking strategy
    const baseUrl = "https://www.google.com/search?q=";
    let query = "";
    const keywordStr = keywords.length > 0 ? keywords[0] : "";

    if (type === 'exam') {
      // Search for past exam questions and mock evaluations
      // Removed filetype:pdf as per user request to broaden results
      query = `수능 모의평가 영어 기출 지문 ${topic} ${keywordStr}`;
    } else if (type === 'blog') {
      // Search for blogs and articles related to the topic
      query = `${topic} ${keywordStr} 관련 기사 배경지식 블로그`;
    } else {
      // Search for background knowledge (English)
      query = `${topic} background knowledge for students`;
    }

    window.open(`${baseUrl}${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>수능 영어 주제별 학습</h1>
        <p>Master the topics, master the exam.</p>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <div className="filter-group">
            <h3>Search</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search topics or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <h3>Disciplines</h3>
            <div className="discipline-list">
              {disciplines.map(d => (
                <span
                  key={d}
                  className={`discipline-chip ${selectedDiscipline === d ? 'active' : ''}`}
                  onClick={() => setSelectedDiscipline(d)}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <main className="content-area">
          <div className="card-grid">
            {filteredTopics.map((item, index) => (
              <div key={index} className="topic-card">
                <div className="topic-header">
                  <h2 className="topic-title">{item.topic}</h2>
                </div>

                <div className="topic-discipline">
                  {item.discipline}
                </div>

                <div className="keywords-container" style={{ marginTop: '1rem' }}>
                  {item.keywords.map((k, i) => (
                    <span key={i} className="keyword-tag">#{k}</span>
                  ))}
                </div>

                <div className="card-actions">
                  <button
                    className="action-btn btn-primary"
                    onClick={() => handleSearchLink(item.topic, 'exam', item.keywords)}
                  >
                    📝 기출 문제
                  </button>
                  <button
                    className="action-btn btn-secondary"
                    onClick={() => handleSearchLink(item.topic, 'blog', item.keywords)}
                  >
                    📰 블로그/기사
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Section for Extracted Passages */}
          <section className="passages-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>📚 Recent Exam Passages (Extracted)</h2>
            <div className="passages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {passagesData.map((passage) => (
                <div key={passage.id} className="passage-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666', background: '#f5f5f5', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{passage.source}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>{passage.title}</h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#333', whiteSpace: 'pre-wrap' }}>
                    {passage.content.length > 200 ? passage.content.substring(0, 200) + '...' : passage.content}
                  </p>
                  <button
                    style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'none', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
                    onClick={() => alert(passage.content)}
                  >
                    Read Full Text
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
