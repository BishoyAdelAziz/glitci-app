// ─── Asset Sub-Types ────────────────────────────────────────────────────────────

export interface AssetClient {
  id: string;
  name: string;
}

export interface AssetProject {
  id: string;
  name: string;
}

export interface AssetCreatedBy {
  id: string;
  name: string;
}

// ─── Asset Object ────────────────────────────────────────────────────────────────

export interface Asset {
  id: string;
  _id?: string;
  name: string;
  url: string;
  description: string;
  client?: AssetClient | null;
  project?: AssetProject | null;
  createdBy?: AssetCreatedBy;
  createdAt: string;
  updatedAt: string;
}

export interface GroupedAsset {
  clientId: string;
  clientName: string;
  assets: Asset[];
}

// ─── Query Params ────────────────────────────────────────────────────────────────

export interface AssetsQueryParams {
  client?: string;
  project?: string;

}

// ─── Response ───────────────────────────────────────────────────────────────────

export interface AssetsResponse {
  results: number;
  data: GroupedAsset[];
}

// ─── Create / Update Payloads ────────────────────────────────────────────────────

export interface CreateAssetPayload {
  name: string;
  url: string;
  description: string;
  client?: string;
  project?: string;
}

export type UpdateAssetPayload = Partial<CreateAssetPayload>;

// ─── Responses ───────────────────────────────────────────────────────────────────

export interface AssetResponse {
  message: string;
  data: Asset;
}

export interface DeleteAssetResponse {
  message: string;
}
