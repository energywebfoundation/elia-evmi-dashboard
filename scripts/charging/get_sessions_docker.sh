#!/usr/bin/env bash

sdocker exec -i flex-backend cat inMemoryDB_EWFlex.json | jq '[.models.OcpiSession | to_entries[] | getpath(["value"]) | fromjson]'
