# Componente de Consentimento de Cookies para WeWeb

Um componente de consentimento de cookies totalmente customizavel e compativel com LGPD/GDPR para aplicacoes WeWeb construidas com Vue 3.

> **Traducoes:** [Read in English](README.md)

## Inicio Rapido

```bash
# Instalar dependencias
npm install

# Desenvolvimento local (https://localhost:8080)
npm run serve

# Build para producao
npm run build
```

## Documentacao

| Documento | Descricao |
|-----------|-----------|
| [PRD (EN)](docs/PRD.md) | Product Requirements Document |
| [PRD (PT-BR)](docs/PRD.pt-BR.md) | Documento de Requisitos do Produto |
| [PRD-2 (EN)](docs/PRD-2.md) | PRD Atualizacoes: Consent Mode v2, UUID, Cross-subdomain |
| [PRD-2 (PT-BR)](docs/PRD-2.pt-BR.md) | PRD Atualizacoes: Consent Mode v2, UUID, Cross-subdomain |
| [ADR](docs/ADR.md) | Registro de Decisoes de Arquitetura |
| [Guia WeWeb](AI_docs/weweb-integration.md) | Guia de integracao com WeWeb |

## Funcionalidades

### Funcionalidade Principal
- [x] Banner de consentimento de cookies com mensagens customizaveis
- [x] Gerenciamento granular de categorias (Essenciais, Analytics, Marketing, Personalizacao)
- [x] Modal de preferencias para controle detalhado de cookies
- [x] Botao gerenciador persistente para reacessar preferencias
- [x] **Abordagem dupla de armazenamento**: localStorage (chave `cookieConsent`) + eventos de trigger para workflows
- [x] Armazenamento de cookies com expiracao configuravel
- [x] Bloqueio de scripts ate consentimento ser dado

### Funcionalidades PRD-2 (v2.0)
- [x] **Google Consent Mode v2**: Default denied no carregamento + update no consentimento
- [x] **Integracao Meta Pixel**: Chamadas automaticas `fbq('consent', 'grant/revoke')`
- [x] **Sincronizacao cross-subdomain**: Compartilhamento de consentimento via cookie entre subdominios
- [x] **UUIDs para consentId**: Usa `crypto.randomUUID()` com fallback
- [x] **Nova action `setConsent()`**: Controle programatico de consentimento
- [x] **Novos eventos**: `consentDefaulted`, `consentChanged`

### Comportamento do Botao Flutuante (v2.1)
- [x] **Visibilidade inteligente**: Botao flutuante so aparece apos recusar ou fechar (nunca apos aceitar)
- [x] **Configuravel apos recusa**: Controle se o float aparece apos usuario recusar todos os cookies
- [x] **Deteccao de Bots/Crawlers**: Auto-consentimento para bots de busca (Googlebot, Bingbot, etc.)

### Novas Funcionalidades (v2.2)
- [x] **Seletor de idioma**: Alterne o idioma do componente entre Ingles (EUA) e Portugues (BR)
- [x] **Traducoes integradas**: Traducoes pre-definidas para todos os rotulos (preserva customizacoes)
- [x] **Alvo do link de privacidade**: Configure se o link de politica de privacidade abre em nova aba ou mesma aba
- [x] **Texto centralizado nos botoes**: Texto dos botoes sempre centralizado para aparencia consistente

### Preferencias e Categorias (v2.3)
- [x] **Controle do modal de preferencias**: Habilita/desabilita o modal de preferencias via `allowPreferencesModal`
- [x] **Categorias obrigatorias**: Torne qualquer categoria obrigatoria (Analytics, Marketing, Personalizacao)
- [x] **Comportamento estilo minimal**: Botao flutuante reexibe o banner ao inves de abrir preferencias
- [x] **Exibicao inteligente de botoes**: Botao "Aceitar Todos" oculto quando vindo do float (apos recusa/fechar)

### Modos de Consentimento
- [x] **Opt-in** (padrao LGPD/GDPR): Todos os cookies nao-essenciais bloqueados ate consentimento explicito
- [x] **Opt-out**: Cookies habilitados por padrao, usuario pode recusar
- [x] **Informativo**: Apenas banner, sem necessidade de escolha do usuario

