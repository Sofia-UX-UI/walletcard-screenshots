import React, { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant?: string;
  amount: number;
}

interface WalletCardProps {
  cardName?: string;
  cardType?: string;
  balance?: number;
  currency?: string;
  transactions?: Transaction[];
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

const CARD_TYPE_COLORS: Record<string, string> = {
  Visa: '#1a1f71',
  Mastercard: '#eb001b',
  AmEx: '#007bc1',
  Debit: '#1d4ed8',
  Credit: '#7c3aed',
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Math.abs(amount));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const WalletCard: React.FC<WalletCardProps> = ({
  cardName = 'Personal Wallet',
  cardType = 'Visa',
  balance = 4821.5,
  currency = 'USD',
  transactions = [],
  primaryActionLabel = 'Add Money',
  onPrimaryAction,
}) => {
  const [pressed, setPressed] = useState(false);
  const badgeColor = CARD_TYPE_COLORS[cardType] ?? '#374151';

  const s: Record<string, React.CSSProperties> = {
    card: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '380px',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(15,23,42,0.28)',
      background: '#ffffff',
    },
    header: {
      background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 60%, #312e81 100%)',
      padding: '28px 28px 36px',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    },
    headerGlow: {
      position: 'absolute',
      top: '-40px',
      right: '-40px',
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      background: 'rgba(99,102,241,0.25)',
      pointerEvents: 'none',
    },
    headerGlow2: {
      position: 'absolute',
      bottom: '-20px',
      left: '60px',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: 'rgba(59,130,246,0.15)',
      pointerEvents: 'none',
    },
    topRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '28px',
      position: 'relative',
      zIndex: 1,
    },
    cardName: {
      fontSize: '15px',
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: 'rgba(255,255,255,0.85)',
    },
    badge: {
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      padding: '4px 10px',
      borderRadius: '20px',
      backgroundColor: badgeColor,
      color: '#fff',
      border: '1.5px solid rgba(255,255,255,0.25)',
    },
    balanceLabel: {
      fontSize: '12px',
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      color: 'rgba(255,255,255,0.5)',
      marginBottom: '6px',
      position: 'relative',
      zIndex: 1,
    },
    balance: {
      fontSize: '38px',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#ffffff',
      position: 'relative',
      zIndex: 1,
      lineHeight: 1,
    },
    balanceCents: {
      fontSize: '22px',
      fontWeight: 500,
      opacity: 0.75,
    },
    dotRow: {
      display: 'flex',
      gap: '5px',
      marginTop: '20px',
      position: 'relative',
      zIndex: 1,
    },
    dot: {
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.35)',
    },
    body: {
      background: '#ffffff',
      padding: '0 0 24px',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px 12px',
    },
    sectionTitle: {
      fontSize: '13px',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
      color: '#94a3b8',
    },
    seeAll: {
      fontSize: '13px',
      fontWeight: 600,
      color: '#3b82f6',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
    },
    txList: {
      listStyle: 'none',
      margin: 0,
      padding: '0 0 4px',
    },
    txItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '11px 24px',
      transition: 'background 0.15s',
      cursor: 'default',
    },
    txIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: '17px',
    },
    txMeta: {
      flex: 1,
      minWidth: 0,
    },
    txDesc: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#0f172a',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    txDate: {
      fontSize: '12px',
      color: '#94a3b8',
      marginTop: '2px',
    },
    txAmount: (positive: boolean): React.CSSProperties => ({
      fontSize: '14px',
      fontWeight: 700,
      color: positive ? '#10b981' : '#0f172a',
      flexShrink: 0,
    }),
    divider: {
      height: '1px',
      background: '#f1f5f9',
      margin: '0 24px',
    },
    actionWrap: {
      padding: '16px 24px 0',
    },
    actionBtn: {
      width: '100%',
      padding: '15px',
      borderRadius: '14px',
      border: 'none',
      background: pressed
        ? 'linear-gradient(135deg, #1d4ed8, #4338ca)'
        : 'linear-gradient(135deg, #2563eb, #4f46e5)',
      color: '#fff',
      fontSize: '15px',
      fontWeight: 700,
      letterSpacing: '0.01em',
      cursor: 'pointer',
      boxShadow: pressed
        ? '0 2px 8px rgba(37,99,235,0.3)'
        : '0 6px 20px rgba(37,99,235,0.4)',
      transform: pressed ? 'scale(0.98)' : 'scale(1)',
      transition: 'all 0.15s ease',
    },
  };

  const [formatted, cents] = formatCurrency(balance, currency).split('.');
  const iconMap = (desc: string): string => {
    const d = desc.toLowerCase();
    if (d.includes('coffee') || d.includes('cafe') || d.includes('starbucks')) return '☕';
    if (d.includes('uber') || d.includes('lyft') || d.includes('ride')) return '🚗';
    if (d.includes('grocery') || d.includes('market') || d.includes('food')) return '🛒';
    if (d.includes('netflix') || d.includes('spotify') || d.includes('apple')) return '📱';
    if (d.includes('gym') || d.includes('fitness')) return '💪';
    if (d.includes('salary') || d.includes('payroll') || d.includes('deposit')) return '💸';
    if (d.includes('amazon') || d.includes('shop')) return '📦';
    return '💳';
  };

  const iconBg = (amount: number): string =>
    amount > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)';

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={s.headerGlow} />
        <div style={s.headerGlow2} />
        <div style={s.topRow}>
          <span style={s.cardName}>{cardName}</span>
          <span style={s.badge}>{cardType}</span>
        </div>
        <div style={s.balanceLabel}>Available Balance</div>
        <div style={s.balance}>
          {formatted}
          {cents !== undefined && <span style={s.balanceCents}>.{cents}</span>}
        </div>
        <div style={s.dotRow}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={s.dot} />
          ))}
          <span style={{ ...s.dot, marginLeft: '4px' }} />
          {[...Array(4)].map((_, i) => (
            <div key={i + 5} style={s.dot} />
          ))}
        </div>
      </div>

      <div style={s.body}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTitle}>Transactions</span>
          <button style={s.seeAll}>See all</button>
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding: '16px 24px', color: '#94a3b8', fontSize: '14px' }}>
            No transactions yet.
          </div>
        ) : (
          <ul style={s.txList}>
            {transactions.map((tx, idx) => (
              <React.Fragment key={tx.id}>
                <li style={s.txItem}>
                  <div style={{ ...s.txIcon, background: iconBg(tx.amount) }}>
                    {iconMap(tx.description)}
                  </div>
                  <div style={s.txMeta}>
                    <div style={s.txDesc}>{tx.description}</div>
                    <div style={s.txDate}>{formatDate(tx.date)}</div>
                  </div>
                  <div style={s.txAmount(tx.amount > 0)}>
                    {tx.amount > 0 ? '+' : '−'}&nbsp;{formatCurrency(tx.amount, currency)}
                  </div>
                </li>
                {idx < transactions.length - 1 && <div style={s.divider} />}
              </React.Fragment>
            ))}
          </ul>
        )}

        <div style={s.actionWrap}>
          <button
            style={s.actionBtn}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onClick={onPrimaryAction}
          >
            {primaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
