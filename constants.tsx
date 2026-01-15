
import React from 'react';

export const InfinityLogo = ({ className = "w-8 h-8", color = "currentColor" }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 100 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M25 12.5C18.0964 12.5 12.5 18.0964 12.5 25C12.5 31.9036 18.0964 37.5 25 37.5C29.6739 37.5 33.8043 34.9257 36 31.0263L64 18.9737C66.1957 15.0743 70.3261 12.5 75 12.5C81.9036 12.5 87.5 18.0964 87.5 25C87.5 31.9036 81.9036 37.5 75 37.5C70.3261 37.5 66.1957 34.9257 64 31.0263L36 18.9737C33.8043 15.0743 29.6739 12.5 25 12.5Z" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="infinity-path"
    />
  </svg>
);

export const PROCESSING_PHRASES = [
  "Analisando o perfil do cliente...",
  "Estudando o nicho de mercado...",
  "Escrevendo ganchos virais...",
  "Refinando as chamadas para ação...",
  "Gerando estratégias de conversão...",
  "Otimizando para Reels e TikTok..."
];
