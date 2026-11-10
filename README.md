# BOOKVERSE – Discover Your Next Read 📚

BOOKVERSE is a modern, responsive book explorer web application powered by the public **Open Library Search API**. It allows readers and book lovers to search millions of titles, filter by genre and publication era, sort results, manage a persistent personal reading shelf via `localStorage`, and explore detailed edition records with rich cover art.

---

## 🌟 Key Features

1. **Open Library Public API Integration**
   - Dynamic real-time query fetching from `https://openlibrary.org/search.json`
   - High-resolution book covers via Open Library Covers API (`https://covers.openlibrary.org/b/id/{cover_i}-L.jpg`)
   - Resilient fallback styling with custom book spine aesthetics when covers are missing or 404
   - Direct link to each title's canonical Open Library work page

2. **Search & Discovery**
   - Instant title and author search triggered on `Enter` key or search button
   - Trending topic chips (Fiction, Sci-Fi, Classics, Philosophy, History, Mystery)
   - Pagination / "Load More" button to fetch subsequent result batches

3. **Multi-Faceted Filtering & Sorting**
   - **Category / Genre**: All, Fiction, Science, Fantasy, History, Mystery, Philosophy, etc.
   - **Publication Era**: Pre-1950 (Classics), 1950–1999, 2000–2015, 2016–Present
   - **Sorting**: Relevance, Title (A–Z, Z–A), Newest First, Oldest First, Most Editions
   - **Covers Only**: Toggle to view only books with verified cover artwork
   - **Reset Filters**: One-click restore to default view

4. **Book Details Modal**
   - Full cover image display
   - Complete title, co-authors list, and initial publication year
   - Edition count and subject classification tags
   - "Add to Favorites" action & "Copy Citation" helper

5. **Reading Progress Tracking**
   - Mark any book as **'Want to Read'**, **'Currently Reading'**, or **'Finished'**
   - Update completion percentage (0–100%) with an interactive slider and quick preset buttons (25%, 50%, 75%, 100%)
   - Progress bar badges displayed on book cards and within the Reading Shelf
   - All progress data persisted safely in `localStorage`

6. **User Review and Rating System**
   - Submit star ratings (1 to 5 stars) with interactive star picker and descriptive rating labels
   - Write and submit text reviews with customized reviewer names
   - Instant calculation of average ratings and total review counts on book details and catalog cards
   - Manage and delete personal reviews with individual remove buttons
   - Reviews stored locally in `localStorage` associated with each book's canonical identifier

7. **Personal Reading Shelf & Tracker**
   - Filter your personal shelf by reading status (**All Saved**, **Currently Reading**, **Want to Read**, **Finished**)
   - Overview metrics displaying total books finished and in progress
   - Export your reading list and progress to Markdown (`.md`)
   - Clear shelf option with confirmation

8. **Dual-Theme Design (Light & Dark Mode)**
   - Soft cream/parchment background with dark navy text in Light mode
   - Deep obsidian/navy slate in Dark mode
   - Persistent theme selection stored in `localStorage`

7. **Error Resilience & Loading Experience**
   - Shimmer skeleton loaders while fetching
   - Network failure and API server error recovery with interactive "Retry Connection" button
   - "View Curated Classics" offline fallback so the screen is never left empty
   - Empty search state with actionable suggestions

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Steps
1. **Clone the repository / open the directory**:
   ```bash
   cd bookverse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:3000` (or the port specified in terminal).

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready assets will be compiled into the `dist/` directory.

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

## 🌐 Deploying to Vercel

BOOKVERSE is configured to deploy directly to Vercel without any extra backend configuration:

1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Your application will be live in seconds!

---

## 🛠️ Technology Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 with custom font pairing (`Fraunces` + `Plus Jakarta Sans`)
- **Icons**: Lucide React
- **Data Source**: Open Library Public Search API (`https://openlibrary.org`)
- **Storage**: Browser `localStorage` (Wishlist & Theme)
