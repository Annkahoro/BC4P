# BC4P (Posterity Cell One)

BC4P is a sophisticated MERN-stack platform designed to facilitate the creation of a 12,000+ acre sovereign agricultural corridor known as **Posterity Cell One**. The project integrates high-end technology with the rich Gīkūyū cultural heritage to build a sustainable and self-governing agricultural ecosystem.

## 🌟 Vision
To establish a technologically advanced agricultural corridor that preserves and leverages indigenous knowledge while ensuring food security and economic sovereignty.

## 🏛️ The Five Pillars (PESTEL)
Data is collected and organized under five key thematic areas:
1.  **Cultural (Social/Legal):** Preserving Gīkūyū heritage and traditional practices.
2.  **Social:** Community engagement and organizational structure.
3.  **Economic:** Financial models and market access for agricultural products.
4.  **Environmental:** Sustainable land management and ecological preservation.
5.  **Technical (Political/Technological):** High-end tech integration and resource allocation.

## ✨ Key Features
-   **No-Password Authentication:** Seamless access for contributors using Name and Phone number.
-   **Rich Content Support:** Multi-media uploads (images, videos) via Cloudinary and rich text editing.
-   **Admin Dashboard:** Comprehensive tools for administrators to review, filter, and export data.
-   **CSV Export:** Easily export collected data for further analysis.
-   **Secure Session Management:** Token-based security and session timeouts.

## 🛠️ Tech Stack
### Frontend
-   **Framework:** React 19 (Vite)
-   **Styling:** Tailwind CSS
-   **State Management/API:** Axios
-   **Icons:** Lucide-React
-   **Rich Text Editor:** React Quill

### Backend
-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** MongoDB (Mongoose)
-   **Authentication:** JWT (JSON Web Tokens) & BcryptJS
-   **Media Storage:** Cloudinary (via Multer)

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   MongoDB account (Atlas or local)
-   Cloudinary account

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Annkahoro/BC4P.git
    cd BC4P
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory with the following variables:
    ```env
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    PORT=5000
    ```
    To seed the initial admin account:
    ```bash
    node seedAdmin.js
    ```
    Start the backend server:
    ```bash
    npm start
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../fronted
    npm install
    ```
    Start the frontend development server:
    ```bash
    npm run dev
    ```

## 📄 License
This project is for private use as part of the BC4P Agricultural Corridor initiative.

---
*Built with passion for prosperity and heritage.*
