#!/bin/bash

# Check if a page name was provided
if [ -z "$1" ]; then
    echo "Please provide a page name"
    echo "Usage: ./create-page.sh <page-name> [layout-type]"
    echo "Example: ./create-page.sh dashboard app"
    exit 1
fi

# Set variables
PAGE_NAME=$1
LAYOUT_TYPE=${2:-marketing}  # Default to marketing layout if not specified
PAGE_PATH="src/app/pages"
TEMPLATE="import type { PageWithLayout } from '@/components/layout';

const ${PAGE_NAME^}Page: PageWithLayout = () => {
  return (
    <div>
      <h1>${PAGE_NAME^}</h1>
    </div>
  );
};

${PAGE_NAME^}Page.layoutVariant = '${LAYOUT_TYPE}' as const;

export default ${PAGE_NAME^}Page;"

# Create the page directory if it doesn't exist
mkdir -p "$PAGE_PATH"

# Create the page file
echo "$TEMPLATE" > "$PAGE_PATH/${PAGE_NAME}.tsx"

echo "Created page at $PAGE_PATH/${PAGE_NAME}.tsx with ${LAYOUT_TYPE} layout"

# If the page is in a subdirectory, create an index.ts file
if [[ "$PAGE_NAME" == */* ]]; then
    DIR_PATH="$PAGE_PATH/$(dirname "$PAGE_NAME")"
    echo "export { default } from './${PAGE_NAME##*/}';" > "$DIR_PATH/index.ts"
    echo "Created index.ts in $DIR_PATH"
fi

# Make the script executable again (it might lose permission after downloading)
chmod +x "$(basename "$0")"

echo "Done! 🎉"
echo "You can now edit your page at $PAGE_PATH/${PAGE_NAME}.tsx"