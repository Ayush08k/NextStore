import React from 'react';
import { Award, GraduationCap, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const BoardsWorkedWith = () => {
  const boards = [
    {
      code: 'CBSE',
      title: 'CBSE Board',
      desc: 'Central Board of Sec. Education',
      icon: <GraduationCap size={24} color="#6c804b" />
    },
    {
      code: 'HBSE',
      title: 'HBSE Board',
      desc: 'Haryana Board of School Ed.',
      icon: <Award size={24} color="#5a6d3c" />
    },
    {
      code: 'RBSE',
      title: 'RBSE Board',
      desc: 'Rajasthan Board of Sec. Ed.',
      icon: <BookOpen size={24} color="#748c54" />
    },
    {
      code: 'ICSE',
      title: 'ICSE Board',
      desc: 'Council for Indian School Cert.',
      icon: <ShieldCheck size={24} color="#4a5d30" />
    },
    {
      code: 'UP BOARD',
      title: 'UP Board',
      desc: 'UP Madhyamik Shiksha Parishad',
      icon: <CheckCircle2 size={24} color="#6c804b" />
    }
  ];

  return (
    <section className="container" style={{ margin: '50px auto' }}>
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <h2 className="section-title">Educational Boards We Work With</h2>
      </div>

      <div className="value-props boards-grid">
        {boards.map((board, idx) => (
          <div key={idx} className="vp-item" title={`${board.title} Prescribed Kits Available`}>
            <div className="vp-icon">
              {board.icon}
            </div>
            <div>
              <div className="vp-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{board.title}</span>
              </div>
              <div className="vp-desc">{board.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
