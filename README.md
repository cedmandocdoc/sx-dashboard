# Product Dashboard (Host App)

A microfrontend host application that displays real-time product metrics and integrates the Product Manager remote application.

## Setup

### Prerequisites

- Node.js >= 22.14.0 (use `nvm use` if you have nvm installed)
- npm or yarn
- Product Manager app running (remote microfrontend)

### Environment

Create a `.env` file in the root directory with the following variables:

```bash
# Dashboard port
VITE_PORT=4000

# Product Manager remote host URL
VITE_REMOTE_PRODUCT_MANAGER_HOST=http://localhost:4001
```

**Environment Variables:**
- `VITE_PORT` - Port for the dashboard development server (default: 4000)
- `VITE_REMOTE_PRODUCT_MANAGER_HOST` - Full URL where Product Manager is running (default: http://localhost:4001)

### Running

1. **Start Product Manager first** (in another terminal):
   ```bash
   cd sx-product-manager
   npm install
   npm run dev
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the dashboard:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open http://localhost:4000 (or your custom VITE_PORT)

## Architecture

### Module Federation
This application uses **Module Federation** from Vite to dynamically load remote microfrontends. The Product Manager is loaded as a remote application at runtime, enabling independent development and deployment.

### State Communication
The dashboard communicates with remote applications using **Custom DOM Events**:

- **Event Listening**: The host app listens for custom events dispatched by remote applications
- **Real-time Updates**: Metrics are updated automatically when events are received
- **Decoupled Architecture**: No direct state sharing between applications

### Custom Event Pattern
Events follow the pattern: `{remote-app-name}:{event-name}`

**Listened Events:**
- `sx-product-manager:product-added` - When a new product is created
- `sx-product-manager:product-status-toggled` - When product status changes

### Remote Module Loading
The application uses **RemoteLoader** component for proper handling of remote microfrontend loading:

- **Error Boundaries**: Graceful error handling when remote apps fail to load
- **Loading States**: User-friendly loading indicators
- **Retry Mechanism**: Ability to retry failed remote connections
- **Lazy Loading**: Remote modules are loaded on-demand using React.lazy()

### Application Structure
```
src/
├── components/
│   ├── Dashboard.tsx              # Main metrics dashboard
│   ├── MetricCard.tsx            # Individual metric display
│   └── RemoteModuleLoader.tsx    # Remote app loading with error handling
├── hooks/
│   └── useProductMetrics.ts      # Custom hook for metrics state management
├── types/
│   └── index.ts                  # TypeScript type definitions
└── remotes/
    └── RemoteProductManager.tsx  # Product Manager remote integration
```

### Key Features
- **Live Metrics**: Real-time product statistics (total, active, inactive)
- **Microfrontend Integration**: Seamless loading of remote Product Manager
- **Error Resilience**: Continues working even if remote apps fail
- **Responsive Design**: Modern, mobile-friendly interface