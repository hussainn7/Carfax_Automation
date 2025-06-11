#!/bin/bash

# Launch Chrome with remote debugging for Carfax Website
# This script launches Chrome with the necessary flags for the automation to work

echo "🚀 Launching Chrome with remote debugging on port 9223..."

# Kill any existing Chrome processes using port 9223
lsof -ti:9223 | xargs kill -9 2>/dev/null || true

# Launch Chrome with remote debugging
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9223 \
  --user-data-dir="/Users/$(whoami)/Library/Application Support/Google/Chrome/Profile 1" \
  --disable-web-security \
  --disable-features=VizDisplayCompositor &

echo "✅ Chrome launched successfully!"
echo "📍 Remote debugging available at: http://localhost:9223"
echo "🌐 You can now start the application with 'npm start'"
echo ""
echo "To stop Chrome debugging, run: lsof -ti:9223 | xargs kill -9" 