#!/bin/bash

# Script to start both frontend and backend in dev or prod mode
# Usage: ./start.sh dev   # or ./start.sh prod

MODE=${1:-dev}

if [ "$MODE" != "dev" ] && [ "$MODE" != "prod" ]; then
  echo "Invalid mode. Usage: ./start.sh [dev|prod]"
  exit 1
fi

echo "Starting gridbricks in $MODE mode..."

# Start backend
echo "Starting backend..."
cd gridbricks-backend

if [ "$MODE" = "dev" ]; then
  npm run dev &
else
  npm start &
fi

BACKEND_PID=$!
cd ..

# Start frontend
echo "Starting frontend..."
cd gridbrics-frontend

if [ "$MODE" = "dev" ]; then
  npm run dev &
else
  npm run build && npm start &
fi

FRONTEND_PID=$!
cd ..

echo ""
echo "✓ Backend started (PID: $BACKEND_PID)"
echo "✓ Frontend started (PID: $FRONTEND_PID)"
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "To stop, run: kill $BACKEND_PID $FRONTEND_PID"
echo "Or press Ctrl+C"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
