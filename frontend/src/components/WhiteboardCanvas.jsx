import React, { useState, useRef } from 'react';
import { 
  MousePointer, 
  StickyNote, 
  Square, 
  Circle, 
  Trash2, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  Move
} from 'lucide-react';

export function WhiteboardCanvas({ elements, setElements, cursors, onElementChange, currentUser }) {
  const [selectedTool, setSelectedTool] = useState('select'); // select, note, rectangle, circle
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Handle Canvas Click to create elements when tool is selected
  const handleCanvasClick = (e) => {
    if (e.target !== canvasRef.current && !e.target.classList.contains('canvas-wrapper')) return;
    
    if (selectedTool === 'note' || selectedTool === 'rectangle' || selectedTool === 'circle') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      const newEl = {
        id: 'el_' + Date.now(),
        type: selectedTool,
        x: Math.round(x),
        y: Math.round(y),
        width: selectedTool === 'note' ? 220 : 160,
        height: selectedTool === 'note' ? 180 : 120,
        content: selectedTool === 'note' ? 'New collaborative idea...' : 'Feature Scope',
        color: selectedTool === 'note' ? '#1e293b' : 'rgba(99, 102, 241, 0.2)',
        borderColor: selectedTool === 'note' ? '#3b82f6' : '#6366f1',
        author: currentUser.name,
        authorColor: currentUser.color
      };

      const updated = [...elements, newEl];
      setElements(updated);
      setSelectedId(newEl.id);
      setSelectedTool('select');
      onElementChange(updated, `added a new ${newEl.type} on canvas`);
    } else {
      setSelectedId(null);
    }
  };

  const handleMouseDown = (e, el) => {
    if (selectedTool !== 'select') return;
    e.stopPropagation();
    setSelectedId(el.id);
    isDraggingRef.current = true;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoom;
    const clickY = (e.clientY - rect.top) / zoom;

    dragOffsetRef.current = {
      x: clickX - el.x,
      y: clickY - el.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !selectedId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / zoom;
    const currentY = (e.clientY - rect.top) / zoom;

    const updated = elements.map((item) => {
      if (item.id === selectedId) {
        return {
          ...item,
          x: Math.max(10, Math.round(currentX - dragOffsetRef.current.x)),
          y: Math.max(10, Math.round(currentY - dragOffsetRef.current.y))
        };
      }
      return item;
    });

    setElements(updated);
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      onElementChange(elements, 'repositioned an element on canvas');
    }
  };

  const handleContentChange = (id, newContent) => {
    const updated = elements.map((el) => (el.id === id ? { ...el, content: newContent } : el));
    setElements(updated);
    onElementChange(updated, 'updated canvas element content');
  };

  const handleDelete = (id) => {
    const updated = elements.filter((el) => el.id !== id);
    setElements(updated);
    setSelectedId(null);
    onElementChange(updated, 'deleted an element from canvas');
  };

  return (
    <div className="view-container">
      {/* Floating Canvas Toolbar */}
      <div className="canvas-toolbar">
        <button 
          className={`tool-btn ${selectedTool === 'select' ? 'active' : ''}`}
          onClick={() => setSelectedTool('select')}
          title="Select & Drag"
        >
          <MousePointer size={18} />
        </button>
        <button 
          className={`tool-btn ${selectedTool === 'note' ? 'active' : ''}`}
          onClick={() => setSelectedTool('note')}
          title="Add Sticky Note"
        >
          <StickyNote size={18} />
        </button>
        <button 
          className={`tool-btn ${selectedTool === 'rectangle' ? 'active' : ''}`}
          onClick={() => setSelectedTool('rectangle')}
          title="Add Rectangle"
        >
          <Square size={18} />
        </button>
        <button 
          className={`tool-btn ${selectedTool === 'circle' ? 'active' : ''}`}
          onClick={() => setSelectedTool('circle')}
          title="Add Circle"
        >
          <Circle size={18} />
        </button>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }} />

        <button className="tool-btn" onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))} title="Zoom In">
          <ZoomIn size={16} />
        </button>
        <button className="tool-btn" onClick={() => setZoom((z) => Math.max(z - 0.1, 0.6))} title="Zoom Out">
          <ZoomOut size={16} />
        </button>
        <button className="tool-btn" onClick={() => setZoom(1)} title="Reset View">
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={canvasRef}
        className="canvas-wrapper"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      >
        {/* Render Collaborator Cursors */}
        {cursors.map((c) => (
          <div 
            key={c.userId}
            className="live-cursor"
            style={{
              left: `${c.x}px`,
              top: `${c.y}px`
            }}
          >
            <svg className="cursor-pointer-svg" viewBox="0 0 24 24" fill={c.color || '#ec4899'}>
              <path d="M5.653 3.123A.75.75 0 004.5 3.75v16.5a.75.75 0 001.272.544l4.316-4.108 3.59 7.027a.75.75 0 001.018.337l2.673-1.336a.75.75 0 00.337-1.018l-3.535-6.92 5.626-1.125A.75.75 0 0019.5 12V3.75a.75.75 0 00-1.153-.627l-12.694 8.75z" />
            </svg>
            <div className="cursor-label" style={{ backgroundColor: c.color || '#ec4899' }}>
              {c.userName}
            </div>
          </div>
        ))}

        {/* Render Canvas Elements */}
        {elements.map((el) => {
          const isSelected = selectedId === el.id;
          return (
            <div
              key={el.id}
              className={`canvas-element ${el.type === 'note' ? 'sticky-note' : ''} ${isSelected ? 'selected' : ''}`}
              style={{
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                background: el.color,
                border: `2px solid ${el.borderColor}`,
                borderRadius: el.type === 'circle' ? '50%' : '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseDown={(e) => handleMouseDown(e, el)}
            >
              <div className="sticky-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: el.authorColor }}>
                  <Sparkles size={12} />
                  {el.author}
                </span>
                {isSelected && (
                  <button 
                    style={{ color: '#ef4444', background: 'none', padding: 0 }}
                    onClick={() => handleDelete(el.id)}
                    title="Delete Element"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <textarea
                className="sticky-content"
                value={el.content}
                onChange={(e) => handleContentChange(el.id, e.target.value)}
                placeholder="Type here..."
                rows={3}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
