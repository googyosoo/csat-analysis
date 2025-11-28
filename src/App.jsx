import React, { useState, useMemo } from 'react';
import topicsData from './data/topics.json';
import passagesData from './data/passages.json';
import './index.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [view, setView] = useState('topics'); // 'topics', 'archive', 'search'
  const [selectedPassages, setSelectedPassages] = useState([]);
  const [activeTopic, setActiveTopic] = useState('');

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

  // Filter passages for Archive view (2015-2025)
  // Currently showing all, but we could add year filtering later if needed.
  const archivePassages = useMemo(() => {
    return passagesData;
  }, []);

  const handleSearchLink = (topic, type, keywords = []) => {
    const baseUrl = "https://www.google.com/search?q=";
    let query = "";
    const keywordStr = keywords.length > 0 ? keywords[0] : "";

    if (type === 'blog') {
      query = `${topic} ${keywordStr} 관련 기사 배경지식 블로그`;
      window.open(`${baseUrl}${encodeURIComponent(query)}`, '_blank');
    } else {
      query = `${topic} background knowledge for students`;
      window.open(`${baseUrl}${encodeURIComponent(query)}`, '_blank');
    }
  };

  const handleShowExamPassages = (topic, keywords) => {
    // Filter passages that contain the topic or keywords
    const relevantPassages = passagesData.filter(p => {
      const content = p.content.toLowerCase();
      const title = p.title.toLowerCase();
      const topicLower = topic.toLowerCase();

      // Simple relevance check
      if (content.includes(topicLower) || title.includes(topicLower)) return true;
      return keywords.some(k => content.includes(k.toLowerCase()));
    });

    setSelectedPassages(relevantPassages);
    setActiveTopic(topic);
    setView('search');
  };

  const renderPassageList = (passages, title) => (
    <section className="passages-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#666' }}>({passages.length})</span></h2>
        {view === 'search' && (
          <button
            onClick={() => setView('topics')}
            style={{ padding: '0.5rem 1rem', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Back to Topics
          </button>
        )}
      </div>

      {passages.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666', background: '#f9f9f9', borderRadius: '8px' }}>
          No passages found matching criteria.
        </div>
      ) : (
        <div className="passages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {passages.map((passage) => (
            <div key={passage.id} className="passage-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#666', background: '#f5f5f5', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{passage.source}</span>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{passage.id.split('_').pop()}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>{passage.title}</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#333', whiteSpace: 'pre-wrap', maxHeight: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {passage.content.length > 200 ? passage.content.substring(0, 200) + '...' : passage.content}
              </p>
              <button
                style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'none', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', width: '100%' }}
                onClick={() => alert(passage.content)}
              >
                Read Full Text
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="app">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 onClick={() => setView('topics')} style={{ cursor: 'pointer' }}>수능 영어 주제별 학습</h1>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <button
              className={`nav-btn ${view === 'topics' ? 'active' : ''}`}
              onClick={() => setView('topics')}
              style={{ background: 'none', border: 'none', color: view === 'topics' ? 'black' : '#888', fontWeight: view === 'topics' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1rem' }}
            >
              Topics
            </button>
            <button
              className={`nav-btn ${view === 'archive' ? 'active' : ''}`}
              onClick={() => setView('archive')}
              style={{ background: 'none', border: 'none', color: view === 'archive' ? 'black' : '#888', fontWeight: view === 'archive' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1rem' }}
            >
              2015-2025 Archive
            </button>
          </nav>
        </div>
        <p>Master the topics, master the exam.</p>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <div className="filter-group">
            <h3>Search</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {view === 'topics' && (
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
          )}
        </aside>

        <main className="content-area">
          {view === 'topics' && (
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
                      onClick={() => handleShowExamPassages(item.topic, item.keywords)}
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
          )}

          {view === 'search' && renderPassageList(selectedPassages, `Exam Passages: ${activeTopic}`)}

          {view === 'archive' && renderPassageList(archivePassages, '2015-2025 Exam Archive')}
        </main>
      </div>
    </div>
  );
}

export default App;
