#!/bin/bash

# Load environment variables from .env
if [ -f .env ]; then
  # Read .env file line by line to handle variables safely (ignoring comments)
  export $(grep -v '^#' .env | xargs)
fi

# Define templates and output files
TEMPLATE_PORTFOLIO="nginx/templates/portfolio.conf.template"
OUTPUT_PORTFOLIO="nginx/portfolio.conf"

TEMPLATE_SUAC_GRAD="nginx/templates/suac-grad.conf.template"
OUTPUT_SUAC_GRAD="suac-grad.conf"

TEMPLATE_SUAC_TOOL="nginx/templates/suac-tool.conf.template"
OUTPUT_SUAC_TOOL="nginx/suac-tool.conf"

echo "Generating $OUTPUT_PORTFOLIO..."

# Check required variables
if [ -z "${CMS_DOMAIN_PROD}" ]; then
  echo "Warning: Variable CMS_DOMAIN_PROD is empty or not set."
fi
if [ -z "${PF_DOMAIN_PROD}" ]; then
  echo "Warning: Variable PF_DOMAIN_PROD is empty or not set."
fi
if [ -z "${PROD_ROOT_DOMAIN}" ]; then
  echo "Warning: Variable PROD_ROOT_DOMAIN is empty or not set."
fi

# Copy template to output
cp "$TEMPLATE_PORTFOLIO" "$OUTPUT_PORTFOLIO"

# Replace variables using sed
# Note: Using | as delimiter to avoid issues with / in variables (though domains usually valid)
# However, ALLOW_IP_* might contain slashes (CIDR).
# Escape slashes in variables for sed if using / delimiter, or use different delimiter.
# We will use | as delimiter assuming values don't contain |.

# Escape special characters in variables (like / in CIDR)
ALLOW_IP_DOCKER_ESCAPED=$(echo "$ALLOW_IP_DOCKER" | sed 's/\//\\\//g')

# Apply substitutions
# We match ${VAR_NAME} explicitly
sed -i "s/\${CMS_DOMAIN_PROD}/${CMS_DOMAIN_PROD}/g" "$OUTPUT_PORTFOLIO"
sed -i "s/\${CMS_DOMAIN_DEMO}/${CMS_DOMAIN_DEMO}/g" "$OUTPUT_PORTFOLIO"
sed -i "s/\${PF_DOMAIN_PROD}/${PF_DOMAIN_PROD}/g" "$OUTPUT_PORTFOLIO"
sed -i "s/\${PF_DOMAIN_DEMO}/${PF_DOMAIN_DEMO}/g" "$OUTPUT_PORTFOLIO"
sed -i "s/\${PROD_ROOT_DOMAIN}/${PROD_ROOT_DOMAIN}/g" "$OUTPUT_PORTFOLIO"
sed -i "s/\${ALLOW_IP_HOME}/${ALLOW_IP_HOME}/g" "$OUTPUT_PORTFOLIO"
sed -i "s/\${ALLOW_IP_VPS}/${ALLOW_IP_VPS}/g" "$OUTPUT_PORTFOLIO"
sed -i "s/\${ALLOW_IP_DOCKER}/${ALLOW_IP_DOCKER_ESCAPED}/g" "$OUTPUT_PORTFOLIO"
sed -i "s/\${ALLOW_IP_SCHOOL}/${ALLOW_IP_SCHOOL}/g" "$OUTPUT_PORTFOLIO"


echo "Generating $OUTPUT_SUAC_GRAD..."
cp "$TEMPLATE_SUAC_GRAD" "$OUTPUT_SUAC_GRAD"
sed -i "s/\${EDITOR_APP_DOMAIN}/${EDITOR_APP_DOMAIN}/g" "$OUTPUT_SUAC_GRAD"
# Apply IP rules to suac-grad too if needed (it matches logic in portfolio.conf)
sed -i "s/\${ALLOW_IP_HOME}/${ALLOW_IP_HOME}/g" "$OUTPUT_SUAC_GRAD"
sed -i "s/\${ALLOW_IP_VPS}/${ALLOW_IP_VPS}/g" "$OUTPUT_SUAC_GRAD"
sed -i "s/\${ALLOW_IP_DOCKER}/${ALLOW_IP_DOCKER_ESCAPED}/g" "$OUTPUT_SUAC_GRAD"
sed -i "s/\${ALLOW_IP_SCHOOL}/${ALLOW_IP_SCHOOL}/g" "$OUTPUT_SUAC_GRAD"


if [ -f "$TEMPLATE_SUAC_TOOL" ]; then
    echo "Generating $OUTPUT_SUAC_TOOL..."
    cp "$TEMPLATE_SUAC_TOOL" "$OUTPUT_SUAC_TOOL"
    sed -i "s/\${SUAC_TOOL_DOMAIN}/${SUAC_TOOL_DOMAIN}/g" "$OUTPUT_SUAC_TOOL"
fi

echo "Configuration files generated."
