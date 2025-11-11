# Media Consumption Tracker

Happiness by Media Consumed - A Next.js application for tracking daily happiness levels and media consumption.

## Data Schema

### Happiness Entry

The core data entity is defined by a JSON Schema in `/schemas/happiness.json`:

```json
{
  "date": "2024-10-23",     // YYYY-MM-DD format
  "happiness": 1            // Integer from -2 to 2
}
```

#### Happiness Scale:
- **-2**: Very Unhappy 😢
- **-1**: Unhappy 😔
- **0**: Neutral 😐
- **1**: Happy 😊
- **2**: Very Happy 😄

## Project Structure

```
├── app/
│   ├── layout.js          # Root layout component
│   └── page.js           # Home page with sample data
├── schemas/
│   ├── happiness.json    # JSON Schema definition
│   └── index.js         # Schema validation utilities
├── lib/
│   └── happiness.js     # Happiness data utilities
├── next.config.js       # Next.js configuration
└── package.json         # Project dependencies
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Features

- ✅ JSON Schema validation for data integrity
- ✅ JSDoc type annotations throughout
- ✅ Sample data visualization
- ✅ Date formatting utilities
- ✅ Happiness level descriptions with emojis