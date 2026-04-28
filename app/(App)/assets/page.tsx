"use client";

import { useState } from "react";
import AssetsPageHeader from "@/components/features/assets/AssetsPageHeader";
import AssetsTable from "@/components/features/assets/AssetsTable";
import CreateAssetModal from "@/components/features/assets/CreateAssetModal";
import EditAssetModal from "@/components/features/assets/EditAssetModal";
import DeleteAssetModal from "@/components/features/assets/DeleteAssetModal";
import useAssets from "@/hooks/useAssets";
import type { Asset } from "@/types/assets";

export default function AssetsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { assets, assetsIsPending, assetsIsError } = useAssets({});
  console.log(assets);
  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsEditOpen(true);
  };

  const handleDelete = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteOpen(true);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8">
      <AssetsPageHeader isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />

      {/* Loading */}
      {assetsIsPending && (
        <div className="flex items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
        </div>
      )}

      {/* Error */}
      {assetsIsError && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center text-red-600 dark:text-red-400 mt-4">
          Error loading assets. Please try again.
        </div>
      )}

      {/* Table */}
      {!assetsIsPending && !assetsIsError && (
        <div className="mt-6">
          <AssetsTable assets={assets} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      )}

      {/* Modals */}
      <CreateAssetModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {selectedAsset && (
        <>
          <EditAssetModal
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            asset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
          />
          <DeleteAssetModal
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
            asset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
          />
        </>
      )}
    </div>
  );
}
