# PRD: Componente de Consentimento de Cookies para WeWeb

**Versao:** 1.0
**Data:** 2024-12-14
**Status:** Rascunho
**Autor:** Equipe de Desenvolvimento

---

## 1. Visao Geral

### 1.1 Proposito
Criar um componente de consentimento de cookies totalmente customizavel e compativel com privacidade para aplicacoes WeWeb que permite aos proprietarios de sites:
- Coletar consentimento do usuario para uso de cookies
- Fornecer controle granular sobre categorias de cookies
- Estar em conformidade com regulamentacoes internacionais de privacidade (LGPD, GDPR, CCPA)
- Integrar perfeitamente com workflows do WeWeb

### 1.2 Contexto
Regulamentacoes modernas de privacidade exigem consentimento explicito do usuario antes de armazenar cookies nao-essenciais. Este componente fornece uma solucao completa para gerenciar consentimento de cookies em aplicacoes WeWeb, suportando multiplos modos de consentimento, estilos visuais e padroes de integracao.

### 1.3 Usuarios Alvo
- Desenvolvedores de aplicacoes WeWeb
- Equipes de marketing que precisam de consentimento para analytics/publicidade
- Equipes juridicas/compliance garantindo conformidade regulatoria
- Usuarios finais fazendo escolhas de privacidade

---

## 2. Objetivos

| ID | Objetivo | Metrica de Sucesso |
|----|----------|-------------------|
| O-01 | Simplificar conformidade de privacidade | < 5 minutos para implementar consentimento basico |
| O-02 | Fornecer flexibilidade | 3+ estilos visuais, 6+ opcoes de posicao |
| O-03 | Habilitar integracao com workflow | Todas as acoes acessiveis via workflows WeWeb |
| O-04 | Suportar principais regulamentacoes | Pronto para LGPD, GDPR, CCPA |
| O-05 | Manter performance | < 20KB tamanho do bundle, < 100ms tempo de renderizacao |

---

## 3. Requisitos Funcionais

### 3.1 Recursos Principais

#### RF-01: Exibicao do Banner de Cookies
**Prioridade:** Critica

O componente DEVE exibir um banner de consentimento de cookies com:
- Texto de titulo e mensagem configuraveis
- Link para pagina de politica de privacidade
- Botoes de acao (Aceitar, Recusar, Preferencias)
- Botao de fechar opcional (para modo informativo)

**Criterios de Aceitacao:**
- [ ] Banner aparece na primeira visita quando nenhum consentimento esta armazenado
- [ ] Banner respeita posicao configurada (6 opcoes)
- [ ] Banner e responsivo (adapta-se a telas mobile)
- [ ] Banner suporta 3 estilos visuais (minimo, padrao, detalhado)

#### RF-02: Modos de Consentimento
**Prioridade:** Critica

O componente DEVE suportar tres modos de consentimento:

| Modo | Comportamento |
|------|---------------|
| `opt-in` | Bloqueia todos os cookies nao-essenciais ate consentimento explicito (padrao LGPD/GDPR) |
| `opt-out` | Habilita cookies por padrao, usuario pode recusar |
| `informational` | Exibe apenas aviso, sem bloqueio ou escolha necessaria |

**Criterios de Aceitacao:**
- [ ] Modo padrao e `opt-in`
- [ ] Modo e configuravel via propriedade ww-config
- [ ] Bloqueio de scripts respeita modo atual

#### RF-03: Categorias de Cookies
**Prioridade:** Critica

O componente DEVE gerenciar quatro categorias de cookies:

| Categoria | Obrigatoria | Pode Desativar |
|-----------|-------------|----------------|
| Essencial | Sim | Nao |
| Analytics | Nao | Sim |
| Marketing | Nao | Sim |
| Personalizacao | Nao | Sim |

**Criterios de Aceitacao:**
- [ ] Categoria essencial esta sempre habilitada
- [ ] Usuario pode alternar cada categoria opcional
- [ ] Preferencias de categoria persistem entre sessoes
- [ ] Cada categoria tem rotulo e descricao customizaveis

#### RF-04: Modal de Preferencias
**Prioridade:** Alta

O componente DEVE fornecer um modal de preferencias com:
- Toggle switch para cada categoria de cookie
- Texto de descricao para cada categoria
- Botoes Aceitar Todos / Rejeitar Todos
- Botao Salvar Preferencias

**Criterios de Aceitacao:**
- [ ] Modal abre do botao "Preferencias" do banner
- [ ] Modal abre do botao gerenciador
- [ ] Modal pode ser aberto via acao de workflow
- [ ] Modal exibe estado atual de consentimento
- [ ] Modal e acessivel (navegacao por teclado, focus trap)

