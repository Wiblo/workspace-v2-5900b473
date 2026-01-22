"use client"

import YouTube from "react-youtube"
import { Caption } from "./caption"

interface YouTubeEmbedProps {
  id: string
  caption?: string
}

/**
 * YouTube video embed component
 *
 * Usage in MDX:
 * <YouTube id="dQw4w9WgXcQ" />
 * <YouTube id="dQw4w9WgXcQ" caption="Video explanation" />
 */
export function YouTubeEmbed({ id, caption }: YouTubeEmbedProps) {
  return (
    <div className="my-6">
      <div className="aspect-video rounded-lg overflow-hidden">
        <YouTube
          videoId={id}
          className="w-full h-full"
          iframeClassName="w-full h-full"
          opts={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      {caption && <Caption>{caption}</Caption>}
    </div>
  )
}
