import React, { useContext } from 'react';
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

const AppContent = () => {
  const { activeSection } = useContext(ShopContext);

  const renderSection = () => {
    switch (activeSection) {
      case 'Home':
        return <HomePage />;
      case 'Books':
        return <BooksPage />;
      case 'Dress':
        return <DressPage />;
      case 'Personal Coaches':
      case 'Personal coatches':
      case 'Extra ciriculam activity':
        return <ExtraCurricularPage />;
      case 'Sports':
        return <SportsPage />;
      case 'Stationary':
        return <StationaryPage />;
      case 'Orders':
        return <OrdersPage />;
      case 'Contact':
        return <ContactPage />;
      case 'Admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div key={activeSection} className="page-transition-wrapper">
        {renderSection()}
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