#### RF-05: Botao Gerenciador
**Prioridade:** Alta

O componente DEVE fornecer um botao gerenciador persistente:
- Posicao fixa na tela (configuravel)
- Abre modal de preferencias ao clicar
- Pode ser ocultado via configuracao

**Criterios de Aceitacao:**
- [ ] Botao aparece apos consentimento inicial ser dado
- [ ] Posicao do botao e configuravel
- [ ] Botao pode ser estilizado (icone, cores)
- [ ] Botao pode ser desabilitado via configuracao

#### RF-06: Armazenamento de Consentimento
**Prioridade:** Critica

O componente DEVE armazenar dados de consentimento usando uma **abordagem dupla**:
1. **Eventos de Trigger**: Enviar dados de consentimento para workflows WeWeb para tratamento customizado (banco de dados, analytics, etc.)
2. **localStorage**: Persistir automaticamente o consentimento com a chave `cookieConsent`

**Detalhes de Armazenamento:**
- Armazenamento primario: localStorage com chave `cookieConsent`
- Fallback: cookie HTTP `cookieConsent=1`
- Dados incluem: versao, timestamp, consentId, categorias, expiracao

**Estrutura de Dados de Consentimento (chave localStorage: `cookieConsent`):**
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "consentId": "cc_abc123xyz",
  "mode": "opt-in",
  "categories": {
    "essential": true,
    "analytics": true,
    "marketing": false,
    "personalization": true
  },
  "expiration": "2025-01-15T10:30:00.000Z"
}
```

**Lendo Consentimento (JavaScript):**
```javascript
const consent = JSON.parse(localStorage.getItem('cookieConsent'));
if (consent?.categories?.analytics) {
  // Usuario permitiu cookies de analytics
}
```

**Criterios de Aceitacao:**
- [ ] Consentimento persiste no localStorage com chave `cookieConsent`
- [ ] Dados de consentimento enviados via eventos de trigger para integracao com workflow
- [ ] Consentimento expira apos dias configurados (padrao: 365)
- [ ] Versao de consentimento permite re-consentimento em mudancas de politica
- [ ] Pode ser limpo via acao de workflow (`resetConsent`)
- [ ] `consentId` unico gerado para cada registro de consentimento

#### RF-07: Bloqueio de Scripts
**Prioridade:** Alta

O componente DEVE controlar execucao de scripts baseado em consentimento:

```html
<script type="text/plain" data-cc-category="analytics">
  // Bloqueado ate consentimento de analytics
