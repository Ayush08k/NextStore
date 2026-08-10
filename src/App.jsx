import React, { useContext, useState, useEffect, useRef } from 'react';
import { ShopContext, ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

import { HomePage } from './pages/HomePage';
import { BooksPage } from './pages/BooksPage';
import { DressPage } from './pages/DressPage';
import { ExtraCurricularPage } from './pages/ExtraCurricularPage';
import { SportsPage } from './pages/SportsPage';
import { StationaryPage } from './pages/StationaryPage';
import { ContactPage } from './pages/ContactPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminPage } from './pages/AdminPage';

const sectionComponents = {
  Home: HomePage,
  Books: BooksPage,
  Dress: DressPage,
  'Personal Coaches': ExtraCurricularPage,
  'Personal coatches': ExtraCurricularPage,
  'Extra ciriculam activity': ExtraCurricularPage,
  Sports: SportsPage,
  Stationary: StationaryPage,
  Orders: OrdersPage,
  Contact: ContactPage,
  Admin: AdminPage,
};

const AppContent = () => {
  const { activeSection } = useContext(ShopContext);

  // Track which section is currently displayed vs the incoming one
  const [displayedSection, setDisplayedSection] = useState(activeSection);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'exit' | 'enter'
  const pendingSection = useRef(activeSection);

  useEffect(() => {
    if (activeSection === displayedSection) return;

    pendingSection.current = activeSection;
    setPhase('exit');

    const exitTimer = setTimeout(() => {
      setDisplayedSection(pendingSection.current);
      setPhase('enter');

      const enterTimer = setTimeout(() => {
        setPhase('idle');
      }, 420);

      return () => clearTimeout(enterTimer);
    }, 280);

    return () => clearTimeout(exitTimer);
  }, [activeSection]);

  const SectionComponent = sectionComponents[displayedSection] || HomePage;

  const animClass =
    phase === 'exit' ? 'page-exit' :
    phase === 'enter' ? 'page-enter' :
    'page-idle';

  return (
    <div className="app-shell">
      <Navbar />
      <div className={`page-transition-wrapper ${animClass}`}>
        <SectionComponent />
      </div>
      <CartDrawer />
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
};

export default App;
