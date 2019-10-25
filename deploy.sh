package_version_tag=$(jq -r '.version' package.json)

git add .
git commit -m "npm deploy $package_version_tag"
git tag $package_version_tag

git push origin $package_version_tag