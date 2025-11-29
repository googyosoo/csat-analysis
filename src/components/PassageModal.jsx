import React, { useEffect } from 'react';

const PassageModal = ({ isOpen, onClose, passage }) => {
    if (!isOpen || !passage) return null;

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Helper to format content
    const formatContent = (text) => {
        // Split by choices if they exist
        // This regex looks for circled numbers 1-5
        // We use a lookahead/lookbehind or just split and reconstruct
        const parts = text.split(/([①②③④⑤])/);

        if (parts.length === 1) {
            return <p className="modal-text">{text}</p>;
        }

        // parts[0] is the question text
        // parts[1] is ①, parts[2] is choice text, parts[3] is ②, etc.
        const question = parts[0];
        const choices = [];

        for (let i = 1; i < parts.length; i += 2) {
            choices.push({
                number: parts[i],
                text: parts[i + 1] ? parts[i + 1].trim() : ''
            });
        }

        return (
            <div className="passage-content">
                <p className="question-text">{question}</p>
                <div className="choices-container">
                    {choices.map((choice, index) => (
                        <div key={index} className="choice-item">
                            <span className="choice-number">{choice.number}</span>
                            <span className="choice-text">{choice.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <div className="modal-header">
                    <h3>{passage.title}</h3>
                    <span className="modal-source">{passage.source}</span>
                </div>
                <div className="modal-body">
                    {formatContent(passage.content)}
                </div>
            </div>
        </div>
    );
};

export default PassageModal;