### Estilos Visuais
- [x] **Minimo**: Banner simples com botoes aceitar/recusar
- [x] **Padrao**: Banner com link de politica e botoes de acao
- [x] **Detalhado**: Painel completo de preferencias com toggles por categoria

### Personalizacao
- [x] Posicao: inferior-esquerda, inferior-direita, inferior-centro, superior-esquerda, superior-direita, superior-centro
- [x] Cores: Fundo, texto, botoes, bordas (totalmente customizavel)
- [x] Tipografia: Familia da fonte, tamanhos, pesos
- [x] Animacoes: Slide, fade ou sem animacao
- [x] i18n: Suporte multi-idioma (EN, PT-BR inclusos)

### Conformidade Legal
- [x] LGPD (Brasil)
- [x] GDPR (UE & Reino Unido)
- [x] Diretiva ePrivacy (Lei de Cookies da UE)
- [x] CCPA/CPRA (California)
- [x] Leis de Privacidade de Estados dos EUA (Virginia, Colorado, Connecticut, etc.)
- [x] Estrutura pronta para IAB TCF 2.0

## Estrutura do Projeto

```
cookies_vue/
├── src/
│   ├── wwElement.vue              # Componente principal
│   └── components/
│       ├── CookieBanner.vue       # UI do banner
│       ├── CookiePreferences.vue  # Modal de preferencias
│       ├── CookieManager.vue      # Botao gerenciador
│       └── CategoryToggle.vue     # Toggle de categoria
├── docs/
│   ├── ADR.md                     # Decisoes de arquitetura
│   ├── PRD.md                     # Requisitos do produto (EN)
│   └── PRD.pt-BR.md              # Requisitos do produto (PT-BR)
├── AI_docs/
│   └── weweb-integration.md       # Notas de integracao WeWeb
├── ww-config.js                   # Configuracao WeWeb
├── package.json
└── README.md
```

## Propriedades de Configuracao

### Configuracoes Gerais

| Propriedade | Tipo | Padrao | Descricao |
|-------------|------|--------|-----------|
| `componentLanguage` | TextSelect | `en-US` | Idioma do componente: en-US, pt-BR |
| `consentMode` | TextSelect | `opt-in` | Modo de consentimento: opt-in, opt-out, informational |
| `bannerStyle` | TextSelect | `standard` | Estilo visual: minimal, standard, detailed |
| `position` | TextSelect | `bottom-left` | Posicao do banner na tela |
| `showManager` | OnOff | `true` | Mostrar botao gerenciador persistente |
| `cookieExpiration` | Number | `365` | Dias ate o consentimento expirar |
| `policyPageUrl` | Text | `""` | URL para pagina de politica de privacidade |
| `policyLinkNewTab` | OnOff | `true` | Abrir link de politica de privacidade em nova aba |
| `allowPreferencesModal` | OnOff | `true` | Permitir abertura do modal de preferencias |

### Categorias de Cookies

| Propriedade | Tipo | Padrao | Descricao |
|-------------|------|--------|-----------|
| `essentialLabel` | Text | `Essenciais` | Rotulo para cookies essenciais |
| `essentialDescription` | Text | `...` | Texto de descricao |
| `analyticsMode` | TextSelect | `optional` | Analytics: disabled, optional, required |
| `marketingMode` | TextSelect | `optional` | Marketing: disabled, optional, required |
| `personalizationMode` | TextSelect | `optional` | Personalization: disabled, optional, required |

### Configuracoes PRD-2 (v2.0)

| Propriedade | Tipo | Padrao | Descricao |
|-------------|------|--------|-----------|
| `googleConsentModeEnabled` | OnOff | `true` | Habilitar Google Consent Mode v2 |
| `googleConsentDefaultDenied` | OnOff | `true` | Disparar default denied no carregamento da pagina |
| `googleConsentMapMarketing` | OnOff | `true` | Mapear categoria marketing para sinais de ads |
| `metaPixelEnabled` | OnOff | `true` | Habilitar notificacoes de consentimento do Meta Pixel |
| `storageCookieEnabled` | OnOff | `true` | Habilitar armazenamento em cookie para cross-subdomain |
| `storageCookieDomain` | Text | `""` | Dominio do cookie (ex.: `.meudominio.com`) |
| `emitDefaultStateEvent` | OnOff | `true` | Emitir evento consentDefaulted no carregamento |
| `autoConsentBots` | OnOff | `false` | Auto-consentimento para bots/crawlers |
| `showManagerAfterDecline` | OnOff | `true` | Exibir botao flutuante apos usuario recusar |

