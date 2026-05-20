# 🎯 SSOT - Single Source of Truth para Formulários de Empresa

## Arquitetura Implementada

```
ClientFormFields.tsx (SSOT) ← Single Source of Truth
    ↓                    ↓
ClientModal.tsx    CompanyStepForm.tsx
(standalone)       (wizard etapa 2)
```

## ✅ Benefícios do SSOT

### 1. **DRY (Don't Repeat Yourself)**

- Campos definidos **uma única vez**
- Zero duplicação de código

### 2. **Manutenibilidade**

```typescript
// ✅ Adicionar um novo campo? Edite apenas ClientFormFields.tsx
// ✨ Mudança reflete automaticamente em:
//   - ClientModal (cadastro standalone)
//   - CompanyStepForm (wizard contato+empresa)
```

### 3. **Consistência Garantida**

- Mesma validação em todos os lugares
- Mesmos placeholders
- Mesma experiência do usuário

### 4. **Testes Centralizados**

- Teste ClientFormFields uma vez
- Funciona em todos os contextos

---

## 📦 Componentes

### **ClientFormFields.tsx** (SSOT)

Exporta:

- `ClientFormFields` (componente de campos)
- `ClientFormData` (interface TypeScript)

Props:

```typescript
{
  formData: ClientFormData;
  errors: { [key: string]: string };
  isEditMode: boolean;
  client?: Cliente | null;
  marcasDisponiveis: Marca[];
  loadingMarcas: boolean;
  onChange: (e) => void;
  onMarcaToggle: (marcaId: number) => void;
  getStatusLabel?: (status: number) => string;
}
```

Campos gerenciados:

- ✅ Nome da Empresa
- ✅ Porte (pequeno/médio/grande)
- ✅ Website (com auto-correção de URL)
- ✅ Marcas Associadas (multi-select)
- ✅ Status (só visualização/edição)
- ✅ Observações

---

### **ClientModal.tsx**

Usa `ClientFormFields` para:

- Cadastro de empresa standalone
- Edição de empresa existente
- Modo visualização/edição

---

### **CompanyStepForm.tsx**

Usa `ClientFormFields` para:

- Etapa 2 do wizard (após dados do contato)
- Indicador de progresso visual (1/2 → 2/2)
- Navegação "Voltar" / "Cadastrar"

---

## 🔄 Como Modificar Campos

### Exemplo: Adicionar campo "CNPJ"

**1. Edite `ClientFormFields.tsx`:**

```typescript
// Adicione na interface
export interface ClientFormData {
  nome: string;
  porte: string;
  site?: string;
  cnpj?: string; // ← NOVO
  marcaIds?: number[];
  observacoes?: string;
}

// Adicione o campo no componente (entre "nome" e "porte")
<FormGroup>
  <FormLabel>CNPJ</FormLabel>
  <FormInput
    type="text"
    name="cnpj"
    value={formData.cnpj}
    onChange={onChange}
    placeholder="00.000.000/0000-00"
    disabled={!!client && !isEditMode}
  />
  {errors.cnpj && <ErrorMessage>{errors.cnpj}</ErrorMessage>}
</FormGroup>
```

**2. Pronto! ✨**

- ClientModal agora tem campo CNPJ
- CompanyStepForm agora tem campo CNPJ
- Zero mudanças nos componentes pai

---

## 💡 Exemplo de Uso no Wizard

```typescript
// ContactModal.tsx (etapa 1)
const [showCompanyStep, setShowCompanyStep] = useState(false);
const [companyData, setCompanyData] = useState<Partial<ClientFormData>>({});

// Quando usuário seleciona "+Nova Empresa"
if (formData.empresa === "__nova__") {
  setShowCompanyStep(true);
}

// Renderizar etapa 2
{showCompanyStep && (
  <CompanyStepForm
    isOpen={showCompanyStep}
    onClose={() => setShowCompanyStep(false)}
    onBack={() => setShowCompanyStep(false)}
    onSave={handleCreateCompanyAndContact}
    initialData={companyData}
  />
)}
```

---

## 🎨 Visual do Wizard

### Etapa 1 - Dados do Contato

```
┌───────────────────────────────────┐
│ Novo Contato                    × │
├───────────────────────────────────┤
│ Nome: [João Silva]                │
│ Empresa: [+ Nova Empresa] ←       │
│ Cargo: [CEO]                      │
│ Email: [joao@email.com]           │
│                                   │
│ [Cancelar] [Próximo: Empresa →]   │
└───────────────────────────────────┘
```

### Etapa 2 - Dados da Empresa

```
┌───────────────────────────────────┐
│ Nova Empresa                    × │
├───────────────────────────────────┤
│ ● Contato ━━━━ ● Empresa         │
│   ✓             2                 │
│                                   │
│ Nome da Empresa *: [TechCorp]     │
│ Porte: [Pequeno ⌄]                │
│ Website: [www.techcorp.com]       │
│ Marcas: [☑ Marca A] [☐ B]         │
│                                   │
│ [← Voltar] [Cadastrar Empresa]    │
└───────────────────────────────────┘
```

---

## ✅ Checklist de Sucesso

- [x] ClientFormFields criado (SSOT)
- [x] ClientModal refatorado para usar SSOT
- [x] CompanyStepForm criado usando SSOT
- [x] Zero duplicação de código
- [x] Mesma interface TypeScript compartilhada
- [x] Mudanças propagam automaticamente
- [x] Indicador visual de progresso implementado
- [x] Navegação wizard funcional

---

## 🚀 Próximos Passos

1. Integrar CompanyStepForm no ContactModal
2. Implementar lógica de submit sequencial (empresa → contato)
3. Adicionar validação específica de CNPJ (se necessário)
4. Testes unitários para ClientFormFields
