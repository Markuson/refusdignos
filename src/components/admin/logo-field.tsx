/**
 * logoField — Custom Keystatic BasicFormField (Story 2.1)
 *
 * `colaboradores.logo` is a deliberate exception to the Cloudinary-only
 * pattern `cloudinaryField` (Story 1.3) established for `refugios`: unlike
 * refugio images, colaborador logos are legitimately a mix of external URLs
 * (e.g. a sponsor's own CDN/SVG) and Cloudinary-hosted uploads, and both
 * shapes already coexist across the 13 existing `colaboradores/*.md` files
 * (see e.g. `bellota.md`'s external SVG URL vs. `afuera.md`'s local
 * `/logos/afuera.webp` path). Migrating everything to Cloudinary is out of
 * scope for this story, so this field supports BOTH input modes but always
 * collapses to ONE flat string on save -- never a `{discriminant, value}`
 * shape -- so `src/content/config.ts`'s `logo: z.string()` and
 * `colaboradores.astro`'s `<img src={logo}>` need zero changes.
 *
 * Like `cloudinaryField`, this is a hand-built `BasicFormField` object
 * (`@keystatic/core@0.5.51` has no `fields.custom()`). It intentionally does
 * NOT reuse or modify `cloudinary-field.tsx` -- that component is proven in
 * production for refugios and stays untouched. This field only imports
 * `buildCloudinaryUrl` from `src/lib/cloudinary.ts` to resolve an uploaded
 * image's `public_id` to a full delivery URL *before* storing it (the same
 * "resolve to a display-ready value" idea, applied at save time instead of
 * render time) -- the stored value is a full `res.cloudinary.com` URL, not a
 * bare `public_id`, unlike `cloudinaryField`.
 *
 * USAGE (in keystatic.config.ts):
 *   import { logoField } from './src/components/admin/logo-field';
 *   logo: logoField({ folder: 'colaboradores', required: true }),
 *
 * ARCHITECTURE RULES:
 * - This component is ONLY used inside the /keystatic admin routes (React territory).
 * - It must NEVER be imported by any public Astro page or component.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { buildCloudinaryUrl } from '../../lib/cloudinary';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LogoFieldOptions {
  label?: string;
  description?: string;
  /** Cloudinary folder to upload into, e.g. "colaboradores" */
  folder?: string;
  /** Accepted MIME types or extensions shown in the file picker. */
  formats?: string[];
  /** Max file size in bytes. Defaults to 15MB. */
  maxFileSize?: number;
  /** Whether the field is required. */
  required?: boolean;
}

type Mode = 'url' | 'upload';

