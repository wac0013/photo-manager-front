import * as React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"
import { cn } from "@/lib/utils"

interface TruncatedTextProps {
  text: string
  className?: string
  lines?: number
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
}

export function TruncatedText({ 
  text, 
  className, 
  lines = 1,
  side = "top",
  align = "start"
}: TruncatedTextProps) {
  const [isTruncated, setIsTruncated] = React.useState(false)
  const textRef = React.useRef<HTMLParagraphElement>(null)

  const checkTruncation = () => {
    const element = textRef.current
    if (element) {
      const isOverflowing = lines === 1 
        ? element.scrollWidth > element.offsetWidth
        : element.scrollHeight > element.offsetHeight
      setIsTruncated(isOverflowing)
    }
  }

  React.useEffect(() => {
    checkTruncation()
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [text, lines])

  const content = (
    <p
      ref={textRef}
      onMouseEnter={checkTruncation}
      className={cn(
        "min-w-0 w-full",
        lines === 1 ? "truncate" : `line-clamp-${lines}`,
        className
      )}
    >
      {text}
    </p>
  )

  if (!isTruncated) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {content}
      </TooltipTrigger>
      <TooltipContent side={side} align={align} className="max-w-[300px] break-words">
        {text}
      </TooltipContent>
    </Tooltip>
  )
}
