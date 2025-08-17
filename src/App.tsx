import { Dashboard } from './components/Dashboard';
import { RemoteProductManager } from './remotes/RemoteProductManager';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Product Dashboard
          </h1>
          <p className="text-gray-500 text-base">
            Real-time metrics and product management
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto pb-12">
        {/* Metrics Section */}
        <section className="mb-12">
          <div className="px-6 mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">
              Live Metrics
            </h2>
            <p className="text-gray-500 text-sm">
              These metrics update automatically when products are added or modified
            </p>
          </div>
          <Dashboard />
        </section>

        <RemoteProductManager />
      </main>
    </div>
  );
}

export default App;
