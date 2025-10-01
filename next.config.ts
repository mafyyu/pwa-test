import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: false, // 手動で登録するため無効化
  skipWaiting: true,
  disable: false, // PWA機能は有効
  sw: 'sw.js', // カスタムService Workerを使用
  publicExcludes: ['!sw.js'], // sw.jsを除外しない
});

const nextConfig = withPWA({
  reactStrictMode: true,
});

export default nextConfig;