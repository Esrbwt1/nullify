#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Run the database migration
echo "--- Running Database Migration ---"
node scripts/migrate.js
echo "--- Migration Complete ---"

# Execute the main command (start the server)
# "$@" allows us to pass arguments to this script, which will then be executed.
exec "$@"