#!/usr/bin/env bash

aws s3 cp s3://plg-works-configs/non/staging/.env ./.env
source .env
node appServer.js