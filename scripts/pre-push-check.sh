set -e

branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
if [ "$branch" == "issue-81" ]
then
    # sudo npm install -g npx
    # sudo npm i docsify-cli -g
    # sudo npm run heroku-doc
    date > time.tm
    git add .
    git commit -am 'update document'
fi