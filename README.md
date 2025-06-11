# Carfax Vehicle History Report Website

A full-stack web application that allows users to input VIN codes and retrieve Carfax vehicle history reports through automated web scraping.

## Features

- Modern, responsive React frontend
- Express.js backend with automated Carfax report generation
- Real-time report fetching using Playwright automation
- Full-screen report display
- Global deployment support via ngrok
- Automatic login functionality
- Error handling and loading states

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Automation**: Playwright + Chrome Remote Debugging
- **Deployment**: ngrok (for global access)

## Prerequisites

Before setting up the project, ensure you have:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **Google Chrome** browser installed
3. **Git** - [Download here](https://git-scm.com/)
4. **Carfax account** with valid credentials

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Carfax-Website
```

### 2. Install Dependencies

Install backend dependencies:
```bash
npm install
```

Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

### 3. Configure Environment Variables (Optional)

Create a `.env` file in the root directory:
```env
CARFAX_USERNAME=your_email@example.com
CARFAX_PASSWORD=your_password
```

Or edit the credentials directly in `main.js` (lines 8-9).

### 4. Launch Chrome with Remote Debugging

**IMPORTANT**: You must launch Chrome with remote debugging enabled on port 9223 before running the application.

#### Quick Start (Recommended):

**For Mac Users:**
```bash
./launch-chrome.sh
```

**For Windows Users:**
```cmd
launch-chrome.bat
```

#### Manual Launch:

**For Mac Users:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9223 --user-data-dir="/Users/$(whoami)/Library/Application Support/Google/Chrome/Profile 1"
```

**For Windows Users:**

Option 1 - Command Prompt:
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9223 --user-data-dir="C:\Users\%USERNAME%\AppData\Local\Google\Chrome\User Data\Profile 1"
```

Option 2 - PowerShell:
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9223 --user-data-dir="C:\Users\$env:USERNAME\AppData\Local\Google\Chrome\User Data\Profile 1"
```

#### Alternative Chrome Locations (if standard path doesn't work):

**Mac Alternative Paths:**
- `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- `/opt/homebrew/bin/google-chrome` (if installed via Homebrew)

**Windows Alternative Paths:**
- `"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"`
- `"C:\Users\%USERNAME%\AppData\Local\Google\Chrome\Application\chrome.exe"`

### 5. Start the Application

Open **two separate terminal windows**:

**Terminal 1** - Start the backend server:
```bash
npm start
```
Server will run on `http://localhost:5001`

**Terminal 2** - Start the frontend:
```bash
cd client
npm start
```
Frontend will run on `http://localhost:3000`

### 6. Access the Application

Open your browser and navigate to `http://localhost:3000`

## Global Deployment with ngrok

To make your website accessible globally:

1. Install ngrok: [https://ngrok.com/download](https://ngrok.com/download)
2. Run ngrok to expose port 3000:
   ```bash
   ngrok http 3000
   ```
3. Use the provided ngrok URL to access your site from anywhere

## Usage

1. **Launch Chrome** with remote debugging (see step 4 above)
2. **Start the servers** (backend on port 5001, frontend on port 3000)
3. **Enter a VIN code** in the web interface (17-character alphanumeric)
4. **Click "Get Report"** to fetch the Carfax report
5. **View the report** in the full-screen display

## Project Structure

```
Carfax-Website/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styling
│   │   └── index.js       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── public/            # Static assets
├── main.js                # Carfax automation script
├── server.js              # Express backend server
├── package.json           # Backend dependencies
├── launch-chrome.sh       # Mac Chrome launcher script
├── launch-chrome.bat      # Windows Chrome launcher script
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## API Endpoints

- `POST /api/report` - Fetch Carfax report for given VIN
  - Request body: `{ "vin": "17-character-vin" }`
  - Response: HTML report or error message

## Troubleshooting

### Common Issues:

1. **Chrome not connecting**: Ensure Chrome is launched with the correct remote debugging command
2. **Port conflicts**: Make sure ports 3000, 5001, and 9223 are available
3. **Login issues**: Verify Carfax credentials in `main.js` or `.env` file
4. **Proxy errors**: Ensure the backend server is running on port 5001

### Error Debugging:

- Check browser console for frontend errors
- Check terminal output for backend errors
- Error screenshots are automatically saved to `reports/errors/` directory
- Verify Chrome remote debugging at `http://localhost:9223`

## Security Notes

- Never commit real credentials to version control
- Use environment variables for sensitive information
- The automation script requires valid Carfax account access
- Reports are temporarily stored locally and should be cleared regularly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes only. Ensure compliance with Carfax's terms of service when using their platform. 