# 📱 Modern Data Manager - iOS Build

## 🚀 Instrucțiuni pentru Sideload

Aplicația iOS este pregătită pentru instalare prin sideload. Iată cum să o instalezi:

### 📋 Cerințe
- **macOS** cu Xcode instalat
- **Apple Developer Account** (gratuit sau plătit)
- **iPhone/iPad** cu iOS 13.0 sau mai nou
- **AltStore** sau **Sideloadly** pentru instalare

### 🔧 Pași de Build

#### 1. **Build Automat (Recomandat)**
```bash
./build-ios.sh
```

#### 2. **Build Manual**
```bash
# Build web assets
npm run build

# Sync with Capacitor
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### 📱 Instalare pe iPhone/iPad

#### Opțiunea 1: AltStore (Recomandat)
1. **Instalează AltStore** pe Mac
2. **Conectează iPhone-ul** la Mac
3. **Trust computer** pe iPhone
4. **Drag & drop** fișierul `.ipa` în AltStore
5. **Instalează** aplicația

#### Opțiunea 2: Sideloadly
1. **Descarcă Sideloadly** de pe site-ul oficial
2. **Conectează iPhone-ul** la Mac
3. **Selectează** fișierul `.ipa`
4. **Introdu** Apple ID-ul
5. **Instalează** aplicația

#### Opțiunea 3: Xcode (Pentru dezvoltatori)
1. **Deschide** `ios/App/App.xcworkspace` în Xcode
2. **Selectează** device-ul tău
3. **Configurează** signing cu Apple ID-ul tău
4. **Build & Run** direct pe device

### ⚙️ Configurare Signing

În Xcode:
1. **Selectează** proiectul "App"
2. **Mergi** la "Signing & Capabilities"
3. **Bifează** "Automatically manage signing"
4. **Selectează** Team-ul tău Apple Developer
5. **Schimbă** Bundle Identifier dacă este necesar

### 📦 Fișiere Generate

După build, vei avea:
- `ios/build/App.ipa` - Fișierul pentru instalare
- `ios/App/App.xcworkspace` - Proiectul Xcode
- `ios/App/App/public/` - Assets-urile web

### 🔒 Securitate și Permisiuni

Aplicația include:
- **HTTPS** pentru toate conexiunile
- **No arbitrary loads** pentru securitate
- **Background processing** pentru sincronizare
- **URL schemes** pentru deep linking

### 🐛 Debugging

Pentru debugging:
```bash
# Verifică log-urile
npx cap run ios --livereload

# Sync rapid
npx cap sync ios

# Clean build
npx cap clean ios
```

### 📱 Caracteristici Mobile

Aplicația include:
- **Splash screen** personalizat
- **Status bar** colorată
- **Orientation** suport (portrait + landscape)
- **Background modes** pentru sincronizare
- **Deep linking** pentru notificări

### 🎨 Personalizare

Pentru a personaliza:
1. **Iconițe**: Înlocuiește fișierele din `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. **Splash Screen**: Modifică `ios/App/App/Assets.xcassets/Splash.imageset/`
3. **Numele aplicației**: Schimbă în `ios/App/App/Info.plist`
4. **Bundle ID**: Modifică în `capacitor.config.ts`

### 🚀 Deploy

Pentru a distribui aplicația:
1. **Archive** în Xcode
2. **Export** ca Development/Ad Hoc/Distribution
3. **Distribuie** prin TestFlight sau direct

### 📞 Suport

Dacă întâmpini probleme:
1. **Verifică** că Xcode este actualizat
2. **Clean** proiectul (`npx cap clean ios`)
3. **Re-sync** assets-urile (`npx cap sync ios`)
4. **Verifică** signing-ul în Xcode

---

**Modern Data Manager** - Gestionarea datelor, acum și pe iOS! 📱✨