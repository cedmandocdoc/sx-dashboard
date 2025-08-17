import { Suspense } from "react";
import RemoteModuleErrorBoundary from "./RemoteModuleErrorBoundary";

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
                Loading {moduleName}...
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#868e96",
                }}
              >
                Fetching remote {moduleName} microfrontend
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
