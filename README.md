# 📈 Berkshire Hathaway Intelligence — RAG Application (Mastra Framework)

This project is a production-ready **Retrieval-Augmented Generation (RAG)** system developed using the **Mastra framework**. It is designed to intelligently answer questions about **Warren Buffett’s investment philosophy** by leveraging the **Berkshire Hathaway Shareholder Letters (2019–2024)** with **real-time streaming responses**, persistent memory, and source attribution.

---

## 🎯 Assignment Objectives

- Build a full-stack AI application using Mastra CLI.
- Implement document ingestion and processing using `MDocument`.
- Create intelligent agents integrated with GPT-4o.
- Enable vector search and metadata-powered source citation.
- Develop a chat interface with conversation memory and streaming.

---

## 🧠 Technologies Used

- 📦 **Mastra Framework**
- 🧠 **OpenAI GPT-4o**
- 💾 **PostgreSQL** with `pgvector`
- 🧑‍💻 **TypeScript / Node.js**
- 🌐 **Frontend UI** via Mastra components

---

## 📚 Data Source

- **Documents**: Berkshire Hathaway Annual Shareholder Letters (2019–2024)
- **Format**: PDF
- **Content**: Investment insights, acquisitions, economic commentary
- **Source**: [Google Drive Folder](https://drive.google.com/drive/folders/1IdPSENw-efKI6S0QiMrSxk12YqxW3eRU)

---

## 🏗️ System Architecture

```text
Frontend ↔ Mastra Agent ↔ RAG System ↔ Vector DB
   ↓            ↓             ↓            ↓
Chat UI     Memory & Tools   MDocument     pgvector
```

---

## 📁 Project Structure

```bash
/berkshire-rag
├── /docs                # PDF Letters
├── /src
│   ├── /agents          # Agent config
│   ├── /rag             # Ingestion pipeline
│   ├── /tools           # Search tools
│   ├── /memory          # Conversation memory
│   └── /frontend        # UI components
├── .env                 # Secrets and DB config
├── README.md
└── package.json
```

---

## 🧪 Running the Application

```bash
npm run dev
# Open in browser: http://localhost:4111
```

---

## ❓ Sample Questions to Ask

1. What is Warren Buffett's investment philosophy?
2. How has Berkshire’s acquisition strategy evolved?
3. What’s his stance on cryptocurrency?
4. How does Buffett evaluate management quality?
5. Can you explain his views on diversification? (follow-up)
