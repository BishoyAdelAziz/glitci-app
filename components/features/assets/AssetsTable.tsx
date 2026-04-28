"use client";

import React from "react";

import type { Asset, GroupedAsset } from "@/types/assets";
import AssetRow from "./AssetRow";

interface Props {
  assets: GroupedAsset[];
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export default function AssetsTable({ assets, onEdit, onDelete }: Props) {
  if (!assets.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg mb-1">No assets found</h3>
        <p className="text-sm text-gray-500">Try adjusting your filters or add a new asset.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      <table className="w-full">
        {/* Header */}
        <thead>
          <tr className="hidden md:grid grid-cols-14 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
            <th className="col-span-3 text-left font-semibold">Name</th>
            <th className="col-span-3 text-left font-semibold">URL</th>
            <th className="col-span-3 text-left font-semibold">Description</th>
            <th className="col-span-2 text-left font-semibold">Client</th>
            <th className="col-span-2 text-left font-semibold">Project</th>
            <th className="col-span-1 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((group) => (
            <React.Fragment key={group.clientId}>
              {/* Group Header */}
              <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                <td colSpan={14} className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  Client: {group.clientName}
                </td>
              </tr>
              {group.assets.map((asset) => (
                <AssetRow
                  key={asset.id || asset._id}
                  asset={asset}
                  onEdit={() => onEdit(asset)}
                  onDelete={() => onDelete(asset)}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
