/**
 * Home page component
 * @returns {JSX.Element} The home page
 */
export default function Home() {
  return (
    <main style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        margin: '0 0 1rem 0', 
        color: '#333' 
      }}>
        Hello World! 🌟
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        color: '#666' 
      }}>
        Welcome to your happiness vibe app!
      </p>
    </main>
  )
}