
import React, { useState, useEffect, useRef } from 'react';
import { generateFinancialAnalysis } from '../services/geminiService';
import { MonthData } from '../types';
import { Modal } from './Modal';

interface AIChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    monthData: MonthData;
    monthName: string;
    year: number;
}

const Icons = {
    AI: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 8.3 9c.5 1.1 1.4 2 2.7 2s2.2-.9 2.7-2c.1-.4.2-.8.3-1.3.6-1.1 0-2.3-1-3.1-.3-.2-.6-.3-1-.3z"></path><path d="M12 21c-1.2 0-2.4-.6-3-1.7A3.6 3.6 0 0 1 8.3 15c.5-1.1 1.4-2 2.7-2s2.2.9 2.7 2c.1.4.2.8.3 1.3.6 1.1 0 2.3-1 3.1-.3-.2-.6-.3-1 .3z"></path><path d="M3 12c0-1.2.6-2.4 1.7-3A3.6 3.6 0 0 1 9 8.3c1.1.5 2 1.4 2 2.7s-.9 2.2-2 2.7c-.4.1-.8.2-1.3.3-1.1.6-2.3 0-3.1-1 .2-.3-.3-.6-.3-1z"></path><path d="M21 12c0-1.2-.6-2.4-1.7-3A3.6 3.6 0 0 0 15 8.3c-1.1.5-2 1.4-2 2.7s.9 2.2 2 2.7c.4.1.8.2 1.3.3 1.1.6 2.3 0-3.1-1 .2-.3.3-.6-.3-1z"></path></svg>,
    Send: () => <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
};

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const simpleMarkdownToHtml = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\s*-\s/g, '<br>• ')
        .replace(/\n\s*\*\s/g, '<br>• ')
        .replace(/\n/g, '<br>');
};

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, monthData, monthName, year }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMessages([{
                sender: 'ai',
                text: `Olá! Sou o Finanças AI. Como posso ajudar a analisar suas finanças de ${monthName}?`
            }]);
        }
    }, [isOpen, monthName]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponseText = await generateFinancialAnalysis(monthData, monthName, year, input);
        const aiMessage: Message = { sender: 'ai', text: aiResponseText };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Análise com IA"
            titleIcon={<Icons.AI />}
        >
            <div className="flex flex-col h-[70vh] md:h-[60vh]">
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-surface-light text-text-main rounded-bl-none'}`}
                                dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(msg.text) }}
                            />
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 text-sm bg-surface-light text-text-main rounded-bl-none">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-text-lighter rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-text-lighter rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-text-lighter rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-border">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pergunte sobre suas finanças..."
                            className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm text-text-main placeholder:text-text-lighter focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white rounded-xl p-2.5 flex-shrink-0 disabled:bg-surface-light disabled:cursor-not-allowed transition-colors"
                            disabled={isLoading}
                        >
                            <Icons.Send />
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
};
