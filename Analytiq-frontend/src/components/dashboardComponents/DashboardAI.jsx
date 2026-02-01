import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes, css } from 'styled-components';
import { THEME_CONFIG } from '../../config';
import API from '../API';
import { useToast } from '../Toast';
import LoadingSpinner from '../LoadingSpinner';
import DashboardMetricDeepDive from './DashboardMetricDeepDive.jsx';
import DashboardAIInsights from './DashboardAIInsights.jsx';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Container = styled.div`
  background-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
  border: 2px solid ${THEME_CONFIG.COLORS.borderPrimary};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 400px;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: all 0.4s ease;
  
  &:hover {
    border-color: ${THEME_CONFIG.COLORS.electricBlue};
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 102, 255, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: ${THEME_CONFIG.COLORS.electricBlue};
    transition: height 0.3s ease;
  }
`;

const Header = styled.div`
  padding: ${THEME_CONFIG.SPACING.lg};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${THEME_CONFIG.SPACING.md};
`;

const Title = styled.h3`
  margin: 0;
  color: ${THEME_CONFIG.COLORS.textPrimary};
  font-family: 'Orbitron', sans-serif;
  font-size: ${THEME_CONFIG.TYPOGRAPHY.fontSize.h3};
  font-weight: ${THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold};
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChatArea = styled.div`
  flex: 1;
  padding: ${THEME_CONFIG.SPACING.md};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${THEME_CONFIG.SPACING.md};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${THEME_CONFIG.COLORS.borderPrimary};
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div`
  padding: ${THEME_CONFIG.SPACING.md};
  border-radius: ${THEME_CONFIG.BORDER_RADIUS.medium};
  max-width: 85%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.isUser 
    ? THEME_CONFIG.COLORS.accentPrimary 
    : THEME_CONFIG.COLORS.backgroundElevated};
  color: ${props => props.isUser 
    ? THEME_CONFIG.COLORS.textPrimary 
    : THEME_CONFIG.COLORS.textSecondary};
  border: 1px solid ${THEME_CONFIG.COLORS.borderPrimary};
  animation: ${slideIn} 0.3s ease-out;
  font-family: 'Rajdhani', sans-serif;
  line-height: 1.6;
`;

const AIContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${THEME_CONFIG.SPACING.md};
  font-size: ${THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall};
  font-family: 'Rajdhani', sans-serif;
`;

const SectionTitle = styled.h5`
  margin: ${THEME_CONFIG.SPACING.sm} 0;
  color: ${THEME_CONFIG.COLORS.electricBlue};
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 0 8px ${THEME_CONFIG.COLORS.electricBlue}44;
`;

const List = styled.ul`
  margin: 0;
  padding-left: ${THEME_CONFIG.SPACING.md};
  font-family: 'Rajdhani', sans-serif;
  
  li {
    margin-bottom: ${THEME_CONFIG.SPACING.xs};
    color: ${THEME_CONFIG.COLORS.textSecondary};
  }
`;

const PriorityBadge = styled.span`
  display: inline-block;
  margin-left: ${THEME_CONFIG.SPACING.sm};
  padding: 2px 8px;
  border-radius: ${THEME_CONFIG.BORDER_RADIUS.small};
  font-size: ${THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall};
  font-weight: 600;
  background: ${props => {
    switch(props.level?.toLowerCase()) {
      case 'high': return 'rgba(239, 68, 68, 0.2)';
      case 'medium': return 'rgba(251, 191, 36, 0.2)';
      case 'low': return 'rgba(34, 197, 94, 0.2)';
      default: return THEME_CONFIG.COLORS.borderPrimary;
    }
  }};
  color: ${props => {
    switch(props.level?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#fbbf24';
      case 'low': return '#22c55e';
      default: return THEME_CONFIG.COLORS.textSecondary;
    }
  }};
`;

const InputArea = styled.div`
  padding: ${THEME_CONFIG.SPACING.md};
  border-top: 1px solid ${THEME_CONFIG.COLORS.borderPrimary};
  display: flex;
  gap: ${THEME_CONFIG.SPACING.sm};