</script>
```

**Criterios de Aceitacao:**
- [ ] Scripts com `type="text/plain"` e `data-cc-category` sao bloqueados
- [ ] Scripts executam imediatamente quando consentimento da categoria e dado
- [ ] Funciona com scripts inline e src externo
- [ ] Nenhuma execucao antes do consentimento em modo opt-in

#### RF-08: Atributos de Trigger Customizados
**Prioridade:** Media

O componente DEVE suportar triggers baseados em atributos HTML:

| Atributo | Acao |
|----------|------|
| `data-cc="allow"` | Aceita todos os cookies |
| `data-cc="deny"` | Recusa todos nao-essenciais |
| `data-cc="open-preferences"` | Abre modal de preferencias |
| `data-cc="close"` | Fecha banner/modal |
| `data-cc="submit"` | Salva preferencias atuais |
| `data-cc-checkbox="[categoria]"` | Alterna categoria especifica |

**Criterios de Aceitacao:**
- [ ] Atributos funcionam em qualquer elemento clicavel
- [ ] Atributos de checkbox sincronizam com estado do componente
- [ ] Funciona fora dos limites do componente Vue

### 3.2 Integracao WeWeb

#### RF-09: Acoes de Workflow
**Prioridade:** Critica

O componente DEVE expor estas acoes para workflows WeWeb:

| Acao | Argumentos | Descricao |
|------|------------|-----------|
| `showBanner()` | nenhum | Exibe o banner de consentimento |
| `hideBanner()` | nenhum | Oculta o banner de consentimento |
| `openPreferences()` | nenhum | Abre modal de preferencias |
| `closePreferences()` | nenhum | Fecha modal de preferencias |
| `acceptAll()` | nenhum | Aceita todas as categorias de cookies |
| `declineAll()` | nenhum | Recusa cookies nao-essenciais |
| `savePreferences(categories)` | `{ analytics, marketing, personalization }` | Salva preferencias especificas |
| `resetConsent()` | nenhum | Limpa consentimento e exibe banner |
| `getConsentStatus()` | nenhum | Retorna estado atual de consentimento |

**Criterios de Aceitacao:**
- [ ] Todas as acoes chamaveis via workflow WeWeb
- [ ] Acoes tem rotulos claros (EN/PT)
- [ ] Argumentos sao propriamente tipados e bindable

#### RF-10: Eventos de Trigger
**Prioridade:** Critica

O componente DEVE emitir estes eventos para workflows WeWeb. Todos os eventos sao prefixados com "Cookie:" para facil identificacao no editor de workflow:

| Nome do Evento | Label (no WeWeb) | Payload | Quando Dispara |
|----------------|------------------|---------|----------------|
| `consentGiven` | Cookie: Usuario Aceitou Todos os Cookies | `{ consentId, categories, timestamp }` | Usuario clica em "Aceitar Todos" |
| `consentDeclined` | Cookie: Usuario Recusou Todos os Cookies | `{ consentId, timestamp }` | Usuario clica em "Recusar" |
| `preferencesUpdated` | Cookie: Usuario Salvou Preferencias Personalizadas | `{ consentId, categories, timestamp }` | Usuario salva preferencias customizadas |
| `bannerShown` | Cookie: Banner Exibido | `{ source? }` | Banner se torna visivel |
| `bannerHidden` | Cookie: Banner Fechado | `{ reason }` | Banner e fechado |
| `preferencesOpened` | Cookie: Modal de Preferencias Aberto | `{}` | Modal de preferencias abre |
| `preferencesClosed` | Cookie: Modal de Preferencias Fechado | `{}` | Modal de preferencias fecha |
| `consentStatusRetrieved` | Cookie: Status do Consentimento Obtido | `{ hasConsent, consent }` | Status de consentimento obtido via action |
| `lastConsentRetrieved` | Cookie: Ultimo Consentimento Obtido | `{ consentId, categories, timestamp, ... }` | Dados obtidos via action getLastConsent |

**Acessando Dados de Consentimento no Workflow:**

Os dados completos do consentimento sao armazenados no localStorage e podem ser acessados de 3 formas:

1. **Via localStorage (RECOMENDADO):**
```javascript
JSON.parse(localStorage.getItem('cookieConsent'))
```

2. **Via Binding (propriedade bindable):**
- Vincular `component.lastConsentData` a uma variavel WeWeb

3. **Via Action:**
- Chamar action `getLastConsent` e escutar evento `lastConsentRetrieved`

**Convencao de Nomenclatura:**
- Todos os labels prefixados com "Cookie:" para facil filtragem no dropdown do WeWeb
- Labels descrevem a acao do usuario claramente (ex: "Usuario Aceitou Todos os Cookies" vs apenas "Consentimento Dado")
- Valores de reason para `bannerHidden`: `acceptAll`, `declineAll`, `savePreferences`, `manual`, `controller`

**Criterios de Aceitacao:**
- [ ] Eventos disparam nos momentos corretos
- [ ] Payloads contem dados especificados
- [ ] Eventos aparecem no editor de workflow WeWeb com prefixo "Cookie:" claro
- [ ] Labels sao descritivos o suficiente para entender sem documentacao

### 3.3 Customizacao

#### RF-11: Estilos Visuais
**Prioridade:** Alta

Tres estilos visuais integrados:

**Minimo:**
- Banner de linha unica
- Icone + mensagem + botoes inline
- Sem titulo

**Padrao:**
- Banner baseado em card
- Titulo, mensagem, link de politica
- Botoes empilhados ou inline

**Detalhado:**
- Painel completo de preferencias inline
- Toggles de categoria visiveis
- Descricoes expandidas

**Criterios de Aceitacao:**
- [ ] Estilo selecionavel via dropdown
- [ ] Cada estilo e responsivo
- [ ] Estilos funcionam com todas as opcoes de posicao

#### RF-12: Opcoes de Posicao
**Prioridade:** Alta

| Opcao | Desktop | Mobile |
|-------|---------|--------|
| `bottom-left` | Fixo, 24px das bordas | Largura total, 16px do fundo |
| `bottom-right` | Fixo, 24px das bordas | Largura total, 16px do fundo |
| `bottom-center` | Fixo, centralizado, 24px do fundo | Largura total, 16px do fundo |
| `top-left` | Fixo, 24px das bordas | Largura total, 16px do topo |
| `top-right` | Fixo, 24px das bordas | Largura total, 16px do topo |
| `top-center` | Fixo, centralizado, 24px do topo | Largura total, 16px do topo |

**Criterios de Aceitacao:**
- [ ] Todas as 6 posicoes disponiveis
- [ ] Breakpoint mobile em 768px
- [ ] Animacoes suaves entre estados

#### RF-13: Customizacao de Cores
**Prioridade:** Alta

Cores customizaveis:
- Cor de fundo
- Cor do texto (primario e secundario)
- Botao primario (fundo, texto, hover)
- Botao secundario (fundo, texto, hover)
- Cor da borda
- Cores do toggle switch (ligado/desligado)
- Cor do link

**Criterios de Aceitacao:**
- [ ] Todas as cores configuraveis via editor WeWeb
- [ ] Cores suportam binding a variaveis
- [ ] Cores padrao fornecem bom contraste (WCAG AA)

#### RF-14: Tipografia
**Prioridade:** Media

Tipografia customizavel:
- Familia da fonte (herdar ou customizada)
- Tamanho da fonte do titulo
- Tamanho da fonte do texto do corpo
- Tamanho da fonte do botao
- Altura da linha

**Criterios de Aceitacao:**
- [ ] Herda fonte da pagina por padrao
- [ ] Opcoes de tamanho com min/max razoaveis

#### RF-15: Localizacao de Conteudo
**Prioridade:** Alta

Todo conteudo de texto configuravel:
- Titulo do banner
- Mensagem do banner
- Rotulo do botao aceitar
- Rotulo do botao recusar
- Rotulo do botao preferencias
- Rotulos de categoria (4)
- Descricoes de categoria (4)
- Rotulo do botao salvar
- Rotulo do botao fechar

**Criterios de Aceitacao:**
- [ ] Conteudo padrao em Ingles
- [ ] Todo conteudo suporta binding WeWeb
- [ ] Rotulos disponiveis em EN e PT-BR

### 3.4 Acessibilidade

#### RF-16: Navegacao por Teclado
**Prioridade:** Alta

- Tab entre elementos interativos
- Enter/Espaco para ativar botoes
- Escape para fechar modal
- Teclas de seta para toggles

**Criterios de Aceitacao:**
- [ ] Operabilidade completa por teclado
- [ ] Indicadores de foco visiveis
- [ ] Ordem de tab logica

#### RF-17: Suporte a Leitores de Tela
**Prioridade:** Alta

- Labels ARIA em todos elementos interativos
- Atributos role onde apropriado
- Anuncios de regiao viva para mudancas de estado

**Criterios de Aceitacao:**
- [ ] Funciona com NVDA, VoiceOver, JAWS
- [ ] Anuncia acoes de consentimento
- [ ] Modal anunciado quando aberto

#### RF-18: Gerenciamento de Foco
**Prioridade:** Media

- Focus trap no modal
- Retorna foco ao fechar modal
- Auto-foco no primeiro elemento interativo

**Criterios de Aceitacao:**
- [ ] Nao pode sair do modal com tab quando aberto
- [ ] Foco retorna ao elemento trigger ao fechar

---

## 4. Requisitos Nao-Funcionais

### 4.1 Performance

| Metrica | Alvo |
|---------|------|
| Tamanho do bundle | < 20KB gzipped |
| Renderizacao inicial | < 100ms |
| Verificacao de consentimento | < 10ms |
| Sem mudanca de layout | CLS = 0 |

### 4.2 Suporte de Navegadores

| Navegador | Versao Minima |
|-----------|---------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| Opera | 67+ |

### 4.3 Seguranca

- Sem chamadas de API externas
- Sem dependencias de terceiros para funcionalidade principal
- Prevencao de XSS em conteudo de usuario
- Atributos de seguranca de cookie (SameSite, Secure em HTTPS)

---

## 5. Interface do Usuario

### 5.1 Estados do Banner

```
┌─────────────────────────────────────────────────────────────────┐
│                         ESTADO INICIAL                          │
│  Banner visivel, nenhum consentimento armazenado                │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  ACEITOU TODOS  │ │ RECUSOU TODOS   │ │ PREFERENCIAS    │
│  Banner oculto  │ │ Banner oculto   │ │ Modal aberto    │
│  Gerenc. exibido│ │ Gerenc. exibido │ │                 │
└─────────────────┘ └─────────────────┘ └────────┬────────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              ▼                   ▼                   ▼
                    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
                    │  SALVOU PREFS   │ │  ACEITOU TODOS  │ │  REJEITOU TODOS │
                    │  Modal fechado  │ │  Modal fechado  │ │  Modal fechado  │
                    │  Gerenc. exibido│ │  Gerenc. exibido│ │  Gerenc. exibido│
                    └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 5.2 Hierarquia de Componentes

