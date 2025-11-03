# 🧩 Mini CRM Backend

Un **Mini CRM (Customer Relationship Management)** développé avec **Express.js** et **MongoDB**.  
Ce projet permet à une entreprise de gérer ses **clients, devis, factures, utilisateurs** et de visualiser ses **statistiques** dans un tableau de bord simple.

---

## 🚀 Fonctionnalités principales

- 🔐 **Authentification sécurisée**
  - Gestion des rôles : `Admin` et `Employé`
  - Authentification via **JWT** et cookies

- 👥 **Gestion des clients**
  - Ajouter, modifier, supprimer et rechercher des clients

- 📄 **Gestion des devis**
  - Créer, modifier et exporter les devis en PDF  
  - Suivre le statut : *brouillon, envoyé, accepté, refusé*

- 💰 **Gestion des factures**
  - Génération automatique depuis un devis accepté  
  - Statuts : *non payée, partiellement payée, payée*  
  - Export PDF

- 📊 **Tableau de bord**
  - Nombre de clients, devis, factures  
  - Montant total facturé et payé  
  - Graphiques mensuels

- 🔔 **Notifications**
  - Alertes pour les factures en retard et devis en attente

---

## 🛠️ Technologies utilisées

| Outil / Librairie | Rôle |
|--------------------|------|
| **Node.js** | Environnement d'exécution JavaScript |
| **Express.js** | Framework backend |
| **MongoDB / Mongoose** | Base de données NoSQL |
| **JWT** | Authentification |
| **Bcrypt** | Hachage des mots de passe |
| **dotenv** | Gestion des variables d'environnement |
| **morgan** | Logging |
| **cors** | Gestion des accès CORS |
| **cookie-parser** | Gestion des cookies |

---

## 📁 Structure du projet


---

## ⚙️ Installation et configuration

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/<votre-utilisateur>/mini-crm-backend.git
cd mini-crm-backend 
```
### 2️⃣ Installer les dépendances
```bash
npm install
```
### 3️⃣ Créer le fichier .env
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/mini-crm
JWT_SECRET=supersecretkey
```
### ▶️ Lancer le serveur
```bash
npm run dev
```

## 🧠 Test rapide
Quand le serveur démarre, tu devrais voir dans le terminal :

```bash
✅ MongoDB connected
🚀 Server running on port 5000
```
