import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Clock } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

/**
 * DateRangePicker - A high-tech, theme-aligned date range selector
 */
export default function DateRangePicker({ startDate, endDate, onApply }) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempStart, setTempStart] = useState(startDate);
    const [tempEnd, setTempEnd] = useState(endDate);
    const dropdownRef = useRef(null);

    const presets = [
        { label: 'LAST 24 HOURS', days: 1 },
        { label: 'LAST 7 DAYS', days: 7 },
        { label: 'LAST 30 DAYS', days: 30 },
        { label: 'LAST 90 DAYS', days: 90 },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            // Don't close if clicking inside the component
            if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
                return;
            }

            // Specifically check for native date picker elements in some browsers 
            // which might be children of body but not the component
            if (event.target.tagName === 'INPUT' && event.target.type === 'date') {
                return;
            }

            setIsOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleApply = () => {
        onApply(tempStart, tempEnd);
        setIsOpen(false);
    };

    const selectPreset = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);

        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];

        setTempStart(startStr);
        setTempEnd(endStr);
        onApply(startStr, endStr);
        setIsOpen(false);
    };

    const formatDateLabel = (dateStr) => {
        if (!dateStr) return '---';
        return dateStr; // Keep it simple and techy (YYYY-MM-DD)
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 16px',
                    backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
                    border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}${isOpen ? '88' : '33'}`,
                    borderRadius: '4px',
                    color: THEME_CONFIG.COLORS.textPrimary,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isOpen ? `0 0 15px ${THEME_CONFIG.COLORS.electricBlue}22` : 'none',
                    minWidth: '240px',
                    justifyContent: 'space-between'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color={THEME_CONFIG.COLORS.electricBlue} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatDateLabel(startDate)} — {formatDateLabel(endDate)}
                    </span>
                </div>
                <ChevronDown
                    size={14}
                    style={{
                        transition: 'transform 0.3s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        opacity: 0.7
                    }}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        zIndex: 20000, // Higher than scanline (9999)
                        width: '320px',
                        backgroundColor: `${THEME_CONFIG.COLORS.backgroundElevated}F2`,
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}44`,
                        borderRadius: '4px',
                        padding: '20px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,212,255,0.1)',
                        animation: 'fadeInUp 0.3s ease-out'
                    }}
                >
                    {/* Presets */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            fontSize: '0.65rem',
                            color: THEME_CONFIG.COLORS.textMuted,
                            letterSpacing: '2px',
                            fontFamily: "'Rajdhani', sans-serif",
                            marginBottom: '12px'
                        }}>
                            QUICK SELECT
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {presets.map(p => (
                                <button
                                    key={p.label}
                                    onClick={() => selectPreset(p.days)}
                                    style={{
                                        padding: '8px',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(0,212,255,0.1)',
                                        borderRadius: '2px',
                                        color: THEME_CONFIG.COLORS.textSecondary,
                                        fontSize: '0.65rem',
                                        fontFamily: "'Rajdhani', sans-serif",
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(0,212,255,0.08)';
                                        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.electricBlue;
                                        e.currentTarget.style.color = THEME_CONFIG.COLORS.textPrimary;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(0,212,255,0.1)';
                                        e.currentTarget.style.color = THEME_CONFIG.COLORS.textSecondary;
                                    }}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Range */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            fontSize: '0.65rem',
                            color: THEME_CONFIG.COLORS.textMuted,
                            letterSpacing: '2px',
                            fontFamily: "'Rajdhani', sans-serif",
                            marginBottom: '12px'
                        }}>
                            CUSTOM RANGE
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label style={{ color: THEME_CONFIG.COLORS.textMuted, fontSize: '0.7rem' }}>START</label>
                                <input
                                    type="date"
                                    value={tempStart}
                                    onChange={(e) => setTempStart(e.target.value)}
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}33`,
                                        borderRadius: '2px',
                                        color: THEME_CONFIG.COLORS.textPrimary,
                                        padding: '4px 8px',
                                        fontSize: '0.8rem',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label style={{ color: THEME_CONFIG.COLORS.textMuted, fontSize: '0.7rem' }}>END</label>
                                <input
                                    type="date"
                                    value={tempEnd}
                                    onChange={(e) => setTempEnd(e.target.value)}
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}33`,
                                        borderRadius: '2px',
                                        color: THEME_CONFIG.COLORS.textPrimary,
                                        padding: '4px 8px',
                                        fontSize: '0.8rem',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={handleApply}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: THEME_CONFIG.COLORS.electricBlue,
                            border: 'none',
                            borderRadius: '2px',
                            color: THEME_CONFIG.COLORS.backgroundDark,
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            letterSpacing: '1px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                    >
                        <Check size={16} />
                        APPLY FILTER
                    </button>
                </div>
            )}

            {/* Local Animations */}
            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
