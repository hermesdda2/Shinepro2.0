import { useState, useEffect } from 'react';
import { API_URL } from '../config';

// iOS requires PWA installed in standalone mode for push notifications (iOS 16.4+)
const isStandalone = typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);

const notifSupported = typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window;

// On iOS, push only works in standalone mode
const pushSupported = notifSupported && (!/iPhone|iPad|iPod/.test(navigator.userAgent) || isStandalone);

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

export function usePushNotifications() {
    const [permission, setPermission] = useState(notifSupported ? Notification.permission : 'unsupported');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        // Re-subscribe on mount only if already granted and push is supported
        // NOTE: on iOS this must happen after a user gesture â€” handled via requestPermission()
        if (!pushSupported) return;
        if (permission === 'granted') {
            subscribeToPush();
        }
    }, []);

    async function subscribeToPush() {
        if (!pushSupported) return;
        try {
            const reg = await navigator.serviceWorker.ready;

            // Check if already subscribed to avoid duplicate registrations
            const existing = await reg.pushManager.getSubscription();
            if (existing) {
                setSubscribed(true);
                return;
            }

            const res = await fetch(`${API_URL}/api/push/vapid-public-key`);
            const { key } = await res.json();
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(key)
            });
            await fetch(`${API_URL}/api/push/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });
            setSubscribed(true);
        } catch (err) {
            console.error('Error suscribiendo a push:', err);
        }
    }

    // Must be called directly from a user gesture (button tap) â€” required by iOS Safari
    async function requestPermission() {
        if (!notifSupported) return 'unsupported';
        if (!isStandalone && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
            console.warn('iOS: push notifications require the app to be installed (Add to Home Screen)');
            return 'requires-install';
        }
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') await subscribeToPush();
        return result;
    }

    return { permission, subscribed, pushSupported, isStandalone, requestPermission };
}

