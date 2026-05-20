# 🔧 Scripts de Automação

Scripts para deploy, diagnóstico e manutenção do Hubee.

## 🚀 Scripts de Deploy

### Windows (PowerShell)

```powershell
.\deploy.ps1
```

**Descrição:** Script completo de deploy para Windows.  
**O que faz:**

- Constrói imagens Docker (backend + frontend)
- Faz push para Docker Hub
- Conecta no servidor via SSH
- Atualiza containers no servidor

**Pré-requisitos:**

- Docker Desktop instalado
- PowerShell 5.1 ou superior
- Acesso SSH ao servidor (root@162.240.51.252)

---

### Linux/macOS (Bash)

```bash
./deploy.sh
```

**Descrição:** Script completo de deploy para Linux/macOS.  
**Funcionalidade:** Idêntica ao deploy.ps1

---

## 🛑 Scripts de Controle

### Parar o Hubee (Windows)

```powershell
.\parar-hubee.ps1
```

**Descrição:** Para os containers do Hubee no servidor.  
**O que faz:**

- Conecta no servidor via SSH
- Executa `docker-compose down`
- Mostra status dos containers

---

## 🔍 Scripts de Diagnóstico

### Diagnóstico Completo - Windows

```powershell
.\diagnostico.ps1
```

**Descrição:** Executa diagnóstico completo do ambiente.  
**Verifica:**

- ✅ Containers em execução
- ✅ Logs dos containers
- ✅ Portas em uso (3020, 3021)
- ✅ Processos node/docker
- ✅ Espaço em disco
- ✅ Memória disponível

---

### Diagnóstico Completo - Linux/macOS

```bash
./diagnostico-servidor.sh
```

**Descrição:** Versão Linux do diagnóstico.  
**Funcionalidade:** Idêntica ao diagnostico.ps1

---

## 🌐 Scripts de Infraestrutura

### Setup de Subdomínio

```bash
./setup-subdomain.sh
```

**Descrição:** Configura subdomínio no servidor cPanel.  
**Quando usar:** Ao configurar novo ambiente ou subdomínio.

---

## 📝 Como Usar

### 1. Fazer Deploy

**Windows:**

```powershell
cd c:\DEV\FilmeLab\applications\hubee\scripts
.\deploy.ps1
```

**Linux/macOS:**

```bash
cd /path/to/hubee/scripts
chmod +x deploy.sh
./deploy.sh
```

### 2. Verificar Status

```powershell
.\diagnostico.ps1
```

### 3. Parar Aplicação

```powershell
.\parar-hubee.ps1
```

---

## ⚙️ Variáveis de Ambiente

Os scripts usam as seguintes variáveis (configuradas internamente):

- `DOCKER_HUB_USER`: deigio1989
- `SERVER_HOST`: 162.240.51.252
- `SERVER_USER`: root
- `SERVER_PATH`: /home/filmelab/hubee
- `FRONTEND_PORT`: 3020
- `BACKEND_PORT`: 3021

---

## 🚨 Troubleshooting

### Erro: "Permission denied" (Linux/macOS)

```bash
chmod +x *.sh
```

### Erro: "Execution Policy" (Windows)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro de conexão SSH

Verifique se tem acesso SSH ao servidor:

```bash
ssh root@162.240.51.252
```

---

## 🔙 Voltar

[← Voltar para README principal](../README.md)
