#!/usr/bin/env bash

ssh -i $SSH_IDENTITY ubuntu@18.158.132.98 cat flex-backend/inMemoryDB_EWFlex.json | jq '[.models.OcpiToken | to_entries[] | getpath(["value"]) | fromjson]'