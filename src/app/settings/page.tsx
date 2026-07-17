'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Settings as SettingsIcon, Key, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiConfig {
  sunoApiKey: string;
  deepseekApiKey: string;
  elevenlabsApiKey: string;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<ApiConfig>({
    sunoApiKey: '',
    deepseekApiKey: '',
    elevenlabsApiKey: '',
  });
  const [showKeys, setShowKeys] = useState({
    suno: false,
    deepseek: false,
    elevenlabs: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    localStorage.setItem('apiConfig', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleShowKey = (key: keyof typeof showKeys) => {
    setShowKeys({ ...showKeys, [key]: !showKeys[key] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">设置</h1>
          <p className="text-muted-foreground">配置 API 密钥和应用偏好</p>
        </div>

        {/* API Configuration */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            API 配置
          </h2>

          <div className="space-y-6">
            {/* Suno API Key */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Suno API Key
                <span className="text-xs text-muted-foreground ml-2">用于音乐生成</span>
              </label>
              <div className="relative">
                <input
                  type={showKeys.suno ? 'text' : 'password'}
                  value={config.sunoApiKey}
                  onChange={(e) => setConfig({ ...config, sunoApiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={() => toggleShowKey('suno')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKeys.suno ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                从 sunoapi.org 获取 API 密钥
              </p>
            </div>

            {/* DeepSeek API Key */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                DeepSeek API Key
                <span className="text-xs text-muted-foreground ml-2">用于歌词创作</span>
              </label>
              <div className="relative">
                <input
                  type={showKeys.deepseek ? 'text' : 'password'}
                  value={config.deepseekApiKey}
                  onChange={(e) => setConfig({ ...config, deepseekApiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={() => toggleShowKey('deepseek')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKeys.deepseek ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                从 platform.deepseek.com 获取 API 密钥
              </p>
            </div>

            {/* ElevenLabs API Key */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                ElevenLabs API Key
                <span className="text-xs text-muted-foreground ml-2">可选，用于音色克隆</span>
              </label>
              <div className="relative">
                <input
                  type={showKeys.elevenlabs ? 'text' : 'password'}
                  value={config.elevenlabsApiKey}
                  onChange={(e) => setConfig({ ...config, elevenlabsApiKey: e.target.value })}
                  placeholder="xi-..."
                  className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={() => toggleShowKey('elevenlabs')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKeys.elevenlabs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                从 elevenlabs.io 获取 API 密钥（可选）
              </p>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="mt-6 gradient-gold-purple hover:opacity-90 glow-gold"
          >
            <Save className="w-4 h-4 mr-2" />
            {saved ? '已保存' : '保存配置'}
          </Button>
        </div>

        {/* About */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            关于
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>版本</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>技术栈</span>
              <span>Next.js + TypeScript + Tailwind</span>
            </div>
            <div className="flex justify-between">
              <span>音乐 API</span>
              <span>Suno</span>
            </div>
            <div className="flex justify-between">
              <span>LLM</span>
              <span>DeepSeek</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
