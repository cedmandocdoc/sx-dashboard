# Product Dashboard (Host App)

A microfrontend host application that displays real-time product metrics and integrates the [Product Manager](https://github.com/cedmandocdoc/sx-product-manager) remote application.

## Setup

### Prerequisites

- Node.js >= 22.14.0 (use `nvm use` if you have nvm installed)
- npm
- Product Manager app running (remote microfrontend)

### Environment

Copy `.env.sample` to `.env` and configure the following variables:

- `VITE_PORT` - Port for the dashboard development server (default: 4000)
- `VITE_REMOTE_PRODUCT_MANAGER_HOST` - Full URL where Product Manager is running (default: http://localhost:4001)

### Running

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   npm start
   ```

3. **Access the application:**
   Open http://localhost:4000 (or your custom VITE_PORT)

**Full list of available script**
| Script    | Command             | Description                                                    |
|-----------|---------------------|----------------------------------------------------------------|
| `dev`     | `npm run dev`       | Start the development server with hot module replacement      |
| `start`   | `npm start`         | Run the application for production      |
| `build`   | `npm run build`     | Build the application for production deployment               |
| `preview` | `npm run preview`   | Preview the production build locally before deployment       |

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