```
wwElement.vue
├── Placeholder do Editor (visivel no editor WeWeb quando sem conteudo)
│
├── Banner de Cookie
│   ├── Icone de Cookie
│   ├── Titulo
│   ├── Mensagem
│   ├── Link de Politica
│   └── Grupo de Botoes
│       ├── Botao Aceitar Todos
│       ├── Botao Recusar
│       └── Botao Preferencias
│
├── Modal de Preferencias
│   ├── Cabecalho
│   │   ├── Titulo
│   │   └── Botao Fechar
│   ├── Lista de Categorias
│   │   ├── Essencial (sempre ligado)
│   │   ├── Toggle Analytics
│   │   ├── Toggle Marketing
│   │   └── Toggle Personalizacao
│   └── Rodape
│       ├── Botao Rejeitar Todos
│       ├── Botao Aceitar Todos
│       └── Botao Salvar Preferencias
│
└── Botao Gerenciador
    └── Icone de Cookie + Rotulo
```

---

## 6. Modelos de Dados

### 6.1 Objeto de Consentimento

```typescript
interface ConsentData {
  version: string;           // Versao do componente para re-consentimento
  timestamp: string;         // Datetime ISO 8601
  mode: 'opt-in' | 'opt-out' | 'informational';
  categories: {
    essential: true;         // Sempre true
    analytics: boolean;
    marketing: boolean;
    personalization: boolean;
  };
  expiration: string;        // Datetime ISO 8601
}
```

