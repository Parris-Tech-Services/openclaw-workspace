#!/bin/bash
set -e

cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found. Please install Node.js first."
  exit 1
fi

if [ ! -f package.json ]; then
  npm init -y
fi

# Parcel treats the npm default "main" field as a library build target.
# This app is browser-served, so remove it if npm init added it.
npm pkg delete main >/dev/null 2>&1 || true

npm install
npm pkg set scripts.start="parcel index.html --open" >/dev/null
npm pkg set scripts.build="parcel build index.html --dist-dir dist" >/dev/null
npm start
