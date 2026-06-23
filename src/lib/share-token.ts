import { randomBytes } from "node:crypto";

/** 推測困難な共有トークン（tk_ + 128bit を base64url）を生成する。 */
export function generateShareToken(): string {
  return `tk_${randomBytes(16).toString("base64url")}`;
}
