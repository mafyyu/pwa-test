// app/page.tsx

"use client"

import { FormEvent, useState } from "react"

import { useNotificationManager } from "@/app/hooks/use-notification-manager"

export default function Page() {
  const [message, setMessage] = useState("")
  const {
    isSupported,
    subscription,
    error,
    subscribeToPush,
    unsubscribeFromPush,
    sendNotification,
  } = useNotificationManager()

  if (!isSupported) {
    return <p>このブラウザではプッシュ通知はサポートされていません。</p>
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const success = await sendNotification(message)
    if (success) {
      setMessage("")
    }
  }

  return (
    <div className="container py-8">
      <div className="rounded border p-4">
        <h1 className="mb-4 text-xl font-bold">プッシュ通知</h1>

        {subscription ? (
          <>
            <p>プッシュ通知を購読しています。</p>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="通知メッセージを入力する"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mr-2 w-60 rounded border p-2"
                />
              </div>
              <div className="mt-4">
                <button type="submit" className="rounded bg-blue-500 px-4 py-2">
                  送信テスト
                </button>
              </div>
            </form>
            <div className="mt-4">
              <button
                onClick={unsubscribeFromPush}
                className="rounded bg-red-500 px-4 py-2"
              >
                登録解除
              </button>
            </div>
          </>
        ) : (
          <div>
            <p>プッシュ通知に登録されていません。</p>
            <div className="mt-4">
              <button
                onClick={() => {
                  console.log("🖱️ 登録ボタンがクリックされました")
                  subscribeToPush()
                }}
                className="rounded bg-green-500 px-4 py-2 text-white"
              >
                登録
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded bg-red-50 p-2 text-red-500">{error}</p>
        )}
      </div>
    </div>
  )
}