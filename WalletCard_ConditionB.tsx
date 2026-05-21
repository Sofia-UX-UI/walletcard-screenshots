import React, { useState } from 'react';

// Design token CSS variables — defined once on the root element, referenced everywhere else.
// Never use raw hex/px values outside this map.
const TOKENS: React.CSSProperties = {
  '--color-primary':         '#1A1C1E',
  '--color-secondary':       '#6C7278',
  '--color-accent':          '#B8422E',
  '--color-surface':         '#F7F5F2',
  '--color-surface-variant': '#E8E6E3',
  '--color-on-primary':      '#FFFFFF',
  '--color-on-surface':      '#1A1C1E',
  '--color-border':          '#D4D2CF',
  '--color-error':           '#BA1A1A',
  '--spacing-xs':            '4px',
  '--spacing-sm':            '8px',
  '--spacing-md':            '24px',
  '--spacing-lg':            '32px',
  '--spacing-xl':            '48px',
  '--rounded-sm':            '4px',
  '--rounded-md':            '8px',
  '--rounded-lg':            '16px',
  '--rounded-full':          '9999px',
  '--elevation-card':        '0 2px 8px rgba(0,0,0,0.08)',
  '--elevation-modal':       '0 8px 32px rgba(0,0,0,0.16)',
  '--font-sans':             '"Public Sans", sans-serif',
  '--font-grotesk':          '"Space Grotesk", sans-serif',
} as React.CSSProperties;

// Type scale — maps directly to DESIGN.md typography section.
const T = {
  h1: {
    fontFamily: 'var(--font-sans)',
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: 'var(--color-primary)',
  } as React.CSSProperties,

  h2: {
    fontFamily: 'var(--font-sans)',
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.3,
    color: 'var(--color-on-surface)',
  } as React.CSSProperties,

  bodyMd: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    color: 'var(--color-on-surface)',
  } as React.CSSProperties,

  labelSm: {
    fontFamily: 'var(--font-grotesk)',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-secondary)',
  } as React.CSSProperties,
};

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status?: 'success' | 'pending' | 'error';
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

function StatusBadge({ status }: { status: 'success' | 'pending' | 'error' }) {
  const bg: Record<string, string> = {
    success: 'var(--color-accent)',
    pending: 'var(--color-surface-variant)',
    error:   'var(--color-error)',
  };
  const color = status === 'pending' ? 'var(--color-secondary)' : 'var(--color-on-primary)';

  return (
    <span style={{
      ...T.labelSm,
      color,
      backgroundColor: bg[status],
      borderRadius: 'var(--rounded-full)',
      padding: '2px var(--spacing-sm)',
    }}>
      {status}
    </span>
  );
}

function TransactionRow({ tx, currency, isLast }: {
  tx: Transaction;
  currency: string;
  isLast: boolean;
}) {
  return (
    <>
      <li style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        paddingTop: 'var(--spacing-sm)',
        paddingBottom: 'var(--spacing-sm)',
        listStyle: 'none',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...T.bodyMd, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {tx.description}
          </div>
          <div style={{ ...T.labelSm, marginTop: 'var(--spacing-xs)' }}>
            {formatDate(tx.date)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-xs)', flexShrink: 0 }}>
          <span style={{ ...T.labelSm, color: 'var(--color-on-surface)' }}>
            {tx.amount >= 0 ? '+' : '−'} {formatCurrency(tx.amount, currency)}
          </span>
          {tx.status && <StatusBadge status={tx.status} />}
        </div>
      </li>
      {!isLast && (
        <li aria-hidden style={{ height: '1px', backgroundColor: 'var(--color-border)', listStyle: 'none' }} />
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
  const [pressed, setPressed] = useState(false);

  return (
    <div style={{
      ...TOKENS,
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--rounded-lg)',
      boxShadow: 'var(--elevation-card)',
      padding: 'var(--spacing-md)',
      width: '380px',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-md)',
    }}>

      {/* Header row: card name (h2) + card type badge (label-sm) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={T.h2}>{cardName}</span>
        <span style={T.labelSm}>{cardType}</span>
      </div>

      {/* Balance: label above (label-sm), value in h1 */}
      <div>
        <div style={{ ...T.labelSm, marginBottom: 'var(--spacing-xs)' }}>
          Available Balance
        </div>
        <div style={T.h1}>
          {formatCurrency(balance, currency)}
        </div>
      </div>

      {/* Transaction list */}
      <div>
        <div style={{
          ...T.labelSm,
          paddingBottom: 'var(--spacing-sm)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: 'var(--spacing-xs)',
        }}>
          Recent Transactions
        </div>
        {transactions.length === 0 ? (
          <p style={{ ...T.bodyMd, color: 'var(--color-secondary)' }}>No transactions yet.</p>
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
      </div>

      {/* Primary action button: accent bg, on-primary text, rounded-md, sm vertical + md horizontal padding */}
      <button
        style={{
          ...T.bodyMd,
          fontWeight: 600,
          color: 'var(--color-on-primary)',
          backgroundColor: 'var(--color-accent)',
          borderRadius: 'var(--rounded-md)',
          border: 'none',
          paddingTop: 'var(--spacing-sm)',
          paddingBottom: 'var(--spacing-sm)',
          paddingLeft: 'var(--spacing-md)',
          paddingRight: 'var(--spacing-md)',
          cursor: 'pointer',
          width: '100%',
          opacity: pressed ? 0.85 : 1,
          transform: pressed ? 'scale(0.99)' : 'scale(1)',
          transition: 'opacity 0.1s, transform 0.1s',
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onClick={onPrimaryAction}
      >
        {primaryActionLabel}
      </button>
    </div>
  );
}
