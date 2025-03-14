# AI-Powered Document Analysis

## Overview
This project allows users to scrape documentation from a given URL, store the content in a Pinecone vector database, and query the stored information using OpenAI's API.

## Features
- **Web Scraping:** Extract text from documentation URLs.
- **Vector Database Storage:** Store extracted data in Pinecone for efficient retrieval.
- **AI-Powered Q&A:** Use OpenAI's API to answer questions based on stored documentation.
- **Modern UI:** Clean, SaaS-style interface with smooth gradients and glassmorphism effects.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** Pinecone Vector Database
- **AI Integration:** OpenAI API

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo.git
   cd your-repo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file and add:
   ```sh
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   ```

## Usage
1. Start the development server:
   ```sh
   npm run dev
   ```
2. Enter a documentation URL and click "Scrape Document" to store the content.
3. Ask a question related to the document, and the AI will generate an answer.

## API Endpoints
### Scrape Document
- **Endpoint:** `POST /api/scrape`
- **Payload:** `{ "url": "https://example.com" }`
- **Response:** `{ "message": "Docs scraped successfully." }`

### Query AI
- **Endpoint:** `POST /api/query`
- **Payload:** `{ "question": "What is the main topic?" }`
- **Response:** `{ "answer": "The main topic is..." }`

## Future Enhancements
- Support for multiple document formats (PDF, Word, etc.)
- User authentication for personalized document storage
- Improved search and summarization features

## License
This project is open-source under the MIT License.

