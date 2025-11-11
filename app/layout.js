/**
 * Root layout component for the Next.js app
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The root layout
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Media Consumption Tracker</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}