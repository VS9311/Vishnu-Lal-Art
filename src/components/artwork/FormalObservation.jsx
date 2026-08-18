import React from 'react';
import './ArtworkComponents.css';

export default function FormalObservation({ data }) {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <section className="formal-observation">
      <h2 className="section-title">Formal Observation</h2>
      <div className="observation-blocks">
        {Object.entries(data).map(([title, content]) => (
          <div key={title} className="observation-block">
            <h3 className="block-title">{title}</h3>
            <div className="block-content">
              {content.split('\n').map((paragraph, index) => (
                <p key={index} className={paragraph.startsWith('-') ? 'list-item' : 'body-text'}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
