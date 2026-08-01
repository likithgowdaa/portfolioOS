/**
 * Schema-driven form vocabulary.
 *
 * Every Studio editor is a schema: a list of sections (General / Content /
 * Media / Visibility / Metadata), each with typed fields. A single `EntityForm`
 * renders any schema, so all eight entities reuse one implementation.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "url"
  | "date"
  | "tags"
  | "boolean"
  | "select"
  | "number"
  | "file"
  | "image"
  | "images"
  | "repeatable";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldSchema {
  /** Property path in the data object; dot-notation for nested fields. */
  key: string;
  label: string;
  type: FieldType;
  /** Helper text shown under the input. */
  helper?: string;
  placeholder?: string;
  required?: boolean;
  /** textarea / markdown rows. */
  rows?: number;
  options?: SelectOption[];
  /** Accept hint for file/image inputs (e.g. ".png,.jpg"). */
  accept?: string;
  /** Number bounds for `number` fields. */
  min?: number;
  max?: number;
  /** Sub-fields for `repeatable` fields (object-array rows). */
  subFields?: FieldSchema[];
}

export interface FieldSection {
  id: string;
  title: string;
  description?: string;
  fields: FieldSchema[];
}

/** Read a (possibly dotted) path from a data object. */
export function getValue(data: Record<string, unknown>, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, data);
}

/** Write a (possibly dotted) path into a data object immutably. */
export function setValue(
  data: Record<string, unknown>,
  key: string,
  value: unknown
): Record<string, unknown> {
  const parts = key.split(".");
  const next = { ...data };
  let cursor = next;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
    const current = (cursor[part] ?? {}) as Record<string, unknown>;
    cursor[part] = { ...current };
    cursor = cursor[part] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
  return next;
}
