# AI-Powered Document Analysis

## ⭐ Why Star This Repo?
- **Hallucination-Free, Up-to-Date Answers**: Get accurate responses based on the latest documentation from GitHub repositories.
- **Effortless Querying**: Easily ask complex questions combining multiple technologies.
- **Contribute & Enhance**: Help improve AI-powered documentation search!

## Overview
This project enables users to scrape documentation exclusively from GitHub repositories, store the content in a Pinecone vector database, and query the stored information using OpenAI's API. The frontend supports rich markdown rendering with syntax highlighting and an intuitive interface for querying AI responses.

## Features
- **GitHub Scraping:** Fetch and process Markdown documentation from GitHub repositories.
- **Vector Database Storage:** Store extracted data in Pinecone for efficient retrieval.
- **AI-Powered Q&A:** Utilize OpenAI's API to answer questions based on stored documentation.
- **Query Refinement:** AI-assisted refinement allows for iterative improvement of responses.
- **Modern UI:** Clean, SaaS-style interface with smooth gradients, glassmorphism effects, and rich markdown rendering with syntax highlighting.
- **Code Block Copying:** Easily copy code snippets from AI-generated responses with a single click.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** Pinecone Vector Database
- **AI Integration:** OpenAI API
- **Additional Libraries:** got, remark, gray-matter, react-markdown, syntax-highlighter

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
   GITHUB_TOKEN=your_github_api_token  # (For fetching private GitHub repos)
   ```

## API Endpoints
### Scrape GitHub Repository
- **Endpoint:** `POST /api/scrape`
- **Payload:** `{ "url": "https://github.com/user/repo" }`
- **Response:** `{ "message": "Docs scraped successfully." }`

### Query AI
- **Endpoint:** `POST /api/query`
- **Payload:** `{ "question": "How does GitHub Actions work?" }`
- **Response:** `{ "answer": "GitHub Actions allow you to automate workflows in your repository using YAML-based configuration files." }`

### Example Queries
#### Basic Query
```sh
POST /api/query
{
  "question": "How do I create a new branch in Git?"
}
```
**Response:** "You can create a new branch using `git checkout -b branch_name` or `git switch -c branch_name`."

#### Scraping GitHub Docs Itself
```sh
POST /api/scrape
{
  "url": "https://github.com/github/docs"
}
```
**Follow-up Query:** "How do I create a GitHub Actions workflow?"

#### Advanced Query Combining Multiple Tech Stacks
```sh
POST /api/query
{
  "question": "How do I integrate GitHub Actions with AWS Lambda using Terraform?"
}
```
**Response:** Detailed step-by-step instructions including GitHub Actions YAML, Terraform configuration, and AWS Lambda deployment.

## Future Enhancements
- **Select Multiple Docs:** Query across multiple repositories simultaneously.
- **Complex Multi-Tech Queries:** Seamlessly combine information from different technologies.

## 🌟 Contribute & Support
- Found this project useful? **Star** this repo!
- Want to improve it? **Contributions are welcome!**
- Have ideas? Open an issue and share your thoughts!

## License
This project is open-source under the MIT License.

