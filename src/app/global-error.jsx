"use client"

import Image from "next/image"

export default function GlobalError() {
  return (
    <html>
      <body>
        <div className="w-screen h-screen flex items-center justify-center">
          <Image
            src="/error.gif"
            alt="logo"
            width={480}
            height={360}
          />
        </div>
      </body>
    </html>
  )
}