import React from 'react';

const SkeletonLoader = ({ type = "product", count = 4 }) => {
  const skeletons = Array(count).fill(0);

  if (type === "skull" || type === "skeleton" || type === "list" || type === "product") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="skeleton-card"
            style={{
              background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              animation: 'skeletonShimmer 1.5s infinite linear'
            }}
          >
            {/* Skull / Avatar placeholder circle */}
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#d1d5db',
                shrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="12" r="1.5" fill="#9ca3af" />
                <circle cx="15" cy="12" r="1.5" fill="#9ca3af" />
                <path d="M8 20v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M12 2a8 8 0 0 0-8 8v4a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4a8 8 0 0 0-8-8z" />
              </svg>
            </div>

            {/* Skeleton lines */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ width: '45%', height: '16px', borderRadius: '6px', background: '#d1d5db' }} />
              <div style={{ width: '75%', height: '14px', borderRadius: '6px', background: '#e5e7eb' }} />
              <div style={{ width: '30%', height: '18px', borderRadius: '6px', background: '#d1d5db' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
      <div style={{ width: '36px', height: '36px', border: '4px solid #6c804b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
};

export default SkeletonLoader;
