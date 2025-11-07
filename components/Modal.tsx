
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    titleIcon?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, titleIcon }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className="bg-surface rounded-2xl border border-border w-full max-w-md shadow-2xl animate-slide-up flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
                    <h2 id="modal-title" className="text-lg font-semibold text-text-main flex items-center gap-2">
                        {titleIcon}
                        {title}
                    </h2>
                    <button onClick={onClose} className="text-text-light hover:text-text-main p-1 rounded-full hover:bg-surface-light">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </header>
                <div className="overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
