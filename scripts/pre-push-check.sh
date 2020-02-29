set -e

branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
if [ "$branch" == "issue-81" ]
then
    sudo npm i docsify-cli@4.4.0 -g
    npm run run-doc
    date > time.tm
    git add .
    git commit -am 'update document'
fi