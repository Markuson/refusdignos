/**
 * cloudinaryField — Custom Keystatic BasicFormField (Story 1.3)
 *
 * `@keystatic/core@0.5.51` has no `fields.custom()` export -- there is no
 * generic escape hatch for a hand-rolled field. To add a field that isn't one
 * of the library's built-ins, you construct an object literal matching the
 * `BasicFormField` shape directly (`kind: 'form'`, `defaultValue`/`parse`/
 * `serialize`/`validate`/`reader`/`Input`) and it slots into `ObjectField`'s
 * `fields` record like any built-in. This is that object, factory-wrapped so
 * `keystatic.config.ts` can configure `folder`/`required` per usage.
 *
 * It uploads a file directly from the browser to Cloudinary's UNSIGNED
 * upload REST API (plain `XMLHttpRequest`, no Cloudinary SDK/widget) and
 * stores ONLY the returned `public_id` string -- never a full URL, and the
 * image binary itself never touches the git repository. Rendering surfaces
 * build the display URL at render time from `public_id` (see
 * `src/content/config.ts`'s `cloudinaryId` schema and the three page
 * templates that construct `res.cloudinary.com` URLs).
 *
 * Uses a plain `<input type="file">` rather than Cloudinary's Upload Widget:
 * Keystatic wraps its admin UI in a React Aria FocusScope that swallows
 * pointer events for anything rendered outside its boundary, which the
 * widget's popup is -- a file input lives inside the form and has no such
 * conflict.
 *
 * USAGE (in keystatic.config.ts):
 *   import { cloudinaryField } from './src/components/admin/cloudinary-field';
 *   publicId: cloudinaryField({ folder: 'refugios', required: true }),
 *
 * ARCHITECTURE RULES:
 * - This component is ONLY used inside the /keystatic admin routes (React territory).
 * - It must NEVER be imported by any public Astro page or component.
 */

import React, { useCallback, useRef, useState } from 'react';
import { buildCloudinaryUrl } from '../../lib/cloudinary';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CloudinaryFieldOptions {
  label?: string;
  description?: string;
  /** Cloudinary folder to upload into, e.g. "refugios" */
  folder?: string;
  /** Accepted MIME types or extensions shown in the file picker. */
  formats?: string[];
  /** Max file size in bytes. Defaults to 15MB. */
  maxFileSize?: number;
  /** Whether the field is required. */
  required?: boolean;
}

// ---------------------------------------------------------------------------
// Helper: Reconstruct preview URL from public_id -- reuses the same URL
// builder the public rendering surfaces use (`src/lib/cloudinary.ts`), so
// there's exactly one place that knows the `res.cloudinary.com` URL shape.
// ---------------------------------------------------------------------------
function buildPreviewUrl(publicId: string): string {
  return buildCloudinaryUrl(publicId, 'w_400,f_auto,q_auto');
}

// ---------------------------------------------------------------------------
// Helper: parse a stored/read value into the field's `string | null` shape.
// Shared by `parse` and `reader.parse` below, which are otherwise identical
// (Keystatic calls `parse` when loading the form for editing and
// `reader.parse` when reading committed content elsewhere -- both need the
// exact same coercion, so there's no reason to maintain two copies).
// ---------------------------------------------------------------------------
function parsePublicId(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

// ---------------------------------------------------------------------------
// Helper: formats array → accept attribute string for <input type="file">
// e.g. ['gif','jpg','png'] → 'image/gif,image/jpeg,image/png'
// ---------------------------------------------------------------------------
const MIME_MAP: Record<string, string> = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  svg: 'image/svg+xml',
};

function formatsToAccept(formats: string[]): string {
  const mimes = [...new Set(formats.map((f) => MIME_MAP[f.toLowerCase()] ?? `image/${f}`))];
  return mimes.join(',');
}

// ---------------------------------------------------------------------------
// The React Input Component
// ---------------------------------------------------------------------------

interface UploadFieldInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
  autoFocus: boolean;
  forceValidation: boolean;
  label: string;
  description?: string;
  folder: string;
  formats: string[];
  maxFileSize: number;
  required: boolean;
}

