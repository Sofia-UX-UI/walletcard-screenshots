import React, { useState } from 'react';

// Design tokens from DESIGN_stitch.md — Lumina Finance.
// All raw values live here. Every style property elsewhere uses var(--xxx).
const TOKENS: React.CSSProperties = {
  // Color — role-based tokens
  '--color-surface':                  '#f7f9fb',
  '--color-surface-container-lowest': '#ffffff',
  '--color-surface-container-low':    '#f2f4f6',
  '--color-surface-container':        '#eceef0',
  '--color-on-surface':               '#191c1e',
  '--color-on-surface-variant':       '#434656',
  '--color-primary':                  '#003ec7',
  '--color-on-primary':               '#ffffff',
  '--color-primary-container':        '#0052ff',
  '--color-on-primary-container':     '#dfe3ff',
  '--color-secondary':                '#565e74',
  '--color-outline':                  '#737688',
  '--color-outline-variant':          '#c3c5d9',
  '--color-error':                    '#ba1a1a',
  // Semantic status colors (spec: Success Green / Alert Red)
  '--color-success':                  '#10b981',
  '--color-success-tint':             'rgba(16,185,129,0.12)',
  '--color-success-text':             '#065f46',
  '--color-pending-tint':             'rgba(245,158,11,0.12)',
  '--color-pending-text':             '#92400e',
  '--color-error-tint':               'rgba(239,68,68,0.12)',
  '--color-error-text':               '#991b1b',
  // Gradient for card header (Deep Navy → Electric Blue)
  '--gradient-card':                  'linear-gradient(135deg, #001452 0%, #003ec7 100%)',

  // Spacing — 8px base unit
  '--spacing-base':          '8px',
  '--spacing-gutter':        '24px',
  '--spacing-margin-mobile': '16px',
  '--spacing-margin-desktop':'48px',

  // Shape
  '--rounded-sm':      '0.25rem',
  '--rounded-default': '0.5rem',
  '--rounded-md':      '0.75rem',
  '--rounded-lg':      '1rem',
  '--rounded-full':    '9999px',

  // Elevation
  '--elevation-1': '0px 4px 20px rgba(15,23,42,0.05)',
  '--elevation-2': '0px 12px 32px rgba(15,23,42,0.12)',

  // Typography — Plus Jakarta Sans only
  '--font-primary': '"Plus Jakarta Sans", sans-serif',
} as React.CSSProperties;

// Type scale — maps to DESIGN_stitch.md typography section.
const T = {
  headlineLg: {
    fontFamily:    'var(--font-primary)',
    fontSize:      '32px',
    fontWeight:    700,
    lineHeight:    '40px',
    letterSpacing: '-0.01em',
    fontVariantNumeric: 'tabular-nums',
  } as React.CSSProperties,

  headlineMd: {
    fontFamily: 'var(--font-primary)',
    fontSize:   '24px',
    fontWeight: 600,
    lineHeight: '32px',
  } as React.CSSProperties,

  bodyMd: {
    fontFamily: 'var(--font-primary)',
    fontSize:   '16px',
    fontWeight: 400,
    lineHeight: '24px',
  } as React.CSSProperties,

  labelMd: {
    fontFamily:    'var(--font-primary)',
    fontSize:      '14px',
    fontWeight:    600,
    lineHeight:    '20px',
    letterSpacing: '0.05em',
    fontVariantNumeric: 'tabular-nums',
  } as React.CSSProperties,

  labelSm: {
    fontFamily: 'var(--font-primary)',
    fontSize:   '12px',
    fontWeight: 500,
    lineHeight: '16px',
  } as React.CSSProperties,
};

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status?: 'completed' | 'pending' | 'failed';
  icon?: string;
}

export interface WalletCardProps {
  cardName?: string;
  cardType?: string;
  balance?: number;
  currency?: string;
  transactions?: Transaction[];
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Math.abs(amount));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function StatusBadge({ status }: { status: 'completed' | 'pending' | 'failed' }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    completed: { bg: 'var(--color-success-tint)', color: 'var(--color-success-text)', label: 'Completed' },
    pending:   { bg: 'var(--color-pending-tint)', color: 'var(--color-pending-text)', label: 'Pending'   },
    failed:    { bg: 'var(--color-error-tint)',   color: 'var(--color-error-text)',   label: 'Failed'    },
  };
  const { bg, color, label } = styles[status];

  return (
    <span style={{
      ...T.labelSm,
      backgroundColor: bg,
      color,
      borderRadius: 'var(--rounded-full)',
      padding: '2px 8px',
      display: 'inline-block',
    }}>
      {label}
    </span>
  );
}

