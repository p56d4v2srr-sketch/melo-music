'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

const RECHARGE_PACKAGES = [
  { amount: 50, price: 5, label: '体验套餐', badge: null },
  { amount: 100, price: 10, label: '基础套餐', badge: '推荐' },
  { amount: 300, price: 25, label: '进阶套餐', badge: '超值' },
  { amount: 600, price: 45, label: '专业套餐', badge: null },
  { amount: 1500, price: 100, label: '旗舰套餐', badge: '最划算' },
];

export default function RechargePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // 管理员联系方式（请替换为实际联系方式）
  const adminWechat = 'melo_music_admin';
  const adminEmail = 'admin@melomusic.com';

  const handleCopyWechat = () => {
    navigator.clipboard.writeText(adminWechat);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 pb-10 px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-4">请先登录</h1>
            <p className="text-muted-foreground mb-6">登录后即可充值积分</p>
            <Link href="/login">
              <Button className="gradient-gold-purple text-white">去登录</Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/studio">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">积分充值</h1>
              <p className="text-muted-foreground text-sm">选择套餐，联系管理员付款后加积分</p>
            </div>
          </div>

          {/* Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {RECHARGE_PACKAGES.map((pkg) => (
              <Card
                key={pkg.amount}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedPackage === pkg.amount
                    ? 'border-primary glow-gold'
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => setSelectedPackage(pkg.amount)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.label}</CardTitle>
                    {pkg.badge && (
                      <Badge className="gradient-gold-purple text-white text-xs">
                        {pkg.badge}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    <span className="text-3xl font-bold text-white">{pkg.amount}</span>
                    <span className="text-muted-foreground ml-1">积分</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">¥{pkg.price}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    约 ¥{(pkg.price / pkg.amount).toFixed(3)}/积分
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Info */}
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                充值流程
              </CardTitle>
              <CardDescription>
                请选择套餐后，通过以下方式联系管理员完成付款
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Steps */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full gradient-gold-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-white font-medium">选择套餐</p>
                    <p className="text-sm text-muted-foreground">点击上方卡片选择充值套餐</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full gradient-gold-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">扫码付款</p>
                    <p className="text-sm text-muted-foreground">
                      使用微信或支付宝扫描下方收款码
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full gradient-gold-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">联系管理员</p>
                    <p className="text-sm text-muted-foreground">
                      付款后添加管理员微信，发送付款截图和您的用户ID
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full gradient-gold-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="text-white font-medium">积分到账</p>
                    <p className="text-sm text-muted-foreground">
                      管理员确认后，积分将立即添加到您的账户
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mb-3">
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm text-muted-foreground">微信收款码</p>
                      <p className="text-xs text-muted-foreground mt-1">（图片待上传）</p>
                    </div>
                  </div>
                  <p className="text-sm text-white font-medium">微信支付</p>
                </div>
                <div className="text-center">
                  <div className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mb-3">
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">💳</div>
                      <p className="text-sm text-muted-foreground">支付宝收款码</p>
                      <p className="text-xs text-muted-foreground mt-1">（图片待上传）</p>
                    </div>
                  </div>
                  <p className="text-sm text-white font-medium">支付宝</p>
                </div>
              </div>

              {/* Admin Contact */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white font-medium mb-3">管理员联系方式</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">微信号：</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-white bg-black/30 px-2 py-1 rounded">
                        {adminWechat}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleCopyWechat}
                      >
                        {copied ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">邮箱：</span>
                    <code className="text-sm text-white bg-black/30 px-2 py-1 rounded">
                      {adminEmail}
                    </code>
                  </div>
                </div>
              </div>

              {/* Selected Package Info */}
              {selectedPackage && (
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <p className="text-white font-medium mb-2">已选择套餐</p>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {RECHARGE_PACKAGES.find(p => p.amount === selectedPackage)?.label}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      ¥{RECHARGE_PACKAGES.find(p => p.amount === selectedPackage)?.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    请扫描上方收款码付款，付款后添加管理员微信并发送付款截图
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
