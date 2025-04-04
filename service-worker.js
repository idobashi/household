self.addEventListener('install', event => {
  console.log('Service Worker: インストール中...');
});

self.addEventListener('fetch', event => {
  // オフライン対応してない最低限のSW
});
