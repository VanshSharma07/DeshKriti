import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const scrollPosition = document.body.scrollHeight * (1 / 8); // 1/5 de la hauteur totale
        window.scrollTo(0, scrollPosition); // Défiler à 20% de la hauteur totale
    }, [pathname]);

    return null;
};

export default ScrollToTop;
