// Service Workerのインストール
self.addEventListener('install', function(event) {
  console.log('✅ Service Worker: インストール')
  self.skipWaiting() // すぐに有効化
});

// Service Workerのアクティベーション
self.addEventListener('activate', function(event) {
  console.log('✅ Service Worker: アクティベート')
  event.waitUntil(clients.claim()) // すぐにコントロール開始
});

// プッシュ通知を受信
self.addEventListener('push', function(event) {
  console.log('📨 プッシュ通知を受信:', event)
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon512_rounded.png',
      badge: '/icon512_maskable.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 通知をクリック
self.addEventListener('notificationclick', function(event) {
  console.log('🖱️ 通知をクリックしました')
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});