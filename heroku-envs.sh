#!/usr/bin/env bash
heroku login

echo "==========================================="
echo "⚙ ENTER THE APP NAME OF HEROKU:"
read app_name
echo "==========================================="

heroku config:set $(cat ./variables/.env | sed '/^$/d; /#[[:print:]]*$/d') --app $app_name

heroku info --app $app_name