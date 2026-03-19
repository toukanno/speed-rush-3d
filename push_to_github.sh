#!/bin/bash
# Speed Rush 3D - GitHubプッシュスクリプト
# このスクリプトをrace-game-3dフォルダ内で実行してください

cd "$(dirname "$0")"

# Git初期化
git init
git checkout -b main

# 全ファイルを追加
git add .
git commit -m "Initial commit: Speed Rush 3D - React Native 3D Racing Game"

# リモート設定 (既存のpackage.jsonコミットを上書き)
git remote add origin https://github.com/toukanno/speed-rush-3d.git
git push -u origin main --force

echo ""
echo "✅ プッシュ完了！"
echo "🔗 https://github.com/toukanno/speed-rush-3d"
