# Speed Rush 3D

React Native (Expo) + Three.js で作った3Dレーシングゲーム。

## 概要

スマートフォン向けの3Dレースゲーム。Three.js による3DレンダリングをExpo GLで実現し、タッチ操作で車を操縦してレースを楽しめる。

## 技術スタック

- **React Native** 0.76 + **Expo** SDK 52
- **Three.js** (expo-three / expo-gl) - 3Dレンダリング
- **react-native-gesture-handler** - タッチ操作

## プロジェクト構成

```
src/
  screens/    - メニュー / ゲーム / リザルト画面
  components/ - コントロールUI / HUD
  game/       - コース生成 / レースエンジン / 車モデル
  utils/      - 定数・ユーティリティ
assets/       - アイコン・スプラッシュ画像
```

## セットアップ

```bash
npm install
npx expo start
```

## 操作方法

| ボタン | 機能 |
|--------|------|
| 左 / 右 | ステアリング |
| 緑 | アクセル |
| 赤 | ブレーキ |

## ビルド・リリース

詳細は [BUILD_GUIDE.md](BUILD_GUIDE.md) を参照。
