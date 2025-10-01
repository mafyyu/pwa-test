
import { useEffect, useState } from "react"

export function useNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  // Service Workerの登録
  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }

  // Base64文字列をUint8Arrayに変換
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // 通知の購読
  const subscribeToPush = async () => {
    console.log("🔔 subscribeToPush が呼ばれました")
    
    try {
      // 環境変数のチェック
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      console.log("🔑 環境変数チェック:", {
        vapidKey存在: !!vapidKey,
        vapidKey長さ: vapidKey?.length,
        vapidKey先頭10文字: vapidKey?.substring(0, 10)
      })
      
      if (!vapidKey) {
        const msg = "環境変数 NEXT_PUBLIC_VAPID_PUBLIC_KEY が設定されていません"
        console.error("❌", msg)
        setError(msg)
        return
      }

      // 通知許可を要求
      console.log("📢 通知の許可を要求します")
      const permission = await Notification.requestPermission()
      console.log("✅ 許可状態:", permission)
      
      if (permission !== "granted") {
        throw new Error("通知の許可が得られませんでした")
      }

      console.log("⏳ Service Workerの準備を待機中...")
      const registration = await navigator.serviceWorker.ready
      console.log("✅ Service Worker準備完了")

      console.log("📝 プッシュ通知を購読します...")
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })
      
      console.log("🎉 購読成功！", sub)
      setSubscription(sub)
      setError(null)
    } catch (error) {
      console.error("❌ エラー発生:", error)
      if (error instanceof Error) {
        console.error("エラーメッセージ:", error.message)
        setError(error.message)
      } else {
        console.error("不明なエラー")
        setError(String(error))
      }
    }
  }

  // 通知の購読解除
  const unsubscribeFromPush = async () => {
    try {
      if (!subscription) return
      await subscription.unsubscribe()
      setSubscription(null)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }

  // 通知の送信
  const sendNotification = async (message: string) => {
    try {
      if (!subscription) {
        return false
      }

      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          subscription,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "通知の送信に失敗しました")
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      return false
    }
  }

  return {
    isSupported,
    subscription,
    error,
    subscribeToPush,
    unsubscribeFromPush,
    sendNotification,
  }
}
