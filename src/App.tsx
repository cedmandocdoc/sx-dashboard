import { Dashboard } from './components/Dashboard';
import { RemoteProductManager } from './components/RemoteProductManager';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e9ecef',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '32px',
            fontWeight: '700',
            color: '#212529',
          }}>
            Product Dashboard
          </h1>
          <p style={{
            margin: 0,
            color: '#6c757d',
            fontSize: '16px',
          }}>
            Real-time metrics and product management
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '48px' }}>
        {/* Metrics Section */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ padding: '0 24px', marginBottom: '16px' }}>
            <h2 style={{
              margin: '32px 0 8px 0',
              fontSize: '24px',
              fontWeight: '600',
              color: '#212529',
            }}>
              Live Metrics
            </h2>
            <p style={{
              margin: 0,
              color: '#6c757d',
              fontSize: '14px',
            }}>
              These metrics update automatically when products are added or modified
            </p>
          </div>
          <Dashboard />
        </section>

        {/* Product Manager Section */}
        <section style={{ margin: '0 24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: '600',
              color: '#212529',
            }}>
              Product Manager
            </h2>
            <p style={{
              margin: 0,
              color: '#6c757d',
              fontSize: '14px',
            }}>
              Manage your product catalog (loaded as a microfrontend)
            </p>
          </div>
          <RemoteProductManager />
        </section>
      </main>
    </div>
  );
}

export default App;
