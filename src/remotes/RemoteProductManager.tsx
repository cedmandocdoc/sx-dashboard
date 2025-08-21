import React from "react";
import RemoteModuleLoader from "../components/RemoteModuleLoader";
import { TestId } from "../lib/TestId";

const ProductModule = React.lazy(() => import("productManager/App"));

export const RemoteProductManager: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden" data-testid={TestId.REMOTE_MODULE_CONTAINER}>
      <RemoteModuleLoader moduleName="Product Manager">
        <ProductModule />
      </RemoteModuleLoader>
    </div>
  );
};
