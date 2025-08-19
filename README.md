# NULLIFY: The Open-Source Clerk Killer

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![GitHub stars](https://img.shields.io/github/stars/Esrbwt1/nullify?style=social)

**Stop paying for users. Own your auth. NULLIFY is the open-source, self-hosted alternative to Clerk, designed to save you thousands and give you back control.**

---

### The War on Per-User Pricing

Services like Clerk punish you for success. As your user base grows, they present you with an ever-increasing bill. A startup with 250,000 users faces a bill of **$4,900/month**. This is not a service; it is extortion. NULLIFY is the end of this business model.

| Feature                  | Clerk                               | NULLIFY                            |
| ------------------------ | ----------------------------------- | ---------------------------------- |
| **Pricing**              | Predatory (starts at $0.02/user)    | **Free. Forever.**                 |
| **User Limit**           | None (but you pay for every one)    | **Unlimited Users & MAUs**         |
| **Hosting**              | Their cloud (Vendor Lock-in)        | **Self-Hosted (Your Control)**     |
| **Data Control**         | Partial                             | **100% Yours**                     |
| **Google OAuth**         | ✅                                  | ✅                                 |
| **Enterprise SSO**       | Gated behind Enterprise plans       | **Free & Open** (on roadmap)       |
| **Deployment**           | SDK Integration                     | **One-Command Docker Deploy**      |

---

## Get Started in 3 Minutes

Deploy the entire NULLIFY stack (API and Database) with a single command.

**Prerequisites:** [Docker](https://www.docker.com/products/docker-desktop/) must be installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Esrbwt1/nullify.git
    cd nullify
    ```

2.  **Create your environment file:**
    Duplicate the `.env.example` file to `.env` and add your Google credentials and a secure JWT secret.
    ```bash
    cp .env.example .env
    ```

3.  **Launch the stack:**
    ```bash
    docker-compose up --build -d
    ```

Your NULLIFY instance is now running at `http://localhost:3001`.

---

## Core Features

- ✅ **Full Authentication:** Secure registration and login with hashed passwords.
- ✅ **Google OAuth:** One-click social login with Google.
- ✅ **JWT Sessions:** Stateless, secure authentication for your APIs.
- ✅ **Containerized:** Deploy anywhere with Docker in a single command.
- ✅ **Built for Speed:** Lightweight Node.js (Fastify) and PostgreSQL backend.
- ✅ **100% Open Source:** MIT Licensed. No hidden fees, no enterprise gates.

## The Ethiopian Edge

NULLIFY was forged in Addis Ababa, a city with a vibrant tech scene but challenging internet infrastructure. It is engineered by principle to be lightweight, resilient, and incredibly fast, even on low-bandwidth connections—a stark contrast to bloated Silicon Valley alternatives.

---

*This project is in its early stages. Contributions are welcome.*