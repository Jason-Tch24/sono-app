# 🚀 Déploiement sur Vercel - Sono Église

## ❌ Erreur Actuelle

```
Error: supabaseUrl is required
```

**Cause** : Les variables d'environnement ne sont pas configurées sur Vercel.

---

## ✅ Solution : Configurer les Variables d'Environnement

### Étape 1 : Aller sur Vercel Dashboard

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous
3. Sélectionnez votre projet **sono-app** (ou le nom que vous avez donné)

### Étape 2 : Ajouter les Variables d'Environnement

1. Cliquez sur **Settings** (en haut)
2. Dans le menu de gauche, cliquez sur **Environment Variables**
3. Ajoutez les 2 variables suivantes :

#### Variable 1 : NEXT_PUBLIC_SUPABASE_URL

- **Key** : `NEXT_PUBLIC_SUPABASE_URL`
- **Value** : `https://mnkemkxphsskmnzjoesr.supabase.co`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

#### Variable 2 : NEXT_PUBLIC_SUPABASE_ANON_KEY

- **Key** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ua2Vta3hwaHNza21uempvZXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTE2MTMsImV4cCI6MjA4NDI2NzYxM30.wbCjadzW-b5jHTiETeiUSdw9k_y839diKG4Bv9zaTjg`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **Save**

### Étape 3 : Redéployer

1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points** (•••) du dernier déploiement
3. Cliquez sur **Redeploy**
4. Cochez **Use existing Build Cache** (optionnel)
5. Cliquez sur **Redeploy**

---

## 🎯 Méthode Alternative : Via CLI

Si vous préférez utiliser la ligne de commande :

```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Se connecter
vercel login

# Ajouter les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Coller : https://mnkemkxphsskmnzjoesr.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Coller : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ua2Vta3hwaHNza21uempvZXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTE2MTMsImV4cCI6MjA4NDI2NzYxM30.wbCjadzW-b5jHTiETeiUSdw9k_y839diKG4Bv9zaTjg

# Redéployer
vercel --prod
```

---

## 📋 Checklist de Vérification

Après avoir ajouté les variables et redéployé :

- [ ] Les 2 variables sont bien dans Settings → Environment Variables
- [ ] Les variables sont activées pour Production, Preview et Development
- [ ] Le redéploiement est terminé (statut "Ready")
- [ ] L'application se charge sans erreur
- [ ] La page de connexion s'affiche correctement

---

## 🔍 Vérifier que ça Fonctionne

1. Allez sur votre URL Vercel (ex: `https://sono-app.vercel.app`)
2. Vous devriez voir la page de connexion
3. Essayez de vous connecter avec :
   - Email : `sonoriste@eglise.com`
   - Password : (celui que vous avez défini dans Supabase)

---

## ❓ Problèmes Courants

### "Error: supabaseUrl is required" persiste

**Solution** : 
1. Vérifiez que les variables sont bien enregistrées
2. Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
3. Redéployez complètement (pas juste un rebuild)

### "Invalid login credentials"

**Solution** :
1. Vérifiez que l'utilisateur existe dans Supabase → Authentication → Users
2. Vérifiez que l'utilisateur est aussi dans la table `public.users`
3. Vérifiez que le mot de passe est correct

### Page blanche

**Solution** :
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs
3. Vérifiez les logs Vercel : Deployments → Votre déploiement → Runtime Logs

---

## 📊 Résumé

**Problème** : Variables d'environnement manquantes sur Vercel  
**Solution** : Ajouter les 2 variables dans Settings → Environment Variables  
**Temps** : 2 minutes  

---

## 🎉 Une fois Déployé

Votre application sera accessible sur :
- **Production** : `https://votre-app.vercel.app`
- **Preview** : Une URL unique pour chaque commit/PR

---

**Bon déploiement ! 🚀**

