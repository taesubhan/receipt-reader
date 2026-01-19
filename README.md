## 🚧 Project Status

This project is currently **under active development**.

Core functionality is implemented, while additional features, improvements, and refinements are ongoing. The API, UI, and calculation logic may change as the project evolves.

# Receipt Price Split Calculator

Link: https://taesh-price-calculator.netlify.app/

A full-stack application that calculates how to split a receipt total among multiple people by analyzing a receipt image using Azure AI Document Intelligence.

The app extracts line items from a receipt image, allows users to assign each item to a person, and then calculates per-person subtotals, tax, tip, fees, and final totals.

Features:
- Upload a receipt image (photo or scan)
- Extract receipt data using Azure AI Document Intelligence
- Edit detected items (name, price, person)
- Add or remove receipt items manually
- Split tax, tip, and additional fees proportionally
- View per-person breakdown

Frontend
- Vite
- HTML / CSS
- TypeScript

Backend
- Node.js
- Express
- Azure AI Document Intelligence SDK

Deployment
- Frontend: Netlify
- Backend: Serverless platform (e.g., Koyeb)
