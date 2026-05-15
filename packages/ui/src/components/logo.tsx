import React from "react"

/**
 * Algorun Logo Component
 * Renders the brand logo as an SVG with customizable size and color.
 */
interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

export function Logo({ size = 32, color = "#7fb492", ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={(size * 48) / 38} // Maintaining aspect ratio 38:48
      viewBox="0 0 38 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill={color}>
        <path d="m0 24c0-4.0995 1.29832-7.8957 3.50621-11h9.49379v1.7789c-3.01021 1.9627-5 5.3595-5 9.2211 0 6.0751 4.9249 11 11 11v8c-10.49341 0-19-8.5066-19-19z" />
        <path d="m34.4938 35c2.2079-3.1043 3.5062-6.9005 3.5062-11 0-10.4934-8.5066-19-19-19v8c6.0751 0 11 4.9249 11 11 0 3.8616-1.9898 7.2584-5 9.2211v1.7789z" />
      </g>
    </svg>
  )
}
