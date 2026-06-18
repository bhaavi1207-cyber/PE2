PE2 — Food Recognition & Nutrition App

A web application that identifies food items from a photo using computer vision and displays their nutritional information. Built as a group project.

 How It Works

1. A user uploads or captures a photo of food through the web interface.
2. The image is sent to a computer vision model (via the [Roboflow](https://roboflow.com/) Inference API) which detects/classifies the food item.
3. The predicted food class is matched against a local nutrition database (`foodInfo.json`) to fetch relevant nutritional details.
4. The result is displayed back to the user on the frontend.

 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend (API) | Python, Flask |
| Image Classification | Roboflow Inference SDK |
| Frontend Server | Node.js, Express (`server.js`) |
| Styling | Tailwind CSS |
| Data | JSON (`foodInfo.json`) |

 📂 Project Structure

```
PE2/
├── app.py              # Flask app entry point, serves the frontend
├── predictapi.py        # Calls Roboflow API to classify food images
├── foodInfo.json         # Nutrition data lookup for detected food items
├── server.js             # Node/Express server for the frontend
├── tailwind.config.js    # Tailwind CSS configuration
├── input.css              # Tailwind source styles
├── src/                    # Frontend source files (HTML/CSS/JS)
└── package.json             # Node dependencies
```

⚙️ Setup & Installation

 Prerequisites
- Python 3.x
- Node.js & npm

Backend
```bash
pip install flask inference-sdk
python app.py
```

 Frontend
```bash
npm install
npm run build   # or your configured Tailwind build script
node server.js
```

 Environment Variables
This project uses a Roboflow API key for food image classification. **Do not hardcode it** — set it as an environment variable instead:

```bash
export ROBOFLOW_API_KEY=your_key_here
```


