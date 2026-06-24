import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function StudyHubLogo({ size = 40, className }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Kotak Rounded */}
      <rect width="48" height="48" rx="12" fill="#0EA5E9" fillOpacity="0.1"/>
      
      {/* Bentuk Segi Enam (Melambangkan Jaringan / Hub) */}
      <path 
        d="M24 12L12 18V30L24 36L36 30V18L24 12Z" 
        stroke="#0EA5E9" 
        strokeWidth="3" 
        strokeLinejoin="round"
      />
      
      {/* Titik Pusat (Core Node) */}
      <circle cx="24" cy="24" r="4" fill="#0EA5E9"/>
      
      {/* Garis Koneksi (Melambangkan halaman buku yang terbuka sekaligus jaringan) */}
      <path d="M24 12V20" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round"/>
      <path d="M12 30L18 26" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round"/>
      <path d="M36 30L30 26" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}