`;

const Input = styled.input`
  flex: 1;
  padding: ${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md};
  background: ${THEME_CONFIG.COLORS.backgroundPrimary};
  border: 1px solid ${THEME_CONFIG.COLORS.borderPrimary};
  border-radius: ${THEME_CONFIG.BORDER_RADIUS.medium};
  color: ${THEME_CONFIG.COLORS.textPrimary};
  font-size: ${THEME_CONFIG.TYPOGRAPHY.fontSize.body};
  font-family: 'Rajdhani', sans-serif;
  
  &:focus {
    outline: none;
    border-color: ${THEME_CONFIG.COLORS.accentPrimary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: ${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.lg};
  background: ${THEME_CONFIG.COLORS.accentPrimary};
  border: none;
  border-radius: ${THEME_CONFIG.BORDER_RADIUS.medium};
  color: ${THEME_CONFIG.COLORS.textPrimary};
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  
  &:hover:not(:disabled) {
    background: ${THEME_CONFIG.COLORS.accentSecondary};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const INITIAL_MESSAGES = [
  {
    role: 'ai',
    content: {
      summary: "Hi, I'm Analytiq AI. Ask me anything about your traffic, engagement, or performance metrics.",
      root_causes: [
        'Spot traffic spikes and drops across your key pages',
        'Identify segments with unusually high bounce or low engagement',
        'Highlight slow pages that may be hurting conversions'
      ],
      recommendations: [
        'Try asking: "Why did my traffic spike yesterday?"',
        'Or: "Which pages are loading slowest this week?"',
        'Or: "Where am I losing the most users in the funnel?"'
      ]
    }
  }
];

const DashboardAI = ({ siteId }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const scrollRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await API.chatWebsite(siteId, userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      toast.error("Failed to get AI response. Please try again.");
      setMessages(prev => [...prev, {
        role: 'ai',
        content: { summary: "I encountered an error while processing your request." },
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const renderAIResponse = (data) => {
    if (data.full_response) return <div>{data.full_response}</div>;

    return (
      <AIContent>
        <div>
          {data.summary}
          {data.priority && <PriorityBadge level={data.priority}>{data.priority}</PriorityBadge>}
        </div>

        {data.root_causes?.length > 0 && (
          <div>
            <SectionTitle>Analysis</SectionTitle>
            <List>
              {data.root_causes.map((cause, i) => (
                <li key={i}>{cause}</li>
              ))}
            </List>
          </div>
        )}

        {data.recommendations?.length > 0 && (
          <div>
            <SectionTitle>Recommendations</SectionTitle>
            <List>
              {data.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </List>
          </div>
        )}
      </AIContent>
    );
  };

  return (
    <>
      <Container>
        <Header>
          <div style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
              <span style={{
                fontSize: '24px',
                filter: `drop-shadow(0 0 8px ${THEME_CONFIG.COLORS.electricBlue})`
              }}></span>
              <Title>Analytiq AI</Title>
            </div>
          </div>
          <button
            onClick={() => setToolsOpen(true)}
            style={{
              border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}33`,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
              padding: '6px 14px',
              background: 'transparent',
              color: THEME_CONFIG.COLORS.electricBlue,
              fontSize: '0.7rem',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.electricBlue;
              e.currentTarget.style.boxShadow = `0 0 10px ${THEME_CONFIG.COLORS.electricBlue}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${THEME_CONFIG.COLORS.electricBlue}33`;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Open AI Tools
          </button>
        </Header>

        <ChatArea ref={scrollRef}>
          {messages.map((msg, index) => (
            <MessageBubble key={index} isUser={msg.role === 'user'}>
              {msg.role === 'user' ? msg.content : renderAIResponse(msg.content)}
            </MessageBubble>
          ))}
          {loading && (
            <div style={{ alignSelf: 'center', padding: '10px' }}>
              <LoadingSpinner size={20} />
            </div>
          )}
        </ChatArea>

        <InputArea>
          <Input
            placeholder="Ask about your metrics..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <SendButton onClick={handleSend} disabled={loading || !input.trim()}>
            SEND
          </SendButton>
        </InputArea>
      </Container>
      {toolsOpen && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setToolsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(960px, 100%)',
              maxHeight: '85vh',
              background: THEME_CONFIG.COLORS.backgroundSecondary,
              borderRadius: '12px',
              border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
              padding: 0,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            {/* Top accent bar */}
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '4px', 
              backgroundColor: THEME_CONFIG.COLORS.electricBlue
            }} />

            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: THEME_CONFIG.SPACING.lg,
                marginBottom: THEME_CONFIG.SPACING.md
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
                  <span style={{
                    fontSize: '24px',
                    filter: `drop-shadow(0 0 8px ${THEME_CONFIG.COLORS.electricBlue})`
                  }}>🔬</span>
                  <h4 style={{ 
                    margin: 0, 
                    color: THEME_CONFIG.COLORS.textPrimary,
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h3,
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>AI Insights & Deep Dive</h4>
                </div>
                <p
                  style={{
                    color: THEME_CONFIG.COLORS.textMuted,
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
                    margin: `${THEME_CONFIG.SPACING.xs} 0 0 0`,
                    fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
                  }}
                >
                  Advanced Analytics & Predictions
                </p>
              </div>
              <button
                onClick={() => setToolsOpen(false)}
                style={{
                  border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}33`,
                  background: 'transparent',
                  color: THEME_CONFIG.COLORS.electricBlue,
                  padding: '6px 14px',
                  borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.electricBlue;
                  e.currentTarget.style.boxShadow = `0 0 10px ${THEME_CONFIG.COLORS.electricBlue}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${THEME_CONFIG.COLORS.electricBlue}33`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: `0 ${THEME_CONFIG.SPACING.lg} ${THEME_CONFIG.SPACING.lg}`, display: 'grid', gap: THEME_CONFIG.SPACING.lg }}>
              <DashboardMetricDeepDive siteId={siteId} />
              <DashboardAIInsights siteId={siteId} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DashboardAI;
