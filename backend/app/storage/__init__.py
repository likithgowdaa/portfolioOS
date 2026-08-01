"""Storage layer: blobs, media and file-like assets.

Supabase Storage will back user uploads (images, CVs, assets) starting in a
later sprint. This package owns upload/download abstractions so services never
touch a storage provider directly.
"""
