import React, { useState, useRef, useEffect } from 'react';
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
  background: linear-gradient(135deg, 
    ${THEME_CONFIG.COLORS.backgroundSecondary} 0%, 
    rgba(59, 130, 246, 0.05) 100%);
  border: 2px solid ${THEME_CONFIG.COLORS.accentPrimary};
  border-radius: ${THEME_CONFIG.BORDER_RADIUS.large};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 400px;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2), 
              0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent, 
      ${THEME_CONFIG.COLORS.accentPrimary}, 
      transparent);
    animation: shimmer 2s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const Header = styled.div`
  padding: ${THEME_CONFIG.SPACING.md};
  background-color: ${THEME_CONFIG.COLORS.backgroundElevated};
  border-bottom: 1px solid ${THEME_CONFIG.COLORS.borderPrimary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: ${THEME_CONFIG.COLORS.textElectric};
  font-family: ${THEME_CONFIG.TYPOGRAPHY.fontFamily.monospace};
  font-size: ${THEME_CONFIG.TYPOGRAPHY.fontSize.h4};
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '✨';
  }
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
`;

const AIContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${THEME_CONFIG.SPACING.md};
  font-size: ${THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall};
`;

const SectionTitle = styled.h5`
  margin: ${THEME_CONFIG.SPACING.sm} 0;
  color: ${THEME_CONFIG.COLORS.textElectric};
  font-size: ${THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall};
  font-weight: 600;
`;

const List = styled.ul`
  margin: 0;
  padding-left: ${THEME_CONFIG.SPACING.md};
  
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
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${THEME_CONFIG.COLORS.accentSecondary};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DashboardAI = ({ siteId }) => {
  const [messages, setMessages] = useState([]);
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
          <Title>Analytiq AI</Title>
          <button
            onClick={() => setToolsOpen(true)}
            style={{
              border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
              padding: '6px 14px',
              background: 'transparent',
              color: THEME_CONFIG.COLORS.textSecondary,
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
              cursor: 'pointer'
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
      {toolsOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            style={{
              width: 'min(960px, 100%)',
              maxHeight: '85vh',
              background: THEME_CONFIG.COLORS.backgroundElevated,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.xlarge,
              border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
              padding: THEME_CONFIG.SPACING.lg,
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)',
              overflowY: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: THEME_CONFIG.SPACING.md
              }}
            >
              <h4 style={{ margin: 0, color: THEME_CONFIG.COLORS.textPrimary }}>AI Insights & Deep Dive</h4>
              <button
                onClick={() => setToolsOpen(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: THEME_CONFIG.COLORS.textSecondary,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
            <div style={{ display: 'grid', gap: THEME_CONFIG.SPACING.lg }}>
              <DashboardMetricDeepDive siteId={siteId} />
              <DashboardAIInsights siteId={siteId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardAI;
