import { createHash } from "node:crypto";
import { usableLiteralSecret } from "../lib/secret.js";

/**
 * The environment credential the Z.AI SDK and the vendor coding plugins read
 * before any stored credential, so an explicit key here names the account a
 * session is actually billing. It is also the only source available when the
 * key is held in a secret manager and injected at run time rather than written
 * to a local auth file.
 */
export const ZAI_API_KEY_ENV = "ZAI_API_KEY";

/**
 * An opaque cache-provenance identifier separating readings taken while a
 * usable `ZAI_API_KEY` is supplied from readings of the stored Pi/opencode
 * credential, which may belong to a different account. It is a presence
 * marker, never any part of the key.
 */
export function zaiCredentialContextId(): string {
  const envSelected =
    usableLiteralSecret(process.env[ZAI_API_KEY_ENV]?.trim()) !== undefined;
  return createHash("sha256")
    .update(
      JSON.stringify(["zai-credential-v1", envSelected ? "env-key" : "stored"]),
    )
    .digest("hex");
}
