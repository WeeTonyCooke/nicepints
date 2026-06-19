#!/usr/bin/env sh
set -eu

MIGRATION_DIR="supabase/migrations"

if [ ! -d "$MIGRATION_DIR" ]; then
  echo "No migrations directory — skipping."
  exit 0
fi

count=0
for file in "$MIGRATION_DIR"/*.sql; do
  [ -e "$file" ] || continue
  count=$((count + 1))
  if [ ! -s "$file" ]; then
    echo "Migration file is empty: $file"
    exit 1
  fi
done

echo "Verified $count migration file(s)."
exit 0
