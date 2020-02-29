set -e

branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
if [ "$branch" == "issue-81" ]
then
    npm run run-doc
fi