import type { Asset } from "@/types/assets";
import ActionsMenu, { EditIcon, TrashIcon } from "@/components/ui/ActionsMenu";
import { formatDate } from "@/utils/functions";

interface Props {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AssetRow({ asset, onEdit, onDelete }: Props) {
  return (
    <tr className="grid grid-cols-14 gap-4 px-6 py-4 text-sm text-gray-700 dark:text-gray-300 transition-colors even:bg-gray-50 even:dark:bg-gray-800 odd:bg-white odd:dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-700">
      {/* Name */}
      <td className="font-semibold col-span-3 flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="truncate">{asset.name}</span>
      </td>

      {/* URL */}
      <td className="col-span-3 flex items-center min-w-0">
        <a
          href={asset.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:underline transition-colors truncate text-xs"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="truncate">{asset.url}</span>
        </a>
      </td>

      {/* Description */}
      <td className="col-span-3 flex items-center text-gray-500 dark:text-gray-400 text-xs min-w-0">
        <span className="truncate">{asset.description}</span>
      </td>

      {/* Client */}
      <td className="col-span-2 flex items-center min-w-0">
        {asset.client ? (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 truncate">
            {asset.client.name}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* Project */}
      <td className="col-span-2 flex items-center min-w-0">
        {asset.project ? (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 truncate">
            {asset.project.name}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="col-span-1 flex items-center justify-center">
        <ActionsMenu
          actions={[
            { label: "Edit", icon: <EditIcon />, onClick: onEdit },
            { label: "Delete", icon: <TrashIcon />, onClick: onDelete, variant: "danger" },
          ]}
        />
      </td>
    </tr>
  );
}
