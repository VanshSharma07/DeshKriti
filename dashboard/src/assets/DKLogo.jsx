// src/assets/DKLogo.jsx

export const DKLogo = () => {
  return (
    <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
      {/* Clean Background with subtle shadow */}
      <rect x="2" y="2" width="196" height="56" rx="10" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.05))"/>
      
      {/* Bolder D with clear shape */}
      <path d="
        M25 12
        L25 48
        L40 48
        C55 48 60 40 60 30
        C60 20 55 12 40 12
        L25 12
        Z" 
        fill="#1e40af"
      />
      
      {/* Bold K with clear strokes */}
      <path d="
        M65 12
        L75 12
        L75 25
        L90 12
        L102 12
        L82 30
        L102 48
        L90 48
        L75 35
        L75 48
        L65 48
        Z" 
        fill="#1e40af"
      />
      
      {/* Elegant Separator */}
      <line x1="110" y1="15" x2="110" y2="45" stroke="#e2e8f0" strokeWidth="2"/>
      
      {/* Modern Mail Icon */}
      <rect x="120" y="22" width="24" height="16" rx="3" stroke="#ef4444" strokeWidth="2" fill="none"/>
      <path d="M120 22 L132 32 L144 22" stroke="#ef4444" strokeWidth="2" fill="none"/>
      
      {/* Clean Typography */}
      <text x="150" y="32" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#1e40af">INDIA</text>
      <text x="150" y="45" fontFamily="Arial" fontSize="12" fill="#ef4444">POST</text>
    </svg>
  );
};

export const DKIconLogo = () => {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      {/* Minimal Circle */}
      <circle cx="25" cy="25" r="24" fill="#ffffff" stroke="#1e40af" strokeWidth="2"/>
      
      {/* Bold DK Monogram */}
      <path d="
        M12 12
        L12 38
        L22 38
        C30 38 33 32 33 25
        C33 18 30 12 22 12
        L12 12
        Z" 
        fill="#1e40af"
      />
      
      {/* Clear K Element */}
      <path d="
        M34 12
        L38 12
        L38 22
        L42 12
        L46 12
        L40 25
        L46 38
        L42 38
        L38 28
        L38 38
        L34 38
        Z" 
        fill="#1e40af"
      />
    </svg>
  );
};

export const DKTextLogo = () => {
  return (
    <svg width="300" height="60" viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg">
      {/* Clean Background */}
      <rect x="0" y="0" width="300" height="60" rx="8" fill="#ffffff"/>
      
      {/* Bold DeshKriti */}
      <path d="
        M20 15
        L20 45
        L35 45
        C50 45 55 37 55 30
        C55 23 50 15 35 15
        L20 15
        Z" 
        fill="#1e40af"
      />
      
      <path d="
        M60 15
        L70 15
        L70 27
        L85 15
        L97 15
        L77 30
        L97 45
        L85 45
        L70 33
        L70 45
        L60 45
        Z" 
        fill="#1e40af"
      />
      
      <text x="100" y="38" fontFamily="Arial" fontWeight="bold" fontSize="24" fill="#1e40af">eshKriti</text>
      
      {/* Minimal Separator */}
      <line x1="200" y1="15" x2="200" y2="45" stroke="#e2e8f0" strokeWidth="2"/>
      
      {/* Clean India Post */}
      <text x="220" y="30" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#1e40af">INDIA</text>
      <text x="220" y="45" fontFamily="Arial" fontSize="14" fill="#ef4444">POST</text>
    </svg>
  );
};

export const DKModernLogo = () => {
  return (
    <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
      {/* Subtle Background */}
      <rect x="0" y="0" width="200" height="60" rx="10" fill="#ffffff"/>
      
      {/* Bold DK */}
      <path d="
        M20 12
        L20 48
        L35 48
        C50 48 55 40 55 30
        C55 20 50 12 35 12
        L20 12
        Z" 
        fill="#1e40af"
      />
      
      <path d="
        M60 12
        L70 12
        L70 25
        L85 12
        L97 12
        L77 30
        L97 48
        L85 48
        L70 35
        L70 48
        L60 48
        Z" 
        fill="#1e40af"
      />
      
      {/* Minimal Mail Symbol */}
      <rect x="105" y="20" width="30" height="20" rx="3" stroke="#ef4444" strokeWidth="2" fill="none"/>
      <path d="M105 20 L120 35 L135 20" stroke="#ef4444" strokeWidth="2" fill="none"/>
      
      {/* Clean Typography */}
      <text x="145" y="32" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#1e40af">INDIA</text>
      <text x="145" y="45" fontFamily="Arial" fontSize="12" fill="#ef4444">POST</text>
    </svg>
  );
};