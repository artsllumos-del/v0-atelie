# 🎬 DEMONSTRAÇÃO DE USO - ATELIÊ SAGRADO

## Vídeo Tutorial (Passos Práticos)

### 1️⃣ PRIMEIRO ACESSO

**Passo 1: Abrir a aplicação**
```
1. Abra http://localhost:3000 no navegador
2. Você será redirecionado automaticamente para /auth
3. Veja a página de login com branding do Ateliê Sagrado
```

**Passo 2: Fazer login**
```
Email:    artsllumos@gmail.com
Senha:    139908Lr

Clique em "Entrar"
```

**Esperado:**
- ✅ Login validado
- ✅ Redirecionado para /admin
- ✅ Dashboard com KPIs aparece

---

### 2️⃣ EXPLORAR O DASHBOARD

**Layout**
```
┌─────────────────────────────────────┐
│  Logo    │  Navegação              │ ← Navbar
├─────────────────────────────────────┤
│         │                           │
│ Sidebar │    Dashboard Principal    │
│ Menu    │                           │
│         │    • KPIs (4 cards)       │
│ • Admin │    • Gráficos             │
│ • Estoque                          │
│ • Produtos                         │
│ • Etc.                             │
│         │                           │
└─────────────────────────────────────┘
```

**Clique em cada seção:**
- Estoque → Funcional ✅
- Produtos → Estrutura pronta
- Orçamentos → Estrutura pronta
- Etc.

---

### 3️⃣ TESTAR MÓDULO DE ESTOQUE (100% Funcional)

#### A. ADICIONAR MATERIAL

**Clique:** "Adicionar Material" (botão verde)

**Diálogo abre com:**
```
Nome do Material *              [             ]
SKU                            [             ]

Unidade de Medida *            [Selecionar ▼ ]
Peso do Pacote (g)             [             ]

Quantidade por Pacote *        [             ]
Custo por Pacote (R$) *        [             ]

Quantidade Atual               [             ]
Quantidade Mínima              [             ]

                    [Cancelar] [Adicionar]
```

**Exemplo: Adicionar Contas de Cristal**
```
Nome:                 Contas de Cristal 6mm
SKU:                  CONTA-CRIST-6MM
Unidade:              Unidades
Quantidade Pacote:    100
Custo Pacote:         50.00
Quantidade Atual:     500
Quantidade Mínima:    200
```

**Clique:** Adicionar Material

**Esperado:**
- ✅ Toast: "Material adicionado com sucesso!"
- ✅ Diálogo fecha
- ✅ Material aparece na tabela

---

#### B. VER MATERIAL NA TABELA

**Tabela mostra:**
```
┌──────────────────┬───────┬─────────┬────────┬──────────┬────────┬─────────┐
│ Material         │ Unit. │ Qtd.    │ Mín.   │ Cst Unit │ Status │ Ações   │
├──────────────────┼───────┼─────────┼────────┼──────────┼────────┼─────────┤
│ Contas Cristal   │ un.   │ 500 ▓▓  │ 200    │ R$ 0.50  │ ✓ OK   │ ✎ ✗    │
│ SKU: CONTA-CRIST │       │         │        │          │        │         │
└──────────────────┴───────┴─────────┴────────┴──────────┴────────┴─────────┘
```

**Informações Calculadas:**
- ✅ Custo por Unidade: 50.00 / 100 = 0.50 (automático!)
- ✅ Progresso visual: 500 / 200 = 250% = ✓ OK
- ✅ Status: OK (porque está acima do mínimo)

---

#### C. FILTRAR MATERIAIS

**Filtro por Unidade:**
```
[Buscar...] [Todas unidades ▼]

Opções disponíveis:
- Todas unidades
- Gramas
- Quilos
- Unidades ← Cristal está aqui
- Metros
- Centímetros
```

**Buscar por nome:**
```
[Buscar: "cristal"] → Mostra apenas Contas de Cristal
```

---

#### D. VER CARDS DE RESUMO

**3 Cards no topo:**

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Total de Mat.   │  │ Estoque Baixo   │  │ Valor Total     │
│       1         │  │ ⚠️    0          │  │ R$ 250.00       │
│ itens cadastro  │  │ abaixo do mín.  │  │ custo total     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

#### E. ADICIONAR MAIS MATERIAIS

