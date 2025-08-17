# Product Dashboard (Host App)

A microfrontend host application built with React, Vite, and TypeScript that displays live product metrics and integrates the Product Manager remote app.

## Features

- **Live Metrics Dashboard**: Real-time cards showing total, active, and inactive product counts
- **Remote Module Integration**: Seamlessly loads and displays the Product Manager microfrontend
- **Automatic Updates**: Metrics update instantly when products are added or status changes
- **Error Handling**: Graceful fallbacks when remote modules are unavailable
- **Responsive Design**: Modern, mobile-friendly interface

## Architecture

### Microfrontend Configuration
- **Host Name**: `dashboard`
- **Port**: 4000
- **Remote Apps**:
  - `productManager`: http://localhost:4001/assets/remoteEntry.js

### State Communication
The dashboard communicates with the remote app through:
- **Custom DOM Events**: Listens for events dispatched by the Product Manager
- **Event-Driven Updates**: Real-time metrics updates via custom events
- **Request-Response Pattern**: Can request current metrics from the remote app

### Technical Decisions

1. **Custom Events Communication**: Used DOM custom events for decoupled communication between microfrontends without shared state dependencies.

2. **Lazy Loading**: Remote modules are loaded on-demand using React.lazy() to improve initial load performance.

3. **Fallback UI**: Comprehensive loading and error states to handle network issues or remote app unavailability.

4. **Event Namespacing**: Events follow `{repo-name}:{event-name}` pattern for clear separation and avoiding conflicts.

5. **Module Federation**: Uses Vite's federation plugin for seamless microfrontend integration.

## Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn
- Product Manager app running (default port 4001)

### Installation

1. Navigate to the dashboard directory:
   ```bash
   cd sx-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file to customize ports:
   ```bash
   # .env file
   PORT=4000
   REMOTE_PORT=4001
   ```

4. Ensure the Product Manager is running:
   ```bash
   # In another terminal, from the sx-product-manager directory
   npm run dev
   ```

5. Start the dashboard:
   ```bash
   npm run dev
   ```

6. Open http://localhost:4000 to view the dashboard (or your custom PORT)

### Production Build

```bash
npm run build
npm run preview
```

## Usage

### Running Both Apps

1. **Start Product Manager** (Terminal 1):
   ```bash
   cd sx-product-manager
   npm install
   npm run dev
   ```

2. **Start Dashboard** (Terminal 2):
   ```bash
   cd sx-dashboard
   npm install
   npm run dev
   ```

3. **Use the Application**:
   - Open http://localhost:4000 for the main dashboard
   - Add products using the form in the Product Manager section
   - Watch the metrics update automatically in real-time
   - Toggle product status to see immediate metric changes

### Features Demo

1. **Real-time Metrics**: Add a few products and observe the "Total Products" count increase
2. **Status Updates**: Toggle products between active/inactive and watch the respective metric cards update
3. **Responsive Design**: Resize the window to see the adaptive layout
4. **Error Handling**: Stop the Product Manager app to see the error state

## Environment Variables

The dashboard supports the following environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Port for the dashboard development server |
| `REMOTE_PORT` | `4001` | Port where the Product Manager remote is running |

Create a `.env` file in the root directory to customize these values:

```bash
# .env
PORT=4000
REMOTE_PORT=4001
```

## Development

### File Structure
```
src/
├── components/              # React components
│   ├── Dashboard.tsx        # Main metrics dashboard
│   ├── MetricCard.tsx      # Individual metric display
│   └── RemoteProductManager.tsx # Remote app wrapper
├── hooks/                  # Custom React hooks
│   └── useProductMetrics.ts # Metrics subscription logic
├── types/                  # TypeScript definitions
│   └── index.ts
├── App.tsx                 # Main application
└── main.tsx               # Entry point
```

### Key Components

#### Dashboard
- Displays three metric cards (total, active, inactive)
- Handles loading and error states
- Updates automatically via store subscription

#### MetricCard
- Reusable component for displaying metrics
- Includes icons and color coding
- Responsive design with hover effects

#### RemoteProductManager
- Wrapper for the remote Product Manager module
- Handles lazy loading with suspense
- Provides fallback UI during loading

### Customization

#### Adding New Metrics
1. Update the `Metrics` interface in `types/index.ts`
2. Modify `useProductMetrics` hook to fetch new data
3. Add new MetricCard components in `Dashboard.tsx`

#### Styling
- Inline styles are used for simplicity
- Easy to migrate to CSS modules or styled-components
- Design system uses consistent spacing and colors

## Troubleshooting

### Common Issues

1. **"Product Manager not responding"**
   - Ensure Product Manager is running on port 4001
   - Check browser console for event-related errors
   - Verify the remote module is loaded successfully

2. **Remote module loading failed**
   - Confirm the Product Manager build includes Module Federation
   - Check the remote URL in `vite.config.ts`
   - Ensure CORS is properly configured

3. **Metrics not updating**
   - Verify custom events are being dispatched and received
   - Check browser console for JavaScript errors
   - Ensure event listeners are properly attached

### Port Configuration

If you need to change ports, update:

**Dashboard (vite.config.ts)**:
```typescript
server: {
  port: YOUR_PORT
}
```

**Remote URL (vite.config.ts)**:
```typescript
remotes: {
  productManager: 'http://localhost:YOUR_REMOTE_PORT/assets/remoteEntry.js',
}
```

### Performance

- Remote modules are cached after first load
- Metrics updates are throttled to prevent excessive re-renders
- Bundle size is optimized through Module Federation's shared dependencies

## Production Deployment

1. Build both applications:
   ```bash
   # Product Manager
   cd sx-product-manager && npm run build
   
   # Dashboard
   cd sx-dashboard && npm run build
   ```

2. Deploy to your hosting platform
3. Update remote URLs in production configuration
4. Ensure proper CORS headers for cross-origin module loading
