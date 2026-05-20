# Script para setup do catálogo de itens
# Execute na pasta backend: .\setup-catalogo.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Setup Catálogo de Itens - Hubee" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Criar tabela catalogo_itens
Write-Host "[1/3] Criando tabela catalogo_itens..." -ForegroundColor Yellow
node create-catalogo-table.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao criar tabela catalogo_itens" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. Criar tabela de relacionamento marcas_catalogo_itens
Write-Host "[2/3] Criando tabela marcas_catalogo_itens..." -ForegroundColor Yellow
node create-marcas-catalogo-relation.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao criar tabela de relacionamento" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 3. Popular catálogo com os dados
Write-Host "[3/3] Populando catálogo com os itens..." -ForegroundColor Yellow
node seed-catalogo-itens.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao popular catálogo" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "=====================================" -ForegroundColor Green
Write-Host "  ✅ Setup concluído com sucesso!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
