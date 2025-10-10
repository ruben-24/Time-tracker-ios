# ⏰ Time Tracker Pro

O aplicație modernă de urmărire a timpului de lucru, optimizată pentru iOS și dezvoltată cu Vanilla JavaScript.

## 🚀 Caracteristici

- **Timer în timp real** - Urmărește timpul de lucru cu precizie
- **Dual location support** - Suport pentru două locații diferite
- **Pauze inteligente** - Gestionează pauzele cu ușurință
- **Introducere manuală** - Adaugă sesiuni manual cu validare completă
- **Istoric detaliat** - Vezi toate sesiunile de lucru
- **Backup & Restore** - Exportă și importă datele
- **Optimizat pentru iOS** - Tastatura rămâne deschisă pe iOS
- **Design modern** - Interfață frumoasă cu gradient și glassmorphism

## 📱 Compatibilitate

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Desktop browsers
- ✅ Capacitor (pentru aplicații mobile)

## 🛠️ Instalare

### Opțiunea 1: Deschide direct
```bash
# Clonează repository-ul
git clone https://github.com/your-username/time-tracker-ios.git
cd time-tracker-ios

# Deschide index.html în browser
open index.html
```

### Opțiunea 2: Server local
```bash
# Clonează repository-ul
git clone https://github.com/your-username/time-tracker-ios.git
cd time-tracker-ios

# Rulează server local
npm start
# sau
python3 -m http.server 8080

# Deschide http://localhost:8080
```

## 📖 Utilizare

### Timer de bază
1. **Selectează locația** - Alege între Locația 1 și Locația 2
2. **Începe lucrul** - Apasă "▶️ Începe Lucrul"
3. **Pauză** - Apasă "⏸️ Pauză" când ai nevoie
4. **Reia** - Apasă "▶️ Reia Lucrul" după pauză
5. **Încheie** - Apasă "⏹️ Încheie Programul" la sfârșitul zilei

### Introducere manuală
1. **Deschide modalul** - Apasă "✍️ Adaugă Manual"
2. **Completează datele** - Data, ora start, ora final, locația
3. **Adaugă pauze** - Opțional, adaugă pauze cu butonul "+ Adaugă Pauză"
4. **Salvează** - Apasă "💾 Salvează"

### Istoric și setări
- **Istoric** - Vezi toate sesiunile de lucru
- **Setări** - Exportă/importă date, resetează sesiunea

## 🔧 Dezvoltare

Aplicația este construită cu:
- **Vanilla JavaScript** - Fără framework-uri
- **CSS3** - Stiluri moderne cu gradient și glassmorphism
- **HTML5** - Structură semantică
- **LocalStorage** - Persistența datelor

## 📱 Pentru iOS

Aplicația este optimizată special pentru iOS:
- **Tastatura persistentă** - Nu mai dispare când introduci date
- **Input-uri optimizate** - CSS special pentru Safari
- **Touch-friendly** - Butoane mari și ușor de apăsat
- **Responsive design** - Se adaptează la toate dimensiunile de ecran

## 🚀 Capacitor (Opțional)

Pentru a crea o aplicație mobile nativă:

```bash
# Instalează Capacitor
npm install -g @capacitor/cli

# Adaugă platforma iOS
npx cap add ios

# Build și sync
npx cap sync
npx cap open ios
```

## 📄 Licență

MIT License - vezi fișierul LICENSE pentru detalii.

## 🤝 Contribuții

Contribuțiile sunt binevenite! Te rugăm să:
1. Fork repository-ul
2. Creează o branch pentru feature-ul tău
3. Commit modificările
4. Push la branch
5. Deschide un Pull Request

## 📞 Suport

Pentru întrebări sau probleme, deschide un issue pe GitHub.

---

**Dezvoltat cu ❤️ pentru iOS**