# Commandes Utiles - Sono Église

## 🚀 Développement

### Installer les dépendances
```bash
npm install
```

### Lancer le serveur de développement
```bash
npm run dev
```
→ Ouvre l'application sur http://localhost:3000

### Build de production
```bash
npm run build
```

### Lancer en production
```bash
npm run start
```

### Linter
```bash
npm run lint
```

---

## 🗄️ Supabase - Requêtes Rapides

### Voir tous les services
```sql
SELECT * FROM public.services ORDER BY date DESC;
```

### Voir le dernier service créé
```sql
SELECT * FROM public.services ORDER BY created_at DESC LIMIT 1;
```

### Compter les services par statut
```sql
SELECT status, COUNT(*) FROM public.services GROUP BY status;
```

### Voir tous les incidents
```sql
SELECT 
  i.*,
  s.date as service_date
FROM public.incidents i
JOIN public.services s ON i.service_id = s.id
ORDER BY i.created_at DESC;
```

### Réinitialiser un service (le remettre en cours)
```sql
UPDATE public.services 
SET status = 'en_cours' 
WHERE id = 'SERVICE_ID';
```

### Supprimer un service
```sql
DELETE FROM public.services WHERE id = 'SERVICE_ID';
```

---

## 🔧 Dépannage

### Réinstaller les dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

### Nettoyer le cache Next.js
```bash
rm -rf .next
npm run dev
```

### Vérifier les variables d'environnement
```bash
cat .env.local
```

### Tester la connexion Supabase
Créer un fichier `test-supabase.js` :
```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase.from('users').select('*')
  console.log('Data:', data)
  console.log('Error:', error)
}

test()
```

Puis :
```bash
node test-supabase.js
```

---

## 📦 Git

### Initialiser le dépôt
```bash
git init
git add .
git commit -m "Initial commit - MVP Sono Église"
```

### Créer un dépôt GitHub
```bash
# Créer le repo sur github.com puis :
git remote add origin https://github.com/votre-username/sono-eglise.git
git branch -M main
git push -u origin main
```

---

## 🚀 Déploiement Vercel

### Installer Vercel CLI
```bash
npm i -g vercel
```

### Premier déploiement
```bash
vercel
```

### Déploiement en production
```bash
vercel --prod
```

### Ajouter les variables d'environnement
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Ou via le dashboard Vercel :
1. Aller sur vercel.com
2. Sélectionner votre projet
3. Settings → Environment Variables
4. Ajouter les variables

---

## 🔍 Debugging

### Voir les logs du serveur
Les logs s'affichent dans le terminal où vous avez lancé `npm run dev`

### Voir les logs du navigateur
1. Ouvrir les DevTools (F12)
2. Onglet "Console"

### Voir les logs Supabase
1. Aller sur supabase.com
2. Sélectionner votre projet
3. Logs → Query Logs / API Logs

### Activer le mode debug Next.js
```bash
NODE_OPTIONS='--inspect' npm run dev
```

---

## 📊 Statistiques du Projet

### Compter les lignes de code
```bash
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l
```

### Taille du projet
```bash
du -sh .
```

### Taille de node_modules
```bash
du -sh node_modules
```

---

## 🧪 Tests Manuels

### Checklist de test
```bash
# 1. Connexion
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"sonoriste@eglise.com","password":"password"}'

# 2. Vérifier que le serveur répond
curl http://localhost:3000

# 3. Vérifier les variables d'environnement
echo $NEXT_PUBLIC_SUPABASE_URL
```

---

## 🔄 Mise à jour des dépendances

### Vérifier les mises à jour
```bash
npm outdated
```

### Mettre à jour toutes les dépendances
```bash
npm update
```

### Mettre à jour une dépendance spécifique
```bash
npm install @supabase/supabase-js@latest
```

---

## 📝 Backup

### Exporter la base de données Supabase
1. Aller sur supabase.com
2. Database → Backups
3. Télécharger le backup

### Backup manuel (SQL)
```sql
-- Dans Supabase SQL Editor
COPY (SELECT * FROM public.services) TO '/tmp/services.csv' CSV HEADER;
COPY (SELECT * FROM public.remarks) TO '/tmp/remarks.csv' CSV HEADER;
COPY (SELECT * FROM public.incidents) TO '/tmp/incidents.csv' CSV HEADER;
```

---

## 🎯 Raccourcis Utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer en dev |
| `Ctrl+C` | Arrêter le serveur |
| `npm run build` | Build production |
| `npm run start` | Lancer en prod |
| `npm run lint` | Vérifier le code |

---

## 💡 Astuces

1. **Hot Reload** : Next.js recharge automatiquement les changements
2. **TypeScript** : Les erreurs s'affichent dans le terminal
3. **Tailwind** : Utilisez l'extension VSCode "Tailwind CSS IntelliSense"
4. **Supabase** : Utilisez l'extension VSCode "Supabase"

---

*Pour plus d'informations, consultez README.md et GUIDE-DEMARRAGE.md*