function UploadFieldInput({
  value,
  onChange,
  label,
  description,
  folder,
  formats,
  maxFileSize,
  required,
  forceValidation,
}: UploadFieldInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    // Guard against a missing cloud name here too -- `buildCloudinaryUrl`
    // throws in that case, and a misconfigured `.env` shouldn't crash the
    // whole admin form; `handleFileChange` below surfaces that same
    // misconfiguration as an inline error message on upload attempt instead.
    return value && import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME ? buildPreviewUrl(value) : null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME as string | undefined;
  const uploadPreset = import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);

      // Client-side size guard
      if (file.size > maxFileSize) {
        setError(
          `El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo permitido: ${(maxFileSize / 1024 / 1024).toFixed(0)} MB.`,
        );
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (!cloudName || !uploadPreset) {
        setError(
          'Falta configuración de Cloudinary. Define PUBLIC_CLOUDINARY_CLOUD_NAME y PUBLIC_CLOUDINARY_UPLOAD_PRESET en tu .env.',
        );
        return;
      }

      setIsUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', folder);

        // Use XMLHttpRequest so we can track upload progress
        const result = await new Promise<{ public_id: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) {
              setProgress(Math.round((ev.loaded / ev.total) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              try {
                const body = JSON.parse(xhr.responseText);
                reject(new Error(body?.error?.message ?? `Error al subir la imagen (HTTP ${xhr.status})`));
              } catch {
                reject(new Error(`Error al subir la imagen (HTTP ${xhr.status})`));
              }
            }
          };

          xhr.onerror = () => reject(new Error('Error de red durante la subida.'));
          xhr.send(formData);
        });

        // Store only the public_id, never the full URL
        onChange(result.public_id);
        setPreviewUrl(buildPreviewUrl(result.public_id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al subir la imagen.');
      } finally {
        setIsUploading(false);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [cloudName, uploadPreset, folder, maxFileSize, onChange],
  );

  const triggerPicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const isInvalid = forceValidation && required && !value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'inherit' }}>
      <label style={{ fontSize: '14px', fontWeight: '600', color: isInvalid ? '#dc2626' : 'inherit' }}>
        {label}
        {required && (
          <span style={{ color: '#dc2626', marginLeft: '4px' }} aria-hidden="true">
            *
          </span>
        )}
      </label>

      {description && <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{description}</p>}

      {previewUrl && (
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '6px',
            overflow: 'hidden',
            maxWidth: '300px',
          }}
        >
          <img
            src={previewUrl}
            alt="Vista previa de Cloudinary"
            style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
            onError={() => setPreviewUrl(null)}
          />
          <div
            style={{
              padding: '4px 8px',
              background: 'rgba(0,0,0,0.7)',
              fontSize: '11px',
              color: '#eee',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
            }}
          >
            {value}
          </div>
        </div>
      )}

      {!previewUrl && (
        <div
          style={{
            border: `2px dashed ${isInvalid ? '#dc2626' : '#bbb'}`,
            borderRadius: '6px',
            padding: '24px',
            textAlign: 'center',
            color: '#666',
            fontSize: '13px',
          }}
        >
          Todavía no se ha subido ningún archivo
        </div>
      )}

      {isUploading && (
        <div style={{ width: '100%', background: '#eee', borderRadius: '4px', overflow: 'hidden', height: '6px' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#2563eb',
              transition: 'width 0.2s ease',
            }}
          />
        </div>
      )}

      {/* Hidden file input — lives inside the Keystatic FocusScope, so clicks work */}
      <input
        ref={fileInputRef}
        type="file"
        accept={formatsToAccept(formats)}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={triggerPicker}
          disabled={isUploading}
          style={{
            padding: '8px 16px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            opacity: isUploading ? 0.6 : 1,
          }}
        >
          {isUploading ? `Subiendo… ${progress}%` : value ? '↑ Reemplazar archivo' : '↑ Subir a Cloudinary'}
        </button>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: '12px', margin: 0 }}>{error}</p>}

      {isInvalid && <p style={{ color: '#dc2626', fontSize: '12px', margin: 0 }}>Este campo es obligatorio.</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BasicFormField factory — the public API used in keystatic.config.ts
// ---------------------------------------------------------------------------

/**
 * Creates a custom Keystatic field that uploads files directly to Cloudinary
 * via the unsigned upload REST API.
 *
 * The stored value is ONLY the Cloudinary `public_id` string. Full URLs are
 * never stored. Rendering surfaces construct display URLs at render time.
 */
export function cloudinaryField(options: CloudinaryFieldOptions = {}) {
  const {
    label = 'Imagen',
    description,
    folder = 'refugios',
    formats = ['gif', 'jpg', 'jpeg', 'png', 'webp'],
    maxFileSize = 15 * 1024 * 1024, // 15 MB default
    required = false,
  } = options;

  return {
    kind: 'form' as const,
    formKind: undefined,

    defaultValue(): string | null {
      return null;
    },

    parse: parsePublicId,

    serialize(value: string | null): { value: string | undefined } {
      // `FormFieldStoredValue` has no `null` member (only `undefined` means
      // "absent") -- an array field stores `undefined` as `null` in the YAML
      // itself, per the `BasicFormField.serialize` docs.
      return { value: value ?? undefined };
    },

    // Keystatic's own field convention (confirmed against this project's
    // built-in fields, e.g. `fields.text({validation: {isRequired: true}})`)
    // is to signal an invalid value by THROWING, not by returning a sentinel
    // -- there's no "error" slot in `ValidatedValue` to return instead. This
    // is the same contract `ignored()`/`text()`/etc. follow, and the behavior
    // is verified end-to-end: deleting a refugio's last image blocks Save
    // with an inline "Must have at least 1 item" message (array-level
    // `validation.length.min: 1` in keystatic.config.ts), and clearing a
    // single required image shows this field's own inline "obligatorio"
    // message via `isInvalid` in `UploadFieldInput` below. On success this
    // returns the value unchanged (there's nothing to narrow: required-and-
    // present is already just `string`, so `ValidatedValue` is the same
    // `string | null` as `ParsedValue`).
    validate(value: string | null): string | null {
      if (required && !value) {
        throw new Error(`${label} es obligatorio.`);
      }
      return value;
    },

    reader: {
      parse: parsePublicId,
    },

    Input(props: { value: string | null; onChange: (v: string | null) => void; autoFocus: boolean; forceValidation: boolean }) {
      return React.createElement(UploadFieldInput, {
        ...props,
        label,
        description,
        folder,
        formats,
        maxFileSize,
        required,
      });
    },

    label,
  };
}