### Estilizacao

| Propriedade | Tipo | Padrao | Descricao |
|-------------|------|--------|-----------|
| `backgroundColor` | Color | `#ffffff` | Cor de fundo do banner |
| `textColor` | Color | `#1f2937` | Cor do texto primario |
| `primaryButtonBg` | Color | `#10b981` | Fundo do botao aceitar |
| `secondaryButtonBg` | Color | `#6b7280` | Fundo do botao recusar |
| `borderRadius` | Length | `8px` | Raio dos cantos |

### Conteudo (i18n)

| Propriedade | Tipo | Padrao | Descricao |
|-------------|------|--------|-----------|
| `bannerTitle` | Text | `Consentimento de Cookies` | Titulo do banner |
| `bannerMessage` | Text | `...` | Texto de descricao do banner |
| `acceptAllLabel` | Text | `Aceitar Todos` | Texto do botao aceitar |
| `declineAllLabel` | Text | `Recusar` | Texto do botao recusar |
| `preferencesLabel` | Text | `Preferencias` | Texto do botao preferencias |

## Acoes de Workflow

### `showBanner()`
Exibe programaticamente o banner de consentimento de cookies.

```javascript
// WeWeb Workflow
Component.showBanner()
```

### `hideBanner()`
Oculta o banner de consentimento de cookies.

### `openPreferences()`
Abre o modal de preferencias para controle granular de cookies.

### `acceptAll()`
Aceita todas as categorias de cookies e armazena o consentimento.

### `declineAll()`
Recusa todos os cookies nao-essenciais.

### `savePreferences(categories)`
Salva preferencias especificas de categoria.

```javascript
// Exemplo de payload
{
  "analytics": true,
  "marketing": false,
  "personalization": true
}
```

### `resetConsent()`
Limpa o consentimento armazenado e exibe o banner novamente.

### `getConsentStatus()`
Retorna o status atual de consentimento para todas as categorias.

### `setConsent(categories, options)` (PRD-2)
Define consentimento programaticamente com controle total. Emite evento `consentChanged`.

```javascript
// Exemplo de uso
Component.setConsent(
  { analytics: true, marketing: false, personalization: true },
  { source: 'custom-ui' }
)
```

## Eventos de Trigger

Todos os eventos de trigger sao prefixados com "Cookie:" para facil identificacao nos workflows do WeWeb.

| Nome do Evento | Label (no WeWeb) | Payload | Descricao |
|----------------|------------------|---------|-----------|
| `consentGiven` | Cookie: Usuario Aceitou Todos os Cookies | `{ consentId, categories, timestamp }` | Usuario clicou em "Aceitar Todos" |
| `consentDeclined` | Cookie: Usuario Recusou Todos os Cookies | `{ consentId, timestamp }` | Usuario clicou em "Recusar" |
| `preferencesUpdated` | Cookie: Usuario Salvou Preferencias Personalizadas | `{ consentId, categories, timestamp }` | Usuario salvou preferencias customizadas |
| `bannerShown` | Cookie: Banner Exibido | `{ source? }` | Banner se tornou visivel |
| `bannerHidden` | Cookie: Banner Fechado | `{ reason }` | Banner foi fechado (reason: acceptAll, declineAll, savePreferences, manual, controller) |
| `preferencesOpened` | Cookie: Modal de Preferencias Aberto | `{}` | Modal de preferencias foi aberto |
| `preferencesClosed` | Cookie: Modal de Preferencias Fechado | `{}` | Modal de preferencias foi fechado |
| `consentStatusRetrieved` | Cookie: Status do Consentimento Obtido | `{ hasConsent, consent }` | Status de consentimento foi obtido via action |
| `consentDefaulted` | Cookie: Consentimento Padronizado | `{ hasConsent, effectiveConsent, timestamp }` | **(PRD-2)** Estado inicial negado aplicado |
| `consentChanged` | Cookie: Consentimento Alterado | `{ consentId, categories, previousCategories, timestamp, source }` | **(PRD-2)** Qualquer mudanca de consentimento ocorreu |

### Exemplos de Payload de Eventos

