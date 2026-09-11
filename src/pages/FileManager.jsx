import { useEffect, useMemo, useRef, useState } from 'react'
import {
    File,
    FileImage,
    FileText,
    FolderOpen,
    Search,
    Trash2,
    Upload,
} from 'lucide-react'

const STORAGE_KEY = 'medicare-plus-files'

const formatSize = (bytes) => {
    if (!bytes) return '0 KB'
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileIcon = (type) => {
    if (type.startsWith('image/')) return FileImage
    if (type.includes('pdf') || type.startsWith('text/')) return FileText
    return File
}

export default function FileManager() {
    const [files, setFiles] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        } catch {
            return []
        }
    })
    const [search, setSearch] = useState('')
    const inputRef = useRef(null)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
    }, [files])

    const visibleFiles = useMemo(() => {
        const query = search.trim().toLowerCase()
        return query
            ? files.filter((file) => file.name.toLowerCase().includes(query))
            : files
    }, [files, search])

    const handleUpload = (event) => {
        const selectedFiles = Array.from(event.target.files || [])
        const additions = selectedFiles.map((file) => ({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size,
            addedAt: new Date().toISOString(),
        }))

        setFiles((currentFiles) => [...additions, ...currentFiles])
        event.target.value = ''
    }

    const removeFile = (id) => {
        setFiles((currentFiles) => currentFiles.filter((file) => file.id !== id))
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-pharmacy-50/40 to-white py-10 sm:py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 text-pharmacy-700 mb-2">
                            <FolderOpen className="w-6 h-6" />
                            <span className="text-sm font-semibold uppercase tracking-wide">My Files</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Your health documents</h1>
                        <p className="mt-2 text-gray-600">Keep prescriptions and medical documents close at hand.</p>
                    </div>

                    <>
                        <input
                            ref={inputRef}
                            type="file"
                            multiple
                            onChange={handleUpload}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-pharmacy-600 px-5 py-3 font-semibold text-white shadow-lg shadow-pharmacy-600/20 transition hover:bg-pharmacy-700"
                        >
                            <Upload className="w-5 h-5" />
                            Upload files
                        </button>
                    </>
                </div>

                <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search your files"
                        className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    />
                </div>

                {visibleFiles.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                        <FolderOpen className="mx-auto mb-4 h-12 w-12 text-pharmacy-300" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            {search ? 'No matching files' : 'Your file manager is empty'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            {search ? 'Try a different search term.' : 'Upload prescriptions, reports, or other health documents to get started.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="hidden grid-cols-[1fr_120px_150px_52px] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:grid">
                            <span>Name</span>
                            <span>Size</span>
                            <span>Added</span>
                            <span />
                        </div>
                        {visibleFiles.map((file) => {
                            const Icon = getFileIcon(file.type)
                            return (
                                <div key={file.id} className="grid gap-3 border-b border-gray-100 px-5 py-4 last:border-b-0 sm:grid-cols-[1fr_120px_150px_52px] sm:items-center sm:gap-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pharmacy-50 text-pharmacy-600">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="truncate text-sm font-medium text-gray-800">{file.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{formatSize(file.size)}</span>
                                    <span className="text-sm text-gray-500">{new Date(file.addedAt).toLocaleDateString()}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(file.id)}
                                        title={`Delete ${file.name}`}
                                        className="justify-self-start rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 sm:justify-self-end"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}

                <p className="mt-4 text-xs text-gray-500">Files are stored locally in this browser. Connect Supabase Storage for account-wide access.</p>
            </div>
        </main>
    )
}