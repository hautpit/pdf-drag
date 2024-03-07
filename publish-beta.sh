echo Your current version: && npm view pdf-drag version && echo Please input new version:
read version
# npm install -g json
json -I -f package.json -e "this.version=\"${version}\""
npm publish --tag beta