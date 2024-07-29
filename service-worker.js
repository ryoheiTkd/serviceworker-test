let eventSource = null;

self.addEventListener('install', event => {
    console.log('Service Worker installed');
    self.skipWaiting(); // インストール後すぐにアクティブにする
});

self.addEventListener('activate', event => {
    console.log('Service Worker activated');
    event.waitUntil(self.clients.claim()); // クライアントを制御する
    // Activate時にSSE接続を開始
    if (!eventSource) {
        openSSEConnection();
    }
});

self.addEventListener('message', event => {
    if (event.data.type === 'START_SSE') {
        if (!eventSource) {
            openSSEConnection();
        }
    }
});

const openSSEConnection = () => {
    eventSource = new EventSource('/sse');

    eventSource.onmessage = event => {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage(event.data);
            });
        });

        self.registration.showNotification('New SSE Message', {
            body: event.data,
            icon: '/path/to/icon.png'
        });
    };

    eventSource.onerror = error => {
        console.error('EventSource failed:', error);
        eventSource.close();
        setTimeout(openSSEConnection, 5000);
    };
};