# 💰 ExpenseIQ — Smart Expense Tracker

A full-stack personal finance tracker with insights, analytics, and budget management.

🔗 **Live Demo:** [prasadj18.github.io](https://prasadj18.github.io/) &nbsp;|&nbsp; **Backend API:** [expense-tracker-backend-fs20.onrender.com](https://expense-tracker-backend-fs20.onrender.com)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | Component-based UI with fast dev server |
| **Routing** | React Router DOM | Client-side navigation without page reload |
| **Charts** | Chart.js + Recharts | Pie chart (categories) and Line chart (trends) |
| **HTTP** | Axios | API calls to backend |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB Atlas | NoSQL cloud database for transactions & budgets |
| **ODM** | Mongoose | Schema definition and MongoDB queries |
| **Frontend Host** | Vercel | Static file hosting with CI/CD from GitHub |
| **Backend Host** | Render | Node.js server hosting |

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── server.js               ← Express app entry point
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   │   ├── Transaction.js      ← Mongoose schema for transactions
│   │   └── Budget.js           ← Mongoose schema for budgets
│   ├── routes/
│   │   ├── transactions.js     ← CRUD + CSV export
│   │   ├── summary.js          ← Monthly aggregation & daily trend
│   │   ├── insights.js         ← Smart insights engine
│   │   └── budget.js           ← Budget CRUD + usage stats
│   └── middleware/
│       └── errorHandler.js     ← Global error handler
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx            ← React entry point
        ├── App.jsx             ← Router + layout shell
        ├── api/api.js          ← Axios base config
        ├── context/
        │   ├── ThemeContext.jsx
        │   └── ToastContext.jsx
        ├── hooks/
        │   └── useTransactions.js
        ├── components/
        │   ├── Sidebar.jsx
        │   ├── StatCard.jsx
        │   ├── TransactionForm.jsx
        │   ├── TransactionTable.jsx
        │   ├── PieChart.jsx
        │   ├── LineChart.jsx
        │   ├── InsightsPanel.jsx
        │   └── BudgetPanel.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── AddTransaction.jsx
            ├── Transactions.jsx
            ├── Insights.jsx
            └── Budgets.jsx
```

---

## ⚙️ API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/transactions` | Create a new transaction |
| `GET` | `/api/transactions` | List all transactions (supports filters) |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |
| `GET` | `/api/transactions/meta/categories` | Get predefined categories |
| `GET` | `/api/summary` | Monthly summary + category breakdown |
| `GET` | `/api/insights` | Smart spending insights |
| `POST` | `/api/budget` | Create or update a budget |
| `GET` | `/api/budget` | All budgets with current month usage |
| `DELETE` | `/api/budget/:id` | Delete a budget |

### Query Parameters for `GET /api/transactions`

| Param | Type | Description |
|---|---|---|
| `startDate` | string | Filter from date `YYYY-MM-DD` |
| `endDate` | string | Filter to date `YYYY-MM-DD` |
| `category` | string | Filter by category name |
| `type` | string | `income` or `expense` |
| `search` | string | Search in note field |
| `export` | string | Set to `csv` to download as CSV |

---

## 🗄️ Database Schema

### Transaction
```js
{
  amount:      Number,   // required, > 0
  category:    String,   // required
  type:        String,   // "income" | "expense"
  date:        Date,     // default: now
  note:        String,   // optional, max 200 chars
  isRecurring: Boolean,  // default: false
  createdAt:   Date,
  updatedAt:   Date
}
```

### Budget
```js
{
  category:  String,  // unique per category
  limit:     Number,  // monthly spending cap
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- A free [MongoDB Atlas](https://cloud.mongodb.com) account

### 1. Clone the repo
```bash
git clone https://github.com/Prasadj18/Expense-tracker.git
cd Expense-tracker
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
MONGO_URI=mongodb+srv://yourUser:yourPassword@cluster0.xxxxx.mongodb.net/expense-tracker
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

### Backend → Render
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo, set root directory to `backend/`
3. Build command: `npm install` | Start command: `npm start`
4. Add environment variables: `MONGO_URI`, `PORT`, `CLIENT_URL`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import repo
2. Set **Root Directory** to `frontend/`
3. Add environment variable: `VITE_API_BASE_URL` = your Render URL
4. Deploy

---

## 🧠 Smart Insights Logic

| Insight | Trigger Condition |
|---|---|
| High category spending | Any category > 40% of total monthly expenses |
| Month-over-month increase | Current month > last month by > 10% |
| Month-over-month decrease 🎉 | Current month < last month by > 10% |
| Weekly spending alert | This week > last week by > 20% |
| Budget exceeded 🚨 | Category spending ≥ 100% of budget |
| Budget warning ⚡ | Category spending ≥ 80% of budget |

---

## ✨ Features

- 📊 **Dashboard** — Monthly income, expenses, balance, net worth at a glance
- ➕ **Add Transaction** — Log income or expenses with category, date, and notes
- 📋 **Transactions** — Full list with filters by date, category, type, and search
- 📤 **CSV Export** — Download filtered transactions as a spreadsheet
- 💡 **Smart Insights** — Automatic alerts for overspending and trends
- 🎯 **Budgets** — Set monthly limits per category with progress bars
- 🌙 **Dark / Light Mode** — Persisted theme toggle
- 🔁 **Recurring Transactions** — Flag transactions that repeat monthly

---

## 📄 License

MIT — free to use and modify.
