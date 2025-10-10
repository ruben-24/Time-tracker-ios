# ⏰ Work Time Tracker - Web Version

Aplicație web modernă pentru contorizarea orelor de lucru și pauzelor, optimizată pentru browser.

## ✨ Caracteristici

### 🎨 Design Modern
- **Interface glassmorphism** cu efecte de blur și transparență
- **Tema dark/light** cu tranziții fluide
- **Design responsive** optimizat pentru toate dispozitivele
- **PWA** - poate fi instalată ca aplicație nativă

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

## 🚀 Instalare și Rulare

### Cerințe
- Node.js 18+ 
- npm sau yarn

### Pași de instalare

1. **Instalează dependențele**
```bash
npm install
```

2. **Rulează aplicația în modul dezvoltare**
```bash
npm run dev
```

3. **Deschide browser-ul**
```
http://localhost:3000
```

### Comenzi disponibile

```bash
# Dezvoltare
npm run dev

# Build pentru producție
npm run build

# Preview build-ul de producție
npm run preview

# Deploy local
./deploy.sh
```

## 📱 PWA (Progressive Web App)

Aplicația poate fi instalată ca o aplicație nativă pe orice dispozitiv:

### Instalare pe Desktop
1. Deschide aplicația în Chrome/Edge
2. Click pe iconița de instalare din bara de adrese
3. Confirmă instalarea

### Instalare pe Mobile
1. Deschide aplicația în Safari (iOS) sau Chrome (Android)
2. Tap pe "Adaugă la ecranul principal"
3. Confirmă instalarea

## 🌐 Deployment

### Vercel (Recomandat)
```bash
# Instalează Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Upload folderul dist/ la Netlify
```

### GitHub Pages
```bash
# Build
npm run build

# Push la branch-ul gh-pages
```

## 🎯 Utilizare

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

## 🔧 Configurare

### Variabile de Mediu
Creează un fișier `.env` pentru configurații:

```env
VITE_APP_NAME="Work Time Tracker"
VITE_APP_VERSION="1.0.0"
VITE_API_URL="https://api.example.com"
```

### Personalizare
- **Culori**: Modifică `tailwind.config.js`
- **Tema**: Editează `src/style.css`
- **Funcționalități**: Modifică store-urile din `src/stores/`

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🚀 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 📞 Suport

Pentru întrebări sau suport:
- **GitHub Issues**: [Creează un issue](https://github.com/username/work-time-tracker/issues)
- **Email**: support@worktimetracker.com

---

**Work Time Tracker Web** - Contorizarea orelor de lucru, optimizată pentru web! ⏰🌐✨# Deploy trigger
