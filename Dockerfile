# 親イメージとして公式イメージを使う
FROM node:10

# vimを使えるようにする
RUN apt-get update -qq && apt-get install -y vim

# javaのインストール（firebase emulatorsで使う）
RUN apt-get install -y openjdk-8-jre

# Firebase CLIをインストール
RUN npm install -g firebase-tools
