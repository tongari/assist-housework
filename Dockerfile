# 親イメージとして公式イメージを使う
FROM node:10

# vimを使えるようにする
RUN apt-get update -qq && apt-get install -y vim

# Firebase CLIをインストール
RUN npm install -g firebase-tools
