# Ebook Search Web Application

A web-based application for searching and reading ebooks from a local library collection.

## Features

- User authentication and personalized experience
- Search functionality across PDF, EPUB, and AW3 ebook formats
- In-browser ebook viewing with plugin recommendations
- Search history tracking and management
- SQLite database for local storage

## Project Structure

```
ebook-search/
├── backend/              # Flask backend
│   ├── app/
│   │   ├── __init__.py   # Flask app initialization
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   ├── config.py         # Configuration settings
│   └── run.py            # Application entry point
├── frontend/             # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   ├── package.json
│   └── README.md
├── library/              # Ebook library directory
├── instance/             # SQLite database location
├── requirements.txt      # Python dependencies
└── README.md             # Project documentation
```

## Installation

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the backend:
   ```
   python backend/run.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

1. Access the web application at `http://localhost:3000`
2. Register a new account or log in
3. Search for ebooks using keywords
4. View search results and open ebooks in the browser
5. Check your search history

## License

MIT 