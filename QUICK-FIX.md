# 🔧 Correction Rapide - Erreur Vercel

## ❌ Erreur

```
Error: supabaseUrl is required
```

## ✅ Solution (2 minutes)

### 1. Aller sur Vercel
- Ouvrir https://vercel.com
- Cliquer sur votre projet

### 2. Ajouter les Variables
Settings → Environment Variables → Add

**Variable 1:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://mnkemkxphsskmnzjoesr.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ua2Vta3hwaHNza21uempvZXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTE2MTMsImV4cCI6MjA4NDI2NzYxM30.wbCjadzW-b5jHTiETeiUSdw9k_y839diKG4Bv9zaTjg
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3. Redéployer
Deployments → ••• → Redeploy

---

**C'est tout ! ✅**

Pour plus de détails : [DEPLOIEMENT-VERCEL.md](DEPLOIEMENT-VERCEL.md)

