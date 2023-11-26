#!/bin/bash

# Read each line in the .env file
while IFS='=' read -r key value; do
    # Trim whitespace from the key and value
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)

    # Set each key-value pair as a GitHub secret
    echo "Setting secret for $key"
    echo "$value" | gh secret set "$key"
done < .env
