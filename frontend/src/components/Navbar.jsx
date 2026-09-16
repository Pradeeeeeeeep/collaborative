import React from 'react';
import { 
  Zap, 
  Layout, 
  FileText, 
  Kanban, 
  Share2, 
  Plus,
  Users,
  Activity
} from 'lucide-react';

export function Navbar({ activeView, setActiveView, users, isSidebarOpen, setIsSidebarOpen, onNewItem }) {
  return (
    <header className="app-header">
      <div className="brand-logo">
        <div className="logo-icon">
          <Zap size={20} />
        </div>
        <span>NexusSync</span>
      </div>

      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${activeView === 'canvas' ? 'active' : ''}`}
          onClick={() => setActiveView('canvas')}
        >
          <Layout size={16} />
          <span>Canvas Board</span>
        </button>
        <button 
          className={`nav-tab ${activeView === 'doc' ? 'active' : ''}`}
          onClick={() => setActiveView('doc')}
        >
          <FileText size={16} />
          <span>Doc Editor</span>
        </button>
        <button 
          className={`nav-tab ${activeView === 'kanban' ? 'active' : ''}`}
          onClick={() => setActiveView('kanban')}
        >
          <Kanban size={16} />
          <span>Sprint Kanban</span>
        </button>
      </nav>

      <div className="header-actions">
        <div className="sync-badge">
          <span className="sync-pulse"></span>
          <span>Broadcast Active</span>
        </div>

        <div className="user-stack">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="user-avatar-circle"
              style={{ backgroundColor: user.color }}
              title={`${user.name} (${user.role})`}
            >
              {user.avatar}
            </div>
          ))}
        </div>

        <button className="action-btn" onClick={onNewItem}>
          <Plus size={16} />
          <span>Add Element</span>
        </button>

        <button className="action-btn primary" onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert('Room Link copied to clipboard! Open in another browser tab to test real-time tab sync.');
        }}>
          <Share2 size={16} />
          <span>Share Room</span>
        </button>

        <button 
          className={`action-btn ${isSidebarOpen ? 'primary' : ''}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Toggle Activity Stream"
        >
          <Activity size={16} />
        </button>
      </div>
    </header>
  );
}
