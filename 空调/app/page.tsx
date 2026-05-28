"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

type Mode = "cool" | "heat" | "fan"

const messages: Record<Mode, string[]> = {
  cool: [
    "❄️【空调已开启】已为群友打开制冷模式，温度设定为 {temp}°C~ 大家凉快凉快！",
    "🌬️ 群空调启动！当前温度 {temp}°C，冷气嗖嗖的~ 记得盖好小被子哦！",
    "❄️ 叮咚~ 群空调已开启制冷模式，{temp}度送上！各位老板请享用冷风~",
    "🔥→❄️ 降温成功！群温度已降至 {temp}°C，感觉凉爽了吗？",
    "🎛️ 空调遥控器已按！{temp}°C 制冷中，大家安心聊天~",
  ],
  heat: [
    "🔥【空调已开启】已为群友打开制热模式，温度设定为 {temp}°C，温暖来袭！",
    "🌡️ 群空调启动！当前温度 {temp}°C，暖气呼呼的~ 冬天不再寒冷！",
    "🔥 叮咚~ 群空调已开启制热模式，{temp}度送上！各位注意保暖哦！",
    "❄️→🔥 升温成功！群温度已升至 {temp}°C，感觉暖和了吗？",
    "🎛️ 空调遥控器已按！{temp}°C 制热中，大家暖暖身子~",
  ],
  fan: [
    "💨【风扇已开启】已为群友打开通风模式，清风徐来~",
    "🌬️ 群风扇启动！让空气流通起来！",
    "💨 叮咚~ 群空调已开启通风模式，给大家吹吹风~",
    "🎛️ 风扇已打开！保持空气清新~",
  ],
}

const modeConfig: Record<Mode, { icon: string; text: string }> = {
  cool: { icon: "❄️", text: "制冷模式" },
  heat: { icon: "🔥", text: "制热模式" },
  fan: { icon: "💨", text: "通风模式" },
}

