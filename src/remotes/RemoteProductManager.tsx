import React from "react";
import RemoteModuleLoader from "../components/RemoteModuleLoader";

// @ts-ignore - Remote module
const ProductModule = React.lazy(() => import("productManager/App"));

export const RemoteProductManager: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <RemoteModuleLoader moduleName="Product Manager">
        <ProductModule />
      </RemoteModuleLoader>
    </div>
  );
};
