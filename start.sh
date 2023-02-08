#!/usr/bin/env bash
node db/seed.js
node db/migrate.js
npm start