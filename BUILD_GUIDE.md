# Speed Rush 3D - ビルド＆リリースガイド

## セットアップ

```bash
cd race-game-3d
npm install
```

## 開発・テスト

```bash
# Expo開発サーバー起動
npx expo start

# iOS シミュレータで起動
npx expo start --ios

# Android エミュレータで起動
npx expo start --android
```

## ビルド（EAS Build）

### 1. EAS CLIインストール
```bash
npm install -g eas-cli
eas login
```

### 2. EAS設定
```bash
eas build:configure
```

### 3. iOSビルド
```bash
# 開発用
eas build --platform ios --profile development

# 本番用（App Store提出用）
eas build --platform ios --profile production
```

### 4. Androidビルド
```bash
# APK（テスト用）
eas build --platform android --profile preview

# AAB（Google Play提出用）
eas build --platform android --profile production
```

## ストア提出

### iOS (App Store)
```bash
eas submit --platform ios
```

### Android (Google Play)
```bash
eas submit --platform android
```

## app.jsonの設定済み内容
- アプリ名: Speed Rush 3D
- iOS Bundle ID: com.masa.speedrush3d
- Android Package: com.masa.speedrush3d
- 画面向き: 横向き固定（landscape）
- テーマ: ダーク

## 操作方法
- 左ボタン / 右ボタン: ステアリング
- 緑ボタン: アクセル
- 赤ボタン: ブレーキ