### 6.2 Objeto de Configuracao

```typescript
interface ComponentConfig {
  // Geral
  consentMode: 'opt-in' | 'opt-out' | 'informational';
  bannerStyle: 'minimal' | 'standard' | 'detailed';
  position: 'bottom-left' | 'bottom-right' | 'bottom-center' |
            'top-left' | 'top-right' | 'top-center';
  showManager: boolean;
  cookieExpiration: number;  // Dias
  policyPageUrl: string;

  // Categorias
  analyticsEnabled: boolean;
  marketingEnabled: boolean;
  personalizationEnabled: boolean;

  // Conteudo
  bannerTitle: string;
  bannerMessage: string;
  acceptAllLabel: string;
  declineAllLabel: string;
  preferencesLabel: string;
  // ... rotulos e descricoes de categoria

  // Estilizacao
  backgroundColor: string;
  textColor: string;
  primaryButtonBg: string;
  primaryButtonText: string;
  secondaryButtonBg: string;
  secondaryButtonText: string;
  borderRadius: string;
  // ... props de estilo adicionais
}
```

---

## 7. Exemplos de Integracao

### 7.1 Configuracao Basica

1. Adicione o componente Cookie Consent na pagina
2. Configure `policyPageUrl` para sua politica de privacidade
3. Customize cores para combinar com sua marca
4. Configure triggers de workflow

### 7.2 Integracao com Google Analytics

```javascript
// No evento 'consentGiven'
if (event.categories.analytics) {
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
}
```

### 7.3 Integracao com Meta Pixel

```javascript
// No evento 'consentGiven'
if (event.categories.marketing) {
  fbq('consent', 'grant');
}
```

---

## 8. Cronograma

| Fase | Entregaveis | Duracao |
|------|-------------|---------|
| Fase 1 | Banner principal, armazenamento de consentimento, estilizacao basica | - |
| Fase 2 | Modal de preferencias, gerenciamento de categorias | - |
| Fase 3 | Integracao de acoes/eventos WeWeb | - |
| Fase 4 | Bloqueio de scripts, triggers customizados | - |
| Fase 5 | Testes, documentacao, polimento | - |

---

## 9. Metricas de Sucesso

| Metrica | Alvo | Medicao |
|---------|------|---------|
| Adocao | - | Numero de apps WeWeb usando componente |
| Taxa de consentimento | > 60% | Usuarios aceitando vs recusando |
| Tickets de suporte | < 5/mes | Issues reportadas |
| Performance | < 100ms render | Metricas Lighthouse |

---

## 10. Questoes Abertas

1. Devemos suportar integracao com lista de vendors IAB TCF 2.0?
2. O consentimento deve sincronizar entre subdominios?
3. Devemos fornecer integracao integrada com Google Consent Mode v2?
4. O botao gerenciador deve ser um componente separado?

---

## 11. Referencias

- [Requisitos de Cookies LGPD](https://lgpd.com.br/)
- [Requisitos de Cookies GDPR](https://gdpr.eu/cookies/)
- [Requisitos de Cookies CCPA](https://oag.ca.gov/privacy/ccpa)
- [Documentacao de Componentes WeWeb](https://developer.weweb.io/)
- [Shadcn Cookie Consent](https://shadcnstudio.com/blocks/marketing-ui/cookies-consent)
- [Finsweet Cookie Consent](https://finsweet.com/cookie-consent)
