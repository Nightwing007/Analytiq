import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { THEME_CONFIG } from '../../config';
import API from '../API';
import { useToast } from '../Toast';
import LoadingSpinner from '../LoadingSpinner';

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
  border: 1px solid ${THEME_CONFIG.COLORS.borderPrimary};
  border-radius: ${THEME_CONFIG.BORDER_RADIUS.large};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 500px;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
  max-width: 85%;
  padding: ${THEME_CONFIG.SPACING.md};
  border-radius: ${THEME_CONFIG.BORDER_RADIUS.medium};
  animation: ${fadeIn} 0.3s ease-out;
  line-height: 1.5;
  font-size: ${THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall};
  
  ${props => props.isUser ? css`
    align-self: flex-end;
    background-color: ${THEME_CONFIG.COLORS.electricBlueDark};
    color: ${THEME_CONFIG.COLORS.textPrimary};
    border-bottom-right-radius: 2px;
  ` : css`
    align-self: flex-start;
    background-color: ${THEME_CONFIG.COLORS.backgroundElevated};
    border: 1px solid ${THEME_CONFIG.COLORS.borderPrimary};
    color: ${THEME_CONFIG.COLORS.textSecondary};
    border-bottom-left-radius: 2px;
  `}
`;

const AIContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  color: ${THEME_CONFIG.COLORS.electricBlueLight};
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-top: 4px;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 16px;
`;

const InputArea = styled.div`
  padding: ${THEME_CONFIG.SPACING.md};
  border-top: 1px solid ${THEME_CONFIG.COLORS.borderPrimary};
  background-color: ${THEME_CONFIG.COLORS.backgroundElevated};
  display: flex;
  gap: ${THEME_CONFIG.SPACING.sm};
`;

const Input = styled.input`
  flex: 1;
  background-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
  border: 1px solid ${THEME_CONFIG.COLORS.borderPrimary};
  border-radius: ${THEME_CONFIG.BORDER_RADIUS.medium};
  padding: 10px;
  color: ${THEME_CONFIG.COLORS.textPrimary};
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${THEME_CONFIG.COLORS.electricBlue};
  }
`;

const SendButton = styled.button`
  background-color: ${THEME_CONFIG.COLORS.electricBlue};
  color: ${THEME_CONFIG.COLORS.backgroundDark};
  border: none;
  border-radius: ${THEME_CONFIG.BORDER_RADIUS.medium};
  padding: 0 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${THEME_CONFIG.COLORS.electricBlueLight};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PriorityBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  margin-left: 8px;
  
  ${props => {
    switch (props.level) {
      case 'high': return `background: ${THEME_CONFIG.COLORS.error}; color: white;`;
      case 'medium': return `background: ${THEME_CONFIG.COLORS.warning}; color: black;`;
      case 'low': return `background: ${THEME_CONFIG.COLORS.success}; color: white;`;
      default: return `background: ${THEME_CONFIG.COLORS.borderPrimary}; color: ${THEME_CONFIG.COLORS.textMuted};`;
    }
  }}
`;

const DashboardAI = ({ siteId }) => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: { summary: "Hello! I'm your AI Analyst. Ask me anything about your website traffic, metrics, or SEO." }
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
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
    <Container>
      <Header>
        <Title>Analytiq AI</Title>
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
  );
};

export default DashboardAI;