**Exemplo 2: Adicionar Crucifixo**
```
Nome:                 Crucifixo de Metal Dourado
SKU:                  CRUCIF-METAL-DOURADO
Unidade:              Unidades
Quantidade Pacote:    50
Custo Pacote:         150.00
Quantidade Atual:     100
Quantidade Mínima:    30
```

**Esperado:**
- ✅ Custo Unit: 150/50 = 3.00
- ✅ Status: ✓ OK (100 > 30)
- ✅ Aparece na tabela com Contas

**Exemplo 3: Adicionar com Estoque Baixo**
```
Nome:                 Fio de Seda Prata
SKU:                  FIO-SEDA-PRATA
Unidade:              Metros
Quantidade Pacote:    100
Custo Pacote:         80.00
Quantidade Atual:     15  ← Baixo!
Quantidade Mínima:    50
```

**Esperado:**
- ✅ Custo Unit: 80/100 = 0.80
- ✅ Status: ⚠️ Baixo (vermelho!)
- ✅ Card "Estoque Baixo" aumenta para 1

---

### 4️⃣ TESTAR DELETAR MATERIAL

**Clique:** Ícone de lixeira na linha

**Confirmação aparece:**
```
Tem certeza que deseja deletar este material?
```

**Clique:** Confirmar

**Esperado:**
- ✅ Toast: "Material deletado"
- ✅ Material desaparece da tabela
- ✅ Card "Total de Materiais" diminui

---

### 5️⃣ TESTES AVANÇADOS

#### Teste 1: Conversão de Unidades
```
Adicione:
- Material em GRAMAS: 500g por pacote
- Material em QUILOS: 5kg por pacote  
- Material em METROS: 10m por pacote

Sistema calcula corretamente todos os custos
```

#### Teste 2: Cálculo de Estoque
```
Adicione: 3 materiais com 1000, 500, 200 unidades
Veja: "Valor Total em Estoque" atualizar em tempo real
```

#### Teste 3: Busca e Filtro
```
1. Adicione 10 materiais diferentes
2. Busque por parte do nome
3. Filtre por unidade
4. Veja a tabela atualizar dinamicamente
```

---

### 6️⃣ PÁGINAS ESTRUTURADAS (Prontas para Expandir)

**Clique na sidebar:**
- Produtos → Página estruturada
- Precificação → Página estruturada
- Orçamentos → Página estruturada
- Pedidos → Página estruturada
- Produção → Página estruturada
- Clientes → Página estruturada
- Financeiro → Página estruturada
- Configurações → Página estruturada

**Todas usam o mesmo padrão que Estoque**

---

### 7️⃣ LOGOUT

**Clique em:** Avatar/Menu no canto superior direito

**Opções:**
- Perfil
- Configurações
- **Sair**

**Esperado:**
- ✅ Logout realizado
- ✅ Redirecionado para /auth
- ✅ Session destruída

---

## 🧪 CHECKLIST DE TESTES

- [ ] Login com credenciais corretas ✅
- [ ] Login com credenciais incorretas (erro) ✅
- [ ] Adicionar material ✅
- [ ] Cálculo automático de custo ✅
- [ ] Filtrar por unidade ✅
- [ ] Buscar por nome ✅
- [ ] Ver alertas de estoque baixo ✅
- [ ] Deletar material ✅
- [ ] Cards atualizando em tempo real ✅
- [ ] Logout ✅
- [ ] Login novamente ✅
- [ ] Dados persisten no banco ✅

---

## 💡 OBSERVAÇÕES

### O que está 100% Funcional
- Autenticação completa
- Módulo de Estoque
- Dashboard
- Design responsivo
- Banco de dados

### O que é Estrutura (Fácil Expandir)
- Produtos, Orçamentos, etc.
- Cada um pode copiar padrão de Estoque
- APIs já prontas para expandir

### O que Falta (Próximos Passos)
- Implementar produtos com BOM
- Criar precificação inteligente
- Expandir loja pública
- Montador de terços

---

## 🎥 DEMONSTRAÇÃO RÁPIDA (5 min)

1. Abrir sistema (30s)
2. Fazer login (30s)
3. Ver dashboard (1min)
4. Adicionar 3 materiais (2min)
5. Filtrar e buscar (1min)
6. Mostrar estoque baixo (1min)

---

## ✅ SISTEMA PRONTO PARA TESTES!

Todas as funcionalidades descritas acima estão testadas e operacionais.

**Próximo passo:** Implement módulos admin conforme PROXIMO_PASSO.md

**Tempo estimado para conclusão:** 40-60 horas

**Status Geral:** ✅ OPERACIONAL
