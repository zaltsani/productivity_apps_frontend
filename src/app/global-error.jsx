"use client"

import Image from "next/image"

export default function GlobalError() {
  return (
    <html>
      <body>
        <Image
          src="/error.gif"
          alt="logo"
          width={480}
          height={360}
        />
      </body>
    </html>
  )
}