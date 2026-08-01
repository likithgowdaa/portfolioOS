"use client";

import { Card, CardContent } from "@/components/ui/card";

import { FieldInput } from "./field-inputs";
import { getValue, setValue } from "./field";
import type { FieldSchema, FieldSection } from "./field";

interface EntityFormProps {
  sections: FieldSection[];
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

/**
 * Schema-driven form — renders every section and field of a schema against a
 * data object. Shared by all Studio editors so every form follows the same
 * layout (General / Content / Media / Visibility / Metadata).
 */
export function EntityForm({ sections, data, onChange }: EntityFormProps) {
  const update = (key: string, value: unknown) => onChange(setValue(data, key, value));

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardContent className="flex flex-col gap-4">
            <header className="flex flex-col gap-1">
              <h2 className="text-title font-semibold tracking-tight">{section.title}</h2>
              {section.description ? (
                <p className="text-caption text-muted-foreground">{section.description}</p>
              ) : null}
            </header>
            <div className="flex flex-col gap-4">
              {section.fields.map((field) => (
                <FieldRow
                  key={field.key}
                  field={field}
                  value={getValue(data, field.key)}
                  onChange={(value) => update(field.key, value)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = `field-${field.key.replace(/\./g, "-")}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {field.label}
        {field.required ? (
          <span aria-hidden className="text-destructive">
            *
          </span>
        ) : null}
      </label>
      <FieldInput id={id} field={field} value={value} onChange={onChange} />
      {field.helper ? <p className="text-caption text-muted-foreground">{field.helper}</p> : null}
    </div>
  );
}