function TransactionRow({ tx, currency, isLast }: {
  tx: Transaction;
  currency: string;
  isLast: boolean;
}) {
  const sign = tx.amount >= 0 ? '+' : '−';
  const amountColor = tx.amount >= 0 ? 'var(--color-success)' : 'var(--color-on-surface)';

  return (
    <>
      <li style={{
        display:       'flex',
        alignItems:    'center',
        gap:           'var(--spacing-base)',
        paddingTop:    'var(--spacing-margin-mobile)',
        paddingBottom: 'var(--spacing-margin-mobile)',
        listStyle:     'none',
      }}>
        {/* 40px circular icon container */}
        <div style={{
          width:           '40px',
          height:          '40px',
          borderRadius:    'var(--rounded-full)',
          backgroundColor: 'var(--color-surface-container)',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:      0,
          fontSize:        '18px',
        }}>
          {tx.icon ?? '💳'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            ...T.bodyMd,
            color:        'var(--color-on-surface)',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            {tx.description}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span style={{ ...T.labelSm, color: 'var(--color-on-surface-variant)' }}>
              {formatDate(tx.date)}
            </span>
            {tx.status && <StatusBadge status={tx.status} />}
          </div>
        </div>

        <span style={{ ...T.labelMd, color: amountColor, flexShrink: 0 }}>
          {sign} {formatCurrency(tx.amount, currency)}
        </span>
      </li>
      {!isLast && (
        <li aria-hidden style={{
          height:          '1px',
          backgroundColor: 'var(--color-outline-variant)',
          listStyle:       'none',
        }} />
      )}
    </>
  );
}

export default function WalletCard({
  cardName = 'Personal Wallet',
  cardType = 'Visa',
  balance = 0,
  currency = 'USD',
  transactions = [],
  primaryActionLabel = 'Add Money',
  onPrimaryAction,
}: WalletCardProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed,  setPressed]  = useState(false);

  return (
    <div style={{
      ...TOKENS,
      width:         '400px',
      borderRadius:  'var(--rounded-lg)',
      overflow:      'hidden',
      boxShadow:     hovered ? 'var(--elevation-2)' : 'var(--elevation-1)',
      transform:     hovered ? 'translateY(-2px)' : 'translateY(0)',
      transition:    'box-shadow 0.2s, transform 0.2s',
      backgroundColor: 'var(--color-surface-container-lowest)',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
    >
      {/* Gradient card header */}
      <div style={{
        background: 'var(--gradient-card)',
        padding:    'var(--spacing-gutter)',
        color:      'var(--color-on-primary)',
      }}>
        {/* Top row: card name + type */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-gutter)' }}>
          <span style={{ ...T.headlineMd, color: 'var(--color-on-primary)' }}>{cardName}</span>
          <span style={{
            ...T.labelSm,
            color:           'var(--color-on-primary)',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius:    'var(--rounded-full)',
            padding:         '4px 12px',
            letterSpacing:   '0.08em',
            textTransform:   'uppercase',
          }}>
            {cardType}
          </span>
        </div>

        {/* Balance */}
        <div style={{ ...T.labelSm, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
          Available Balance
        </div>
        <div style={{ ...T.headlineLg, color: 'var(--color-on-primary)' }}>
          {formatCurrency(balance, currency)}
        </div>

        {/* Card number dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'var(--spacing-gutter)' }}>
          {[0,1,2].map(g => (
            <React.Fragment key={g}>
              {[0,1,2,3].map(d => (
                <span key={d} style={{ width: '6px', height: '6px', borderRadius: 'var(--rounded-full)', backgroundColor: 'rgba(255,255,255,0.4)', display: 'inline-block' }} />
              ))}
              <span style={{ width: '10px' }} />
            </React.Fragment>
          ))}
          <span style={{ ...T.labelSm, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em' }}>8492</span>
        </div>
      </div>

      {/* Transaction list + action */}
      <div style={{ padding: 'var(--spacing-gutter)' }}>
        <div style={{
          ...T.labelSm,
          color:          'var(--color-on-surface-variant)',
          textTransform:  'uppercase',
          letterSpacing:  '0.08em',
          paddingBottom:  'var(--spacing-base)',
          borderBottom:   '1px solid var(--color-outline-variant)',
          marginBottom:   'var(--spacing-base)',
        }}>
          Recent Transactions
        </div>

        {transactions.length === 0 ? (
          <p style={{ ...T.bodyMd, color: 'var(--color-on-surface-variant)' }}>No transactions yet.</p>
        ) : (
          <ul style={{ margin: 0, padding: 0 }}>
            {transactions.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                currency={currency}
                isLast={i === transactions.length - 1}
              />
            ))}
          </ul>
        )}

        {/* Primary action: Electric Blue bg, white text, 8px radius */}
        <button
          style={{
            ...T.bodyMd,
            fontWeight:      600,
            color:           'var(--color-on-primary)',
            backgroundColor: 'var(--color-primary)',
            borderRadius:    'var(--rounded-default)',
            border:          'none',
            padding:         'var(--spacing-base) var(--spacing-gutter)',
            cursor:          'pointer',
            width:           '100%',
            marginTop:       'var(--spacing-gutter)',
            opacity:         pressed ? 0.85 : 1,
            transform:       pressed ? 'scale(0.99)' : 'scale(1)',
            transition:      'opacity 0.1s, transform 0.1s',
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={()    => setPressed(false)}
          onClick={onPrimaryAction}
        >
          {primaryActionLabel}
        </button>
      </div>
    </div>
  );
}
