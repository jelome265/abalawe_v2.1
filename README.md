<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3a8296,100:091519&height=150&text=Abalawe%20E-commerce&fontSize=50&fontColor=61DAFB&fontAlignY=45&animation=twinkling&section=header" />

# 🌐 **Abalawe E-commerce**

**High-performance. Secure. Production-grade.**

A modern e-commerce platform built with **Next.js**, **Supabase**, and **Stripe**, engineered for speed, scalability, and enterprise-level security.

---

# 🏷️ **Badges**

<p align="left">
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/deploy-Vercel-black?style=for-the-badge&logo=vercel" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/framework-Next.js-grey?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/database-Supabase-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/security-OWASP%20Hardened-red?style=for-the-badge" />
</p>

---

# 📚 **Table of Contents**

* [Overview](#-overview)
* [Features](#-features)
* [Tech Architecture](#-tech-architecture)
* [Getting Started](#-getting-started)
* [Deployment](#-deployment)
* [Security](#-security)

---

# 🔎 **Overview**

Abalawe E-commerce is a next-generation, security-focused, fast e-commerce platform using the latest capabilities of **Next.js App Router**, **Supabase**, and **Stripe** to deliver a production-grade shopping experience.

---

# 🚀 **Features**

## 🔐 **Security**

* Comprehensive **OWASP Top 10** mitigation
* Hardened **CSP**, **secure HTTP headers**, and API protection
* Supabase Auth for role-based access
* PCI-compliant Stripe payment workflow

## ⚡ **Performance**

* Mobile-first optimization
* SSR & ISR with Next.js App Router
* Image optimization + caching
* Minimal bundle footprint

## 🧱 **Tech Stack**

* **Next.js 14** (App Router)
* **Tailwind CSS**
* **Supabase (Auth, DB, Storage)**
* **Stripe Checkout + Webhooks**
* **Vercel CI/CD**

---

# 🏗️ **Tech Architecture**

```
                        ┌─────────────────────────┐
                        │        Client UI        │
                        │  Next.js + Tailwind CSS │
                        └─────────────┬───────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   │                                     │
        ┌──────────▼───────────┐              ┌──────────▼──────────┐
        │   Next.js API Route  │              │ Webhooks (paychangu) │
        │  (Auth, Checkout, DB │              │   Secure Events      │
        └──────────┬───────────┘              └──────────┬──────────┘
                   │                                     │
         ┌─────────▼──────────┐                ┌─────────▼──────────┐
         │     Supabase DB    │                │       paychang      │
         │ (Products, Orders, │                │   Payments/Invoices │
         │    Users, etc.)    │                └─────────────────────┘
         └─────────┬──────────┘
                   │
        ┌──────────▼───────────┐
        │  Supabase Storage     │
        │ (Product Images/Files)│
        └───────────────────────┘
```

---

# 🛠️ **Getting Started**

### **1. Clone the Repository**

```bash
git clone <repo-url>
cd abalawe_v2.1
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Configure Environment Variables**

Copy and configure environment keys:

```bash
cp .env.example .env.local
```

Add:

* Supabase URL & keys
* Supabase Storage bucket
* Stripe public & secret keys
* Webhook signing secret
* NEXT_PRIVATE_* variables

### **4. Run Development Server**

```bash
npm run dev
```

---

# 🚢 **Deployment**

* Hosted on **Vercel**
* Automatic builds from `main` branch
* Production previews for pull requests
* Environment variables synced securely

---

# 🛡️ **Security**

To report vulnerabilities, contact:

📧 **[security@abalawe.com](mailto:security@abalawe.com)**

We follow responsible disclosure guidelines.

