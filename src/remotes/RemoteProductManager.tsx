import React from "react";
import RemoteModuleLoader from "../components/RemoteModuleLoader";

const ProductModule = React.lazy(() => import("productManager/App"));

export const RemoteProductManager: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden" data-testid="remote-module-container">
      <RemoteModuleLoader moduleName="Product Manager">
        <ProductModule />
      </RemoteModuleLoader>
    </div>
  );
};