// ---------------------------------------------------------------------------
// Helper: parse a stored/read value into the field's `string | null` shape.
// Shared by `parse` and `reader.parse` below (same reasoning as
// `cloudinary-field.tsx`'s `parsePublicId`: both need identical coercion).
// ---------------------------------------------------------------------------
function parseLogo(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

// ---------------------------------------------------------------------------
// Helper: infer which mode to show for an existing value. A value already
// hosted on this project's configured Cloudinary cloud is unambiguously the
// result of a prior upload through this same field, so it's reopened in
// upload mode (with a live preview); everything else -- an external URL like
// `bellota.md`'s SVG, or a legacy local path like `/logos/afuera.webp` --
// opens in URL mode, showing the raw string in the text input so the editor
// sees exactly what's stored.
// ---------------------------------------------------------------------------
function inferInitialMode(value: string | null): Mode {
  const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME as string | undefined;
  if (value && cloudName && value.startsWith(`https://res.cloudinary.com/${cloudName}/`)) {
    return 'upload';
  }
  return 'url';
}

// ---------------------------------------------------------------------------
// Helper: formats array → accept attribute string for <input type="file">
// e.g. ['gif','jpg','png'] → 'image/gif,image/jpeg,image/png'
// (identical to `cloudinary-field.tsx`'s helper of the same shape)
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

interface LogoFieldInputProps {
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

function LogoFieldInput({
  value,
  onChange,
  autoFocus,
  label,
  description,
  folder,
  formats,
  maxFileSize,
  required,
  forceValidation,
}: LogoFieldInputProps) {
  const [mode, setMode] = useState<Mode>(() => inferInitialMode(value));
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState<string>(() => value ?? '');
  const [urlFormatInvalid, setUrlFormatInvalid] = useState(false);
  const [previewLoadError, setPreviewLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const uploadTriggerRef = useRef<HTMLButtonElement>(null);

  // Focus the currently-visible primary input on mount when Keystatic asks
  // this field to autofocus (e.g. it's a newly-added field in the form).
  // Runs once, against whichever mode `inferInitialMode` picked at mount.
  useEffect(() => {
    if (!autoFocus) return;
    if (mode === 'url') {
      urlInputRef.current?.focus();
    } else {
      uploadTriggerRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset the "preview failed to load" flag whenever the stored value
  // changes (a fresh upload, or the editor typing a new URL) so a stale
  // error doesn't linger over an unrelated value.
  useEffect(() => {
    setPreviewLoadError(false);
  }, [value]);

  const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME as string | undefined;
  const uploadPreset = import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  // Switching modes doesn't clear the stored value by itself -- the value
  // only changes once the editor types a URL or completes an upload (see
  // "Switch mode on existing entry" in the spec's I/O matrix: the previous
  // value is fully replaced only once the new mode's stored string is
  // provided, not merely by toggling the radio).
  const handleModeChange = useCallback(
    (nextMode: Mode) => {
      setMode(nextMode);
      setError(null);
      if (nextMode === 'url') {
        setUrlDraft(value ?? '');
        setUrlFormatInvalid(false);
      }
    },
    [value],
  );

  // Accepts free typing in `urlDraft` (so the input never appears to eat
  // keystrokes), but only propagates to the field's stored value once the
  // trimmed text is either empty (-> null) or matches the accepted format
  // (http://, https://, or a local path starting with "/"). Anything else
  // is flagged inline via `urlFormatInvalid` and left unstored.
  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setUrlDraft(raw);
      const trimmed = raw.trim();

      if (trimmed.length === 0) {
        setUrlFormatInvalid(false);
        onChange(null);
        return;
      }

      const hasValidFormat =
        trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/');

      if (!hasValidFormat) {
        setUrlFormatInvalid(true);
        return;
      }

      setUrlFormatInvalid(false);
      onChange(trimmed);
    },
    [onChange],
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);

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
              try {
                const parsed = JSON.parse(xhr.responseText);
                if (!parsed || typeof parsed.public_id !== 'string' || parsed.public_id.length === 0) {
                  reject(new Error('Respuesta inesperada de Cloudinary: falta "public_id".'));
                  return;
                }
                resolve(parsed);
              } catch {
                reject(new Error('No se pudo interpretar la respuesta de Cloudinary.'));
              }
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

        // Store the fully-resolved delivery URL, NOT the bare public_id --
        // this is what keeps `logo` a plain string identical in shape to the
        // existing external-URL entries, unlike `cloudinaryField`'s
        // `refugios.imagenes[].publicId`.
        onChange(buildCloudinaryUrl(result.public_id, 'f_auto,q_auto'));
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

  const toggleButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    borderRadius: '4px',
    border: active ? '1px solid #2563eb' : '1px solid #ccc',
    background: active ? '#2563eb' : '#fff',
    color: active ? '#fff' : '#333',
    fontSize: '12px',
    fontWeight: 600,
    cursor: isUploading ? 'not-allowed' : 'pointer',
    opacity: isUploading ? 0.6 : 1,
  });

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

      <div style={{ display: 'flex', gap: '8px' }} role="radiogroup" aria-label="Origen del logo">
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'url'}
          onClick={() => handleModeChange('url')}
          disabled={isUploading}
          style={toggleButtonStyle(mode === 'url')}
        >
          URL externa
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'upload'}
          onClick={() => handleModeChange('upload')}
          disabled={isUploading}
          style={toggleButtonStyle(mode === 'upload')}
        >
          Subir a Cloudinary
        </button>
      </div>

      {mode === 'url' && (
        <>
          <input
            ref={urlInputRef}
            type="text"
            value={urlDraft}
            onChange={handleUrlChange}
            placeholder="https://ejemplo.com/logo.png"
            style={{
              padding: '8px 10px',
              border: `1px solid ${isInvalid || urlFormatInvalid ? '#dc2626' : '#ccc'}`,
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'inherit',
            }}
          />
          {urlFormatInvalid && (
            <p style={{ color: '#dc2626', fontSize: '12px', margin: 0 }}>
              Debe ser una URL (http/https) o una ruta local que empiece por /
            </p>
          )}
        </>
      )}

      {mode === 'upload' && (
        <>
          {value && (
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '6px',
                overflow: 'hidden',
                maxWidth: '300px',
              }}
            >
              {!previewLoadError && (
                <img
                  src={value}
                  alt="Vista previa del logo"
                  style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }}
                  onError={() => setPreviewLoadError(true)}
                />
              )}
              {previewLoadError && (
                <p style={{ margin: 0, padding: '12px', fontSize: '12px', color: '#dc2626' }}>
                  No se pudo cargar la vista previa.
                </p>
              )}
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

          {!value && (
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
              ref={uploadTriggerRef}
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
        </>
      )}

      {error && <p style={{ color: '#dc2626', fontSize: '12px', margin: 0 }}>{error}</p>}

      {isInvalid && <p style={{ color: '#dc2626', fontSize: '12px', margin: 0 }}>Este campo es obligatorio.</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BasicFormField factory — the public API used in keystatic.config.ts
// ---------------------------------------------------------------------------

/**
 * Creates a custom Keystatic field for `colaboradores.logo`: a dual-mode
 * (URL text input OR Cloudinary upload) field that always stores one flat
 * string -- an external URL exactly as typed, or a full `res.cloudinary.com`
 * delivery URL resolved via `buildCloudinaryUrl()` right after upload.
 */
export function logoField(options: LogoFieldOptions = {}) {
  const {
    label = 'Logo',
    description,
    folder = 'colaboradores',
    formats = ['gif', 'jpg', 'jpeg', 'png', 'webp', 'svg'],
    maxFileSize = 15 * 1024 * 1024, // 15 MB default
    required = false,
  } = options;

  return {
    kind: 'form' as const,
    formKind: undefined,

    defaultValue(): string | null {
      return null;
    },

    parse: parseLogo,

    serialize(value: string | null): { value: string | undefined } {
      // Same `FormFieldStoredValue` contract as `cloudinaryField.serialize`:
      // no `null` member, only `undefined` means "absent".
      return { value: value ?? undefined };
    },

    // Same "throw on invalid" contract as `cloudinaryField.validate` -- see
    // that file's comment for the full reasoning; the behavior is verified
    // end-to-end the same way (clearing a required logo blocks Save with an
    // inline "obligatorio" message via `isInvalid` in `LogoFieldInput` above).
    validate(value: string | null): string | null {
      if (required && !value) {
        throw new Error(`${label} es obligatorio.`);
      }
      return value;
    },

    reader: {
      parse: parseLogo,
    },

    Input(props: { value: string | null; onChange: (v: string | null) => void; autoFocus: boolean; forceValidation: boolean }) {
      return React.createElement(LogoFieldInput, {
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