export default function ACSimulator() {
  const [isOn, setIsOn] = useState(false)
  const [temperature, setTemperature] = useState(26)
  const [mode, setMode] = useState<Mode>("cool")
  const [messageText, setMessageText] = useState("点击下方按钮生成搞笑空调消息~")
  const [showEffect, setShowEffect] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 2000)
  }, [])

  const triggerEffect = useCallback(() => {
    if (mode === "cool") {
      setShowEffect(true)
      setTimeout(() => setShowEffect(false), 3000)
    }
  }, [mode])

  const generateMessage = useCallback(() => {
    if (!isOn) {
      setMessageText("请先打开空调电源~")
      return
    }
    const modeMessages = messages[mode]
    const message = modeMessages[Math.floor(Math.random() * modeMessages.length)].replace(
      "{temp}",
      temperature.toString()
    )
    setMessageText(message)
  }, [isOn, mode, temperature])

  const togglePower = () => {
    const newState = !isOn
    setIsOn(newState)
    if (newState) {
      triggerEffect()
      setTimeout(() => {
        const modeMessages = messages[mode]
        const message = modeMessages[Math.floor(Math.random() * modeMessages.length)].replace(
          "{temp}",
          temperature.toString()
        )
        setMessageText(message)
      }, 100)
    } else {
      setShowEffect(false)
      setMessageText("空调已关闭，点击电源开启~")
    }
  }

  const changeTemp = (delta: number) => {
    if (!isOn) return
    setTemperature((prev) => Math.max(16, Math.min(30, prev + delta)))
    triggerEffect()
  }

  const setModeHandler = (newMode: Mode) => {
    if (!isOn) return
    setMode(newMode)
    triggerEffect()
  }

  const copyMessage = async () => {
    if (messageText === "点击下方按钮生成搞笑空调消息~" || messageText === "请先打开空调电源~") {
      showToast("请先生成消息~")
      return
    }
    try {
      await navigator.clipboard.writeText(messageText)
      showToast("复制成功！快去粘贴吧~")
    } catch {
      showToast("复制失败，请手动复制")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-4 font-sans">
      {/* Snowflake Effect */}
      {showEffect && mode === "cool" && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall text-xl text-[#00d4ff]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              ❄️
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      <div
        className={cn(
          "fixed bottom-5 left-1/2 z-[1001] -translate-x-1/2 rounded-full bg-[#00ff88]/90 px-5 py-2.5 text-sm font-bold text-[#0a0a1a] transition-opacity duration-300",
          toast ? "opacity-100" : "opacity-0"
        )}
      >
        {toast}
      </div>

      <div className="mx-auto max-w-[400px]">
        <h1 className="mb-5 text-center text-xl text-[#00d4ff] drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]">
          ❄️ 群空调模拟器 ❄️
        </h1>

        {/* AC Unit */}
        <div className="rounded-2xl bg-gradient-to-br from-[#2d2d44] to-[#1a1a2e] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_2px_10px_rgba(255,255,255,0.1)]">
          {/* Display Screen */}
          <div className="mb-5 rounded-xl border-2 border-[#00d4ff] bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e] p-5 shadow-[0_0_15px_rgba(0,212,255,0.3),inset_0_0_25px_rgba(0,212,255,0.1)]">
            <div className="text-center">
              <span
                className={cn(
                  "text-6xl font-bold drop-shadow-[0_0_25px_rgba(0,255,136,0.8)]",
                  isOn ? "text-[#00ff88]" : "text-[#888]"
                )}
              >
                {temperature}
              </span>
              <span className="ml-1 text-xl text-[#888]">°C</span>
            </div>
            <div className="mt-3 text-center text-[#00d4ff]">
              <div className="mb-1.5 text-3xl">{modeConfig[mode].icon}</div>
              <div>{modeConfig[mode].text}</div>
            </div>
          </div>

          {/* Temperature Controls */}
          <div className="mb-5 flex justify-center gap-4">
            <button
              onClick={() => changeTemp(-1)}
              className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-br from-[#3d3d5c] to-[#2a2a44] text-2xl text-[#00d4ff] shadow-[0_5px_15px_rgba(0,0,0,0.3),inset_0_2px_5px_rgba(255,255,255,0.1)] transition-all hover:scale-110 hover:shadow-[0_8px_25px_rgba(0,212,255,0.4)] active:scale-95"
            >
              -
            </button>
            <button
              onClick={() => changeTemp(1)}
              className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-br from-[#3d3d5c] to-[#2a2a44] text-2xl text-[#00d4ff] shadow-[0_5px_15px_rgba(0,0,0,0.3),inset_0_2px_5px_rgba(255,255,255,0.1)] transition-all hover:scale-110 hover:shadow-[0_8px_25px_rgba(0,212,255,0.4)] active:scale-95"
            >
              +
            </button>
          </div>

          {/* Mode Buttons */}
          <div className="mb-5 flex justify-around">
            {(["cool", "heat", "fan"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModeHandler(m)}
                className={cn(
                  "rounded-full border-2 bg-gradient-to-br from-[#2d2d44] to-[#1a1a2e] px-4 py-2.5 text-xs transition-all",
                  isOn && mode === m
                    ? "border-[#00d4ff] text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                    : "border-transparent text-[#888]"
                )}
              >
                {modeConfig[m].icon} {m === "cool" ? "制冷" : m === "heat" ? "制热" : "通风"}
              </button>
            ))}
          </div>

          {/* Power Button */}
          <div className="text-center">
            <button
              onClick={togglePower}
              className={cn(
                "h-[70px] w-[70px] rounded-full border-[3px] text-sm font-bold text-white transition-all",
                isOn
                  ? "border-[#00ff88] bg-gradient-to-br from-[#00ff88] to-[#00cc6a] shadow-[0_5px_20px_rgba(0,255,136,0.4)]"
                  : "border-[#ff4444] bg-gradient-to-br from-[#ff6b6b] to-[#ff4444] shadow-[0_5px_20px_rgba(255,68,68,0.4)]"
              )}
            >
              {isOn ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Message Generator */}
        <div className="mt-5 rounded-xl bg-gradient-to-br from-[#2d2d44] to-[#1a1a2e] p-5">
          <div className="mb-3 text-center text-base text-[#00d4ff]">📤 生成群消息</div>
          <div className="mb-3 min-h-[50px] break-all rounded-lg border border-dashed border-[#3d3d5c] bg-[#0a0a1a] p-3 text-sm leading-relaxed text-[#00ff88]">
            {messageText}
          </div>
          <div className="flex gap-2">
            <button
              onClick={generateMessage}
              className="flex-1 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#0099cc] py-2.5 text-sm font-bold text-[#0a0a1a] transition-all hover:opacity-90"
            >
              🎲 生成
            </button>
            <button
              onClick={copyMessage}
              className="flex-1 rounded-lg bg-gradient-to-br from-[#3d3d5c] to-[#2a2a44] py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
            >
              📋 复制
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[#888]">💡 点击右上角 ··· 分享到微信群</p>
        <p className="mt-5 text-center text-[11px] text-[#666]">🎮 仅供娱乐，开心就好</p>
      </div>
    </div>
  )
}
