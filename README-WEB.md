# ⏰ Work Time Tracker - Versiuni Multiple

Aplicație modernă pentru contorizarea orelor de lucru și pauzelor, disponibilă în două versiuni:

## 📱 Versiuni Disponibile

### 1. **iOS App** (Sideload)
- **Locație**: `ios/` (aplicația originală)
- **Instalare**: Prin sideload pe iPhone/iPad
- **Caracteristici**: Aplicație nativă iOS cu toate funcționalitățile

### 2. **Web App** (Browser)
- **Locație**: `web-app/` (versiunea web)
- **Instalare**: Acces direct în browser sau ca PWA
- **Caracteristici**: Aplicație web optimizată cu PWA support

## 🚀 Instalare Rapidă

### Pentru iOS (Sideload)
```bash
cd ios/
./create-ipa.sh
# Instalează .ipa cu AltStore sau Sideloadly
```

### Pentru Web (Browser)
```bash
cd web-app/
npm install
npm run dev
# Deschide http://localhost:3000
```

## ✨ Caracteristici Comune

### 🎨 Design Modern
- **Interface glassmorphism** cu efecte de blur
- **Tema dark/light** cu tranziții fluide
- **Design responsive** pentru toate dispozitivele
- **Animații smooth** și micro-interacțiuni

### ⏰ Contorizare Timp Avansată
- **Start/Stop pentru lucru** cu un click
- **Pauze personalizabile** (pauză scurtă, pauză de masă)
- **Sesiuni multiple** pe zi cu tracking automat
- **Proiecte personalizabile** cu culori și descrieri
- **Notițe** pentru fiecare sesiune de lucru

### 📊 Timesheet și Rapoarte
- **Timesheet zilnic/săptămânal** cu detalii complete
- **Statistici în timp real** pentru orele lucrate
- **Grafice interactive** pentru vizualizarea productivității
- **Rapoarte detaliate** cu insight-uri de productivitate

## 🔧 Tehnologii

### iOS App
- **Vue.js 3** + TypeScript
- **Capacitor** pentru iOS
- **Tailwind CSS** pentru styling
- **Pinia** pentru state management

### Web App
- **Vue.js 3** + TypeScript
- **Vite** pentru build
- **Tailwind CSS** pentru styling
- **PWA** support cu service worker

## 📱 Utilizare

### 1. Dashboard
- **Vizualizare generală** a orelor de lucru
- **Statistici rapide** pentru zi/săptămână
- **Sesiunea curentă** cu timer în timp real
- **Acțiuni rapide** pentru start/stop/pauză

### 2. Contorizare Timp
- **Start/Stop lucru** cu selectare proiect
- **Pauze personalizabile** (pauză scurtă, pauză de masă)
- **Timer în timp real** cu afișare durată
- **Pauză/Continuă** sesiuni active

### 3. Timesheet
- **Tabel detaliat** cu toate sesiunile
- **Filtrare** pe perioade (zi/săptămână/lună)
- **Căutare** în sesiuni și proiecte
- **Rezumat zilnic** cu orele lucrate

### 4. Rapoarte
- **Grafice interactive** pentru tendințe
- **Distribuție pe proiecte** cu procentaje
- **Statistici detaliate** de productivitate
- **Insight-uri automate** și recomandări

### 5. Setări
- **Configurare program de lucru**
- **Gestionare proiecte** cu rate orare
- **Setări notificări** pentru pauze
- **Personalizare temă** și aspect

## 🌐 Deployment Web

### Vercel (Recomandat)
```bash
cd web-app/
npm i -g vercel
vercel --prod
```

### Netlify
```bash
cd web-app/
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
cd web-app/
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## 📊 Comparație Versiuni

| Caracteristică | iOS App | Web App |
|----------------|---------|---------|
| **Instalare** | Sideload | Browser/PWA |
| **Performance** | Nativa | Optimizată |
| **Offline** | Da | Da (PWA) |
| **Notificări** | Da | Da (PWA) |
| **Update** | Manual | Automat |
| **Cross-platform** | iOS | Toate |

## 🎯 Recomandări

### Pentru iOS
- **Folosește iOS App** dacă vrei performanță maximă
- **Ideal pentru** utilizare zilnică pe iPhone/iPad
- **Avantaje**: Notificări native, performanță optimă

### Pentru Web
- **Folosește Web App** pentru acces universal
- **Ideal pentru** utilizare pe orice dispozitiv
- **Avantaje**: Accesibil din orice browser, PWA support

## 📞 Suport

Pentru întrebări sau suport:
- **GitHub Issues**: [Creează un issue](https://github.com/username/work-time-tracker/issues)
- **Email**: support@worktimetracker.com

---

**Work Time Tracker** - Contorizarea orelor de lucru, disponibilă pe toate platformele! ⏰📱🌐✨