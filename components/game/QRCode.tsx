'use client'

import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  url: string
  size?: number
}

export default function QRCode({ url, size = 200 }: QRCodeProps) {
  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className="bg-white rounded-2xl p-3 shadow-xl"
        style={{ lineHeight: 0 }}
      >
        <QRCodeSVG
          value={url}
          size={size}
          bgColor="#ffffff"
          fgColor="#1e1b4b"
          level="M"
          includeMargin={false}
        />
      </div>
      <p className="text-white/60 text-xs text-center break-all max-w-[200px]">
        {url}
      </p>
    </div>
  )
}
