import React from "react";
import RemoteModuleLoader from "../components/RemoteModuleLoader";

// @ts-ignore - Remote module
const ProductModule = React.lazy(() => import("productManager/App"));

export const RemoteProductManager: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e9ecef",
        overflow: "hidden",
      }}
    >
      <RemoteModuleLoader moduleName="Product Manager">
        <ProductModule />
      </RemoteModuleLoader>
    </div>
  );
};
