'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { VoiceUpload, type VoiceFile } from '@/components/voice-upload';
import { Mic2, Info } from 'lucide-react';

export default function VoicesPage() {
  const [uploadedVoices, setUploadedVoices] = useState<VoiceFile[]>([]);

  const handleVoiceUpload = (voice: VoiceFile) => {
    setUploadedVoices([...uploadedVoices, voice]);
  };

  const handleVoiceRemove = (id: string) => {
    setUploadedVoices(uploadedVoices.filter((v) => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">我的音色</h1>
          <p className="text-muted-foreground">
            管理你的音色库，上传参考音频用于音色克隆
          </p>
        </div>

        {/* Info Card */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">关于音色克隆</h3>
              <p className="text-sm text-muted-foreground">
                音色克隆功能通过 Suno v4 自定义人声或 ElevenLabs API 实现。
                上传的音频将用于提取声音特征，生成具有相似音色的音乐作品。
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• 支持 wav/mp3 格式</li>
                <li>• 音频时长最长 60 秒</li>
                <li>• 建议使用清晰、无背景音乐的人声录音</li>
                <li>• 音质越好，克隆效果越准确</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Voice Upload */}
        <VoiceUpload
          uploadedVoices={uploadedVoices}
          onUpload={handleVoiceUpload}
          onRemove={handleVoiceRemove}
        />

        {/* API Status */}
        <div className="glass-card p-4 mt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-primary" />
            API 状态
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm">Suno v4 自定义人声</span>
              <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full">
                待配置
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm">ElevenLabs API</span>
              <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full">
                待配置
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            💡 请在设置页面配置 API 密钥以启用音色克隆功能
          </p>
        </div>
      </main>
    </div>
  );
}
