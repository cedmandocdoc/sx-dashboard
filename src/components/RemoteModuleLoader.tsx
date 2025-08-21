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
        <div className="flex flex-col justify-center items-center min-h-[400px] bg-gray-50 p-6 text-center" data-testid="remote-module-error">
          <div className="mb-6 text-5xl">
            ⚠️
          </div>
          <div className="text-xl font-semibold text-red-600 mb-2">
            Failed to Load Remote Module: {this.props.moduleName}
          </div>
          <div className="text-sm text-gray-500 mb-6 leading-relaxed">
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
          <div className="flex justify-center items-center min-h-[400px] bg-gray-50" data-testid="remote-module-loading">
            <div className="text-center">
              <div className="mb-4 text-3xl animate-spin">
                ⏳
              </div>
              <div className="text-lg text-gray-500 mb-2">
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
