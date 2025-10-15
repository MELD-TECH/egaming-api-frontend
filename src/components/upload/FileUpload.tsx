import React, { useCallback, useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import {UploadResponse} from "../../lib/models.ts";
import {ApiResponse} from "../../lib/httpClient.ts";

// export type FileUploadResult = { url: string };
export type FileUploadResult = ApiResponse<UploadResponse>;

export type FileUploadProps = {
    label?: string;
    description?: string;
    accept?: string; // e.g. 'image/*'
    maxSizeBytes?: number; // e.g. 2 * 1024 * 1024
    disabled?: boolean;
    value?: string | null; // existing file URL (for preview)
    circularPreview?: boolean; // for avatars
    onChange?: (url: string | null) => void;
    uploader: (file: File, onProgress?: (pct: number) => void) => Promise<FileUploadResult>;
    className?: string;
};

export const FileUpload: React.FC<FileUploadProps> = ({
                                                          label = 'Upload',
                                                          description,
                                                          accept = 'image/*',
                                                          maxSizeBytes = 2 * 1024 * 1024,
                                                          disabled,
                                                          // value,
                                                          // circularPreview,
                                                          onChange,
                                                          uploader,
                                                          className,
                                                      }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const validate = useCallback((file: File): string | null => {
        if (file.size > maxSizeBytes) return `File is too large. Max ${(maxSizeBytes / (1024 * 1024)).toFixed(1)}MB.`;
        if (accept && accept !== '*' && !matchesAccept(file, accept)) return 'Unsupported file type.';
        return null;
    }, [maxSizeBytes, accept]);

    const trigger = () => !disabled && inputRef.current?.click();

    const handleFiles = async (files: FileList | null) => {
        if (!files || !files[0]) return;
        const file = files[0];
        const message = validate(file);
        if (message) {
            setError(message);
            return;
        }
        setError(null);
        setBusy(true);
        setProgress(0);
        try {
            const result = await uploader(file, (pct) => setProgress(pct));
            const uploadResp = result?.data;
            setProgress(null);
            setBusy(false);
            onChange?.(uploadResp?.data?.resourceUrl);
        } catch (e: any) {
            setBusy(false);
            setProgress(null);
            setError(e?.message || 'Upload failed. Please try again.');
        }
    };

    const onDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        await handleFiles(e.dataTransfer.files);
    };

    return (
        <div className={className}>
            {label && <div className="text-sm font-semibold text-gray-80 mb-1">{label}</div>}
            {description && <div className="text-xs text-gray-60 mb-2">{description}</div>}

            <div
                role="button"
                tabIndex={0}
                aria-disabled={disabled}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') trigger(); }}
                onClick={trigger}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={[
                    'flex items-center justify-center border rounded-lg px-3 py-6 bg-gray-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500',
                    dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-30',
                    disabled ? 'opacity-60 cursor-not-allowed' : '',
                ].join(' ')}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                    aria-hidden
                    disabled={disabled}
                />

                <div className="flex flex-col items-center gap-2">
                    {busy ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                    ) : (
                        <Upload className="h-5 w-5 text-gray-500" />
                    )}
                    <div className="text-xs text-gray-70">
                        {busy ? 'Uploading...' : 'Drag & drop or click to select a file'}
                    </div>
                    {progress !== null && (
                        <div className="w-40 bg-gray-200 rounded h-1 mt-2">
                            <div className="bg-primary-600 h-1 rounded" style={{ width: `${progress}%` }} />
                        </div>
                    )}
                </div>
            </div>

            {error && <div className="text-xs text-red-600 mt-2">{error}</div>}

        </div>
    );
};

function matchesAccept(file: File, accept: string): boolean {
    if (!accept || accept === '*') return true;
    const accepts = accept.split(',').map(s => s.trim());
    const mime = file.type.toLowerCase();
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    return accepts.some((rule) => {
        if (rule.endsWith('/*')) {
            const base = rule.slice(0, -2);
            return mime.startsWith(base);
        }
        if (rule.startsWith('.')) return ext === rule;
        return mime === rule;
    });
}