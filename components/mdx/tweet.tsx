import { type ReactNode, Suspense } from "react"
import { Tweet as ReactTweet } from "react-tweet"
import { Caption } from "./caption"

interface TweetProps {
  id: string
  caption?: ReactNode
}

/**
 * Twitter/X tweet embed with Suspense loading
 *
 * Usage in MDX:
 * <Tweet id="1234567890" />
 * <Tweet id="1234567890" caption="Interesting perspective on this topic" />
 */
export function Tweet({ id, caption }: TweetProps) {
  return (
    <div className="my-6">
      <div className="flex justify-center">
        <Suspense
          fallback={
            <div className="w-full max-w-[550px] h-[200px] bg-muted rounded-xl animate-pulse" />
          }
        >
          <ReactTweet id={id} />
        </Suspense>
      </div>
      {caption && <Caption>{caption}</Caption>}
    </div>
  )
}
