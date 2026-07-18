-- Migration: Add model_version and provider columns to songs table
-- Date: 2025-01-XX
-- Description: V5.0 Suno 多版本选择改造 - 记录每首歌曲使用的模型版本和 provider

-- Add model_version column (records which Suno version was used)
ALTER TABLE songs ADD COLUMN IF NOT EXISTS model_version VARCHAR(16) DEFAULT 'v5';

-- Add provider column (records which provider was used, e.g., 'acedata', 'demo')
ALTER TABLE songs ADD COLUMN IF NOT EXISTS provider VARCHAR(32) DEFAULT 'acedata';

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS songs_model_version_idx ON songs(model_version);
CREATE INDEX IF NOT EXISTS songs_provider_idx ON songs(provider);

-- Add comments for documentation
COMMENT ON COLUMN songs.model_version IS 'Suno model version used for generation: v5-5, v5, v4-5-plus, v4-5, v4';
COMMENT ON COLUMN songs.provider IS 'Music generation provider: acedata, demo, etc.';