```javascript
// evento consentGiven
{
  "categories": {
    "essential": true,
    "analytics": true,
    "marketing": false,
    "personalization": true
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}

// evento preferencesUpdated
{
  "categories": {
    "analytics": false,
    "marketing": false,
    "personalization": true
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

## Triggers Customizados (Padrao fs-cc)

O componente suporta atributos HTML customizados para disparar acoes, inspirado no padrao Finsweet:

| Atributo | Elemento | Descricao |
|----------|----------|-----------|
| `data-cc="banner"` | Div | Identifica o wrapper do banner |
| `data-cc="allow"` | Button | Aceita todos os cookies |
| `data-cc="deny"` | Button | Recusa nao-essenciais |
| `data-cc="preferences"` | Div | Wrapper do painel de preferencias |
| `data-cc="open-preferences"` | Any | Abre modal de preferencias |
| `data-cc="close"` | Button | Fecha banner/preferencias |
| `data-cc="submit"` | Button | Salva preferencias |
| `data-cc-checkbox="analytics"` | Checkbox | Toggle de categoria analytics |
| `data-cc-checkbox="marketing"` | Checkbox | Toggle de categoria marketing |
| `data-cc-checkbox="personalization"` | Checkbox | Toggle de personalizacao |

## Estrutura de Dados no localStorage

O componente armazena automaticamente os dados de consentimento no localStorage com a chave `cookieConsent`:

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

### Lendo Status de Consentimento

```javascript
// Verificar consentimento do localStorage
const consent = JSON.parse(localStorage.getItem('cookieConsent'));

if (consent) {
  console.log('Consentimento dado em:', consent.timestamp);
  console.log('Analytics permitido:', consent.categories.analytics);
  console.log('Marketing permitido:', consent.categories.marketing);
}
```

### Beneficios da Abordagem Dupla

1. **localStorage (`cookieConsent`)**: Persistencia automatica, disponivel no carregamento da pagina
2. **Eventos de Trigger**: Enviar para workflows WeWeb para armazenamento em banco de dados, integracao com analytics, etc.

## Exemplos de Uso

### Implementacao Basica

1. Adicione o componente na sua pagina WeWeb
2. Configure a URL da pagina de politica
3. Personalize as cores para combinar com sua marca
4. Configure os triggers de workflow para eventos de consentimento

### Com Google Analytics

```javascript
// No evento 'consentGiven'
if (event.categories.analytics) {
  // Inicializar Google Analytics
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
}
```

### Bloqueio de Scripts

Marque scripts com o atributo `data-cc-category` para controlar execucao:

```html
<script data-cc-category="analytics" type="text/plain">
  // Este script so executa se consentimento de analytics for dado
</script>
```

### Reutilizando o Componente em Varias Paginas (Multi-page Sections)

Componentes customizados do WeWeb nao persistem configuracoes automaticamente entre paginas. Para reutilizar o mesmo componente configurado em varias paginas:

1. **Configure o componente** na primeira pagina (propriedades, bindings, workflows)
2. **Renomeie a Section** que contem o componente (ex.: `CookieConsent - Main`)
3. Em outra pagina, va em **Add → Multi-page sections → Pages → [pagina origem]**
4. **Arraste a Section** para a pagina de destino
5. Quando perguntado, escolha **Create an instance** (nao "Create a copy")

Agora o componente compartilha a mesma configuracao em todas as paginas. Alteracoes em uma instancia atualizam todas as outras.

> **Dica:** Use "Create a copy" apenas se precisar de uma variacao independente em uma pagina especifica.

## Suporte de Navegadores

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Opera 67+

## Contribuindo

1. Faca um fork do repositorio
2. Crie uma branch de feature (`git checkout -b feature/funcionalidade-incrivel`)
3. Commite suas mudancas (`git commit -m 'feat: adiciona funcionalidade incrivel'`)
4. Faca push para a branch (`git push origin feature/funcionalidade-incrivel`)
5. Abra um Pull Request

## Licenca

Licenca MIT - veja [LICENSE](LICENSE) para detalhes.

## Referencias

- [Shadcn Cookie Consent](https://shadcnstudio.com/blocks/marketing-ui/cookies-consent)
- [Finsweet Cookie Consent](https://finsweet.com/cookie-consent)
- [Vaadin Cookie Consent](https://github.com/vaadin/vaadin-cookie-consent)
- [Figma Cookie Consent UI Kit](https://www.figma.com/community/file/972524923877381263)
