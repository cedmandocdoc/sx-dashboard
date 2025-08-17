import { Component, Suspense } from "react";

class RemoteModuleErrorBoundary extends Component<
  { children: React.ReactNode; moduleName: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; moduleName: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Remote module loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            backgroundColor: "#f8f9fa",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              fontSize: "48px",
            }}
          >
            ⚠️
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#dc3545",
              marginBottom: "8px",
            }}
          >
            Failed to Load Remote Module: {this.props.moduleName}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#6c757d",
              marginBottom: "24px",
              lineHeight: "1.4",
            }}
          >
            {this.state.error?.message}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

type RemoteModuleLoaderProps = {
  children: React.ReactNode;
  moduleName: string;
};

const RemoteModuleLoader = ({
  children,
  moduleName,
}: RemoteModuleLoaderProps) => {
  return (
    <RemoteModuleErrorBoundary moduleName={moduleName}>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  marginBottom: "16px",
                  fontSize: "32px",
                }}
              >
                ⏳
              </div>
              <div
                style={{
                  fontSize: "18px",
                  color: "#6c757d",
                  marginBottom: "8px",
                }}
              >
                Loading Remote Module: {moduleName}
              </div>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </RemoteModuleErrorBoundary>
  );
};

export default RemoteModuleLoader;
