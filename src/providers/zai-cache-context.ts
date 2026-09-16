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
 * An opaque cache-provenance identifier separating Z.AI accounts. A bare
 * `ZAI_API_KEY` carries no other account identity, so a usable key is folded
 * into a domain-separated SHA-256 digest: two different keys never share a
 * snapshot, the same key keeps reusing its own, and a stored Pi/opencode
 * reading stays apart from both. Only this one-way digest is persisted; the
 * key itself is never stored, logged, or rendered.
 */
export function zaiCredentialContextId(): string {
  const envKey = usableLiteralSecret(process.env[ZAI_API_KEY_ENV]?.trim());
  return createHash("sha256")
    .update(
      JSON.stringify(
        envKey === undefined
          ? ["zai-credential-v2", "stored"]
          : ["zai-credential-v2", "env-key", envKey],
      ),
    )
    .digest("hex");
}
