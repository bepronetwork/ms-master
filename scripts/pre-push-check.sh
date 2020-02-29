set -e

branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
if [ "$branch" == "master" ]
then
    npm run heroku-doc
fi