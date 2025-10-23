import { SAMPLE_DATA, HAPPINESS_LEVELS, formatDate } from '../lib/happiness.js'

/**
 * Home page component showing happiness tracking
 * @returns {JSX.Element} The home page
 */
export default function Home() {
  return (
    <main style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          margin: '0 0 1rem 0', 
          color: '#333' 
        }}>
          Happiness Vibe Tracker 🌟
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#666' 
        }}>
          Track your daily happiness levels
        </p>
      </header>

      <section>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          Happiness Scale
        </h2>
        <div style={{ 
          display: 'grid', 
          gap: '0.5rem',
          marginBottom: '2rem' 
        }}>
          {Object.entries(HAPPINESS_LEVELS).map(([level, description]) => (
            <div key={level} style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 'bold' }}>Level {level}:</span>
              <span>{description}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          Sample Entries
        </h2>
        <div style={{ 
          display: 'grid', 
          gap: '1rem' 
        }}>
          {SAMPLE_DATA.map((entry, index) => (
            <div key={index} style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {formatDate(entry.date)}
              </div>
              <div style={{ fontSize: '1.2rem' }}>
                {HAPPINESS_LEVELS[entry.happiness]}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                Raw data: {JSON.stringify(entry)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}