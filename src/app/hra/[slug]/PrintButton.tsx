'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        background: 'linear-gradient(135deg, #0f2142 0%, #1f3a71 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: 14,
        padding: '12px 22px',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(15,33,66,0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      🖨️ Tisknout / Uložit jako PDF
    </button>
  );
}
