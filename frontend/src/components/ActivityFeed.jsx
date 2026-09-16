import React, { useState } from 'react';
import { Activity, MessageSquare, Send, X, Clock, CheckCircle2 } from 'lucide-react';

export function ActivityFeed({ isOpen, onClose, activities, onSendChat, users }) {
  const [chatInput, setChatInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput.trim());
    setChatInput('');
  };

  return (
    <aside className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Activity size={18} className="text-indigo-400" />
          <span>Live Collaboration Feed</span>
        </div>
        <button className="tool-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {activities.map((act) => (
          <div key={act.id} style={{
            padding: '12px',
            borderRadius: '12px',
            background: act.type === 'chat' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: act.userColor || '#6366f1',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {act.userName ? act.userName.slice(0, 2).toUpperCase() : 'US'}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {act.userName}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} />
                {act.time}
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              {act.text}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{
        padding: '14px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '8px',
        background: 'rgba(10, 13, 20, 0.6)'
      }}>
        <input
          type="text"
          placeholder="Broadcast chat message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.85rem'
          }}
        />
        <button type="submit" className="action-btn primary" style={{ padding: '8px 12px' }}>
          <Send size={14} />
        </button>
      </form>
    </aside>
  );
}
