# Cookie Consent (WeWeb Component) — Project Brief

## 1) Snapshot (resumo em 10 linhas)

- **O que é o produto:** Componente WeWeb Vue 3 GDPR-compliant de cookie consent com Google Consent Mode v2, Meta Pixel integration, cross-subdomain sync, UUID consent IDs, 3 modos de consentimento, 3 estilos visuais.
- **Para quem é:** Desenvolvedores WeWeb construindo sites compatíveis com GDPR, ePrivacy, CCPA/CPRA e leis de privacidade US, necessitando controle granular de cookies.
- **Principal problema que resolve:** Implementa compliance de privacidade completo (banner + modal de preferências + float manager) com integração automática Google/Meta, storage persistente (localStorage + cookie cross-subdomain), trigger events para workflows, sem código custom.
- **Principais fluxos do usuário:** (1) Usuário acessa site → Banner aparece, (2) Aceita/Recusa/Customiza categorias, (3) Preferências salvas em localStorage + cookie (cross-subdomain) + emite events, (4) Google Consent Mode v2 + Meta Pixel notificados automaticamente, (5) Float button permite reabrir preferências.
- **Diferencial / proposta de valor:** Dual storage (localStorage `cookieConsent` + cookie cross-subdomain), Google Consent Mode v2 com default denied + update automático, Meta Pixel `fbq('consent')` calls, UUID consent IDs (crypto.randomUUID), 3 consent modes (opt-in GDPR/opt-out/informational), 3 visual styles (minimal/standard/detailed), granular categories (Essential/Analytics/Marketing/Personalization com required/optional/disabled), i18n built-in (EN/PT-BR), 10 trigger events + 8 actions programáticas, IAB TCF 2.0 ready structure, bot/crawler auto-consent.
- **Status atual (MVP / em produção / manutenção / refactor):** Produção (v2.3) com PRD-2 features implementadas.
- **Ambiente(s) (dev/stage/prod):** Dev HTTPS localhost:8080 (WeWeb CLI), Prod (integração WeWeb).
- **URLs importantes (se existirem):** Docs completa: PRD/PRD-2/ADR em `/docs`.
- **Repositório(s) (se existirem):** C:\Users\dsoliveira\Documents\Github\cookies_vue.
- **Responsável / stakeholders (se existirem):** Desenvolvedor: dsoliveira, Componente reutilizável WeWeb compliance.

## 2) Escopo do meu trabalho

### 2.1 O que eu construí

- [x] **Core cookie consent:** Banner + modal de preferências + float manager button, persistência em localStorage (key `cookieConsent`) + trigger events para workflows.
- [x] **4 categorias granulares:** Essential (sempre enabled), Analytics/Marketing/Personalization (disabled/optional/required configurável via props).
- [x] **PRD-2 features (v2.0):** Google Consent Mode v2 (default denied on load + update on consent), Meta Pixel integration (`fbq('consent', 'grant/revoke')`), cross-subdomain sync (cookie-based), UUID consent IDs (crypto.randomUUID + fallback), action `setConsent()` programática, events `consentDefaulted`/`consentChanged`.
- [x] **Float button behavior (v2.1):** Smart visibility (só aparece após decline/close, nunca após accept), configurável `showManagerAfterDecline`, bot/crawler detection (Googlebot, Bingbot auto-consent).
- [x] **i18n (v2.2):** Language selector (en-US/pt-BR), built-in translations preservando customizações, privacy link target (new tab/same tab), centered button text.
- [x ] **Preferences control (v2.3):** `allowPreferencesModal` toggle (habilita/desabilita modal), required categories (tornar Analytics/Marketing/Personalization obrigatórias), minimal style behavior (float re-shows banner em vez de abrir modal), smart button display (esconde "Accept All" quando vem de float após decline/close).
- [x] **3 consent modes:** opt-in (GDPR default - cookies bloqueados até consent explícito), opt-out (cookies enabled, user pode recusar), informational (apenas informativo sem escolha).
- [x] **3 visual styles:** minimal (banner simples com accept/decline), standard (banner + policy link + ações), detailed (painel completo com toggles de categoria).
- [x] **Customização completa:** 5 posições (bottom/top × left/right/center), cores (background/text/buttons/borders), tipografia (font family/sizes/weights), animações (slide/fade/none).
- [x] **localStorage structure:** JSON com version, timestamp, consentId (UUID), mode, categories, expiration.
- [x] **Script gating:** Atributo `data-cc-category` para controlar execução de scripts (analytics/marketing/personalization) até consent.
- [x] **Custom triggers (fs-cc pattern):** Atributos `data-cc="allow/deny/preferences/..."` para integração com HTML custom.
- [x] **10 trigger events:** consentGiven, consentDeclined, preferencesUpdated, bannerShown/Hidden, preferencesOpened/Closed, consentStatusRetrieved, consentDefaulted (PRD-2), consentChanged (PRD-2).
- [x] **8 actions:** showBanner, hideBanner, openPreferences, acceptAll, declineAll, savePreferences, resetConsent, getConsentStatus, setConsent (PRD-2).
- [x] **Documentação técnica:** PRD (EN/PT-BR), PRD-2 (EN/PT-BR), ADR (Architecture Decision Record), WeWeb integration guide.

### 2.2 O que eu dei manutenção / corrigi

- **Bugfixes:** Correção de float button aparecendo após accept (v2.1), fix de cross-subdomain sync em Safari (cookie SameSite).
- **Melhorias de performance:** Debounce de localStorage writes (100ms).
- **Refactors:** Modularização de components (Banner/Preferences/Manager/CategoryToggle separados).

### 2.3 Fora de escopo

- **Itens não incluídos:** TCF 2.0 full implementation (estrutura pronta mas sem vendors CMP), GPC (Global Privacy Control) signal, consent analytics dashboard, multi-domain sync (apenas cross-subdomain).
- **Dependências:** WeWeb CLI, navegadores com crypto.randomUUID (fallback included).

## 3) Produto e Regras de Negócio

### 3.1 Regras principais

- ** RN-01:** Modo opt-in (GDPR): Todos cookies não-essenciais bloqueados até consent explícito.
- **RN-02:** Google Consent Mode v2: Default denied disparado no page load, update em accept/decline/savePreferences.
- **RN-03:** Meta Pixel: `fbq('consent', 'grant')` ao aceitar marketing, `fbq('consent', 'revoke')` ao recusar.
- **RN-04:** Cross-subdomain: Cookie criado em domain raiz (ex: `.mydomain.com`) para compartilhar consent entre `app.mydomain.com` e `blog.mydomain.com`.
- **RN-05:** UUID consent IDs: Cada consent action gera UUID único via crypto.randomUUID (ou fallback manual).
- **RN-06:** Categorias required: Se Analytics/Marketing/Personalization configuradas como `required`, toggles ficam disabled/checked permanentemente.
- **RN-07:** Bot auto-consent: User-agent matching Googlebot/Bingbot/etc auto-aceita para não afetar SEO.
- **RN-08:** Float button visibility: Só aparece após user decline/close, nunca após accept (UX best practice).
- **RN-09:** Expiration: Cookie expira após X dias (default 365), renova ao reabrir banner.
- **RN-10:** Event prefixing: Todos events prefixados "Cookie:" para fácil identificação em workflows WeWeb.

### 3.2 Casos de borda

- **CB-01:** localStorage bloqueado (Private Browsing) → Fallback para sessionStorage, log warning.
- **CB-02:** Cookie bloqueado (strict settings) → Cross-subdomain sync falha, apenas localStorage funciona.
- **CB-03:** Google Consent Mode script não carregado → Componente funciona normalmente, não emite gtag() calls.
- **CB-04:** Meta Pixel script ausente → Não emite fbq() calls, sem erros.
- **CB-05:** User modifica localStorage manualmente → Componente valida schema, reseta se inválido.
- **CB-06:** Float button clicado com `allowPreferencesModal=false` → Re-shows banner em vez de abrir modal (v2.3).
- **CB-07:** Minimal style + float button → Banner aparece sem "Accept All" button (UX improvement v2.3).
- **CB-08:** crypto.randomUUID não suportado (browsers antigos) → Fallback para timestamp+random.

## 4) Tecnologias e Stack

### 4.1 Front-end

- **Framework:** Vue 3 (Options API - compatibilidade WeWeb)
- **Linguagem:** JavaScript (ES6+)
- **UI libs:** Custom components (Banner/Preferences/Manager/CategoryToggle)
- **State management:** Vue reactive (data/computed/watch)
- **Build tool:** WeWeb CLI
- **Padrões:** Component-driven, props-based, event-driven
- **i18n:** Built-in dictionaries (en-US/pt-BR)

### 4.2-4.4 Back-end / Banco / Infra

- N/A (componente frontend, storage em localStorage + cookies browser-side)

## 5) Arquitetura (visão prática)

**Módulos:**
- **wwElement.vue:** Componente raiz, orquestração
- **CookieBanner.vue:** Banner UI (minimal/standard/detailed styles)
- **CookiePreferences.vue:** Modal de preferências com category toggles
- **CookieManager.vue:** Float button persistente
- **CategoryToggle.vue:** Toggle switch reutilizável (disabled/optional/required)

**Fluxo consentimento:**
1. Page load → Check localStorage `cookieConsent` → Se não existe, show banner + emit `consentDefaulted` (PRD-2) + fire Google default denied
2. User action (accept/decline/savePreferences) → Update localStorage + create/update cookie (cross-subdomain) → Emit event (`consentGiven`/`consentDeclined`/`preferencesUpdated`) + emit `consentChanged` (PRD-2) → Fire Google Consent Mode update + Meta Pixel consent
3. Float button click → Reopen preferences (ou banner se `allowPreferencesModal=false`)

**Storage structure:**
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "consentId": "cc_abc123-uuid",
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

## 6) Integrações

### Google Consent Mode v2

- **Serviço:** Google Tag Manager / Google Analytics
- **Motivo:** Compliance GDPR com ads/analytics
- **Tipo:** JavaScript API (gtag)
- **Eventos:** `gtag('consent', 'default', {...})` no load, `gtag('consent', 'update', {...})` no consent
- **Riscos:** Script gtag.js deve estar carregado antes do componente (instruções em docs)

### Meta Pixel

- **Serviço:** Facebook/Meta Pixel analytics
- **Motivo:** Compliance com marketing consent
- **Tipo:** JavaScript API (fbq)
- **Eventos:** `fbq('consent', 'grant/revoke')`
- **Riscos:** Script fbq deve estar carregado

## 7-9) UI / Qualidade / Evidências

- **Altamente customizável:** Cores, tipografia, posições, animações via props
- **GDPR/CCPA compliant:** Opt-in, granular categories, reset consent
- **Performance:** Debounced storage writes, CSS-only animations
- **Accessibility:** ARIA labels (TBD - oportunidade melhoria)
- **Docs completas:** PRD/PRD-2/ADR, integration guide
- **Antes/depois:** Sites sem compliance → Sites totalmente GDPR-compliant com 1 componente drag-and-drop

## 10) Próximos passos

**Curto prazo:**
- [ ] ARIA labels completos
- [ ] GPC (Global Privacy Control) signal
- [ ] Testes E2E (Playwright)

**Médio prazo:**
- [ ] TCF 2.0 full vendors CMP
- [ ] Consent analytics dashboard (relatório de consent rates)
- [ ] A/B testing de mensagens

**Longo prazo:**
- [ ] Multi-domain sync (além de subdomain)
- [ ] Visual editor de banner no WeWeb
- [ ] Templates pré-configurados (GDPR strict, CCPA compliant, etc.)

## 11) Perguntas em aberto

1. TCF 2.0 com vendors CMP é prioritário?
2. GPC signal deve ser implementado?
3. Consent analytics dashboard necessário?

## 12) Resumo para Proposal

### 12.1 Curta

Desenvolvemos componente WeWeb GDPR-compliant de cookie consent com Google Consent Mode v2, Meta Pixel integration, cross-subdomain sync, UUID consent IDs, 3 modes (opt-in/opt-out/informational), 3 visual styles (minimal/standard/detailed), granular categories (Analytics/Marketing/Personalization), i18n (EN/PT-BR), dual storage (localStorage + cookie), 10 trigger events + 8 actions, bot auto-consent, documentação completa (PRD/PRD-2/ADR).

### 12.2 Média

Construímos solução completa de cookie consent para WeWeb (v2.3) com compliance total GDPR/ePrivacy/CCPA/CPRA implementando Google Consent Mode v2 (default denied on load + update automático em accept/decline/savePreferences), Meta Pixel integration (`fbq('consent', 'grant/revoke')` automático), cross-subdomain sync via cookie em domain raiz (compartilha consent entre subdomains), UUID consent IDs via crypto.randomUUID (+ fallback), 3 consent modes (opt-in GDPR default bloqueia cookies até consent explícito, opt-out habilita por padrão mas permite recusa, informational apenas informa sem escolha), 3 visual styles (minimal banner simples accept/decline, standard com policy link,  detailed com painel completo category toggles), granular categories (Essential sempre enabled + Analytics/Marketing/Personalization configuráveis disabled/optional/required), i18n built-in (en-US/pt-BR com language selector preservando customizações), dual storage approach (localStorage key `cookieConsent` com JSON estruturado + cookie cross-subdomain + trigger events para workflows WeWeb), 10 trigger events prefixados "Cookie:" (consentGiven/Declined/preferencesUpdated/bannerShown/Hidden/preferences Opened/Closed/consentStatusRetrieved/consentDefaulted/consentChanged com payloads descritivos), 8 actions programáticas (showBanner/hideBanner/openPreferences/acceptAll/declineAll/savePreferences/resetConsent/getConsentStatus/setConsent), smart float button visibility (só aparece após decline/close, nunca após accept), bot/crawler auto-consent (Googlebot/Bingbot não afetam SEO), documentation completa (PRD/PRD-2 EN+PT-BR, ADR, integration guide).

### 12.3 Longa

Desenvolvemos componente Vue 3 completo e production-ready de cookie consent GDPR-compliant para WeWeb (versão 2.3 com PRD-2 features) implementando compliance total com GDPR (EU+UK), ePrivacy Directive (EU Cookie Law), CCPA/CPRA (California), US State Privacy Laws (Virginia/Colorado/Connecticut), e IAB TCF 2.0 ready structure. Sistema de consent mode oferece 3 opções: (1) opt-in (GDPR default) bloqueia todos cookies não-essenciais até consent explícito do usuário (máxima privacidade), (2) opt-out habilita cookies por padrão permitindo usuário recusar posteriormente (comum em US), (3) informational apenas informa sobre cookies sem requerer ação (compliance mínimo). Visual styles customizáveis em 3 níveis: (1) minimal exibe banner simples com botões accept/decline (menos intrusivo), (2) standard adiciona policy link e action buttons (recommended), (3) detailed mostra painel completo com category toggles inline (máximo controle usuário). Google Consent Mode v2 integração automática via gtag API firing `gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ...})` no page load garantindo compliance desde primeiro momento + `gtag('consent', 'update', {analytics_storage: 'granted', ...})` dinâmico em accept/decline/savePreferences mapeando categories (marketing category → ad_storage/ad_user_data/ad_personalization signals configurável via `googleConsentMapMarketing`). Meta Pixel integration notifica Facebook automaticamente via `fbq('consent', 'grant')` ao aceitar marketing category ou `fbq('consent', 'revoke')` ao recusar, garantindo compliance tracking de campanhas Facebook Ads. Cross-subdomain synchronization via cookie criado em domain raiz (ex: configurar `storageCookieDomain=".mydomain.com"`) permitindo compartilhar consent entre `app.mydomain.com`+`blog.mydomain.com`+`shop.mydomain.com` sem re-perguntar (UX superior), cookie persiste por cookieExpiration days (default 365) com auto-renewal. UUID consent IDs gerados via crypto.randomUUID (browsers modernos) ou fallback timestamp+random (browsers antigos) fornecendo rastreabilidade única de cada consent action para auditoria GDPR Article 7 (demonstrar consentimento válido). Granular category management com 4 categorias: Essential (sempre enabled, cookies necessários funcionamento básico site), Analytics/Marketing/Personalization (cada configurável via props como disabled não exibe, optional usuário escolhe default unchecked, required sempre checked e disable toggle), sistema de toggles visuais com estados clara (CategoryToggle.vue component reutilizável). Dual storage approach garante persistence cross-page e cross-session: (1) localStorage key `cookieConsent` com JSON estruturado incluindo version/timestamp/consentId/mode/categories/expiration (leitura imediata page load, não expira com session), (2) cookie `cookieConsent` em domain raiz para cross-subdomain sync (mesma estrutura JSON encoded), (3) trigger events emitidos para workflows WeWeb permitindo database storage/analytics/conditional logic. Sistema de events oferece 10 triggers prefixados "Cookie:" para identificação fácil workflows: consentGiven (user accepted all com payload {consentId, categories, timestamp}), consentDeclined (declined all), preferencesUpdated (saved custom com payload categories anteriores vs atuais), bannerShown/Hidden (com reason: acceptAll/declineAll/savePreferences/manual/controller), preferencesOpened/Closed, consentStatusRetrieved (via action getConsentStatus), consentDefaulted PRD-2 (initial denied state applied com payload {hasConsent: false, effectiveConsent: all denied, timestamp}), consentChanged PRD-2 (any consent change com payload {consentId, categories, previousCategories, timestamp, source}). Actions programáticas para controle via workflows: showBanner/hideBanner (display control), openPreferences (força modal preferências), acceptAll/declineAll (programmatic consent), savePreferences(categories) (custom categories via code), resetConsent (clear storage e re-show banner), getConsentStatus (retrieve current state), setConsent(categories, options) PRD-2 (full programmatic control com source tracking). Smart behaviors v2.1+ incluindo float button visibility inteligente (só aparece após user decline/close nunca após accept evitando re-pergunta desnecessária UX anti-pattern), configurável via `showManagerAfterDecline`, bot/crawler detection auto-consent (user-agent matching Googlebot/Bingbot/etc aceita automaticamente evitando impacto SEO crawling), preferences modal control via `allowPreferencesModal` toggle (quando false float button re-shows banner em vez de modal, útil minimal style sites), required categories (Analytics/Marketing/Personalization podem ser mandatory com toggles disabled+checked permanentemente), minimal style smart button (esconde "Accept All" quando vem de float após decline/close evitando confusion UX). i18n system v2.2 com language selector WeWeb prop (en-US/pt-BR), built-in translations completas para todos labels (bannerTitle, bannerMessage, acceptAllLabel, declineAllLabel, preferencesLabel, essentialLabel/Description, analytics/marketing/personalizationLabel/Description, privacyPolicy link, etc.), sistema preserva customizações usuário (se customizar bannerTitle em PT, permanece customizado ao trocar idioma), privacy link target configurável (new tab vs same tab via `policyLinkNewTab`), centered button text sempre (visual consistency). Custom triggers fs-cc pattern para integração HTML custom via atributos data (inspirado Finsweet): `data-cc="allow/deny/preferences/open-preferences/close/submit"` em buttons, `data-cc-checkbox="analytics/marketing/personalization"` em checkboxes permitindo UI custom totalmente controlada. Componente altamente customizável via 40+ props WeWeb: general (consentMode, bannerStyle, position bottom/top×left/right/center, showManager, cookieExpiration, policyPageUrl, policyLinkNewTab, allowPreferencesModal), categories (essentialLabel/Description, analytics/marketing/personalizationMode disabled/optional/required), PRD-2 settings (googleConsentModeEnabled, googleConsentDefaultDenied, googleConsentMapMarketing, metaPixelEnabled, storageCookieEnabled/Domain, emitDefaultStateEvent, autoConsentBots, showManagerAfterDecline), styling (backgroundColor, textColor, primaryButtonBg, secondaryButtonBg, borderRadius, fontFamily/Size/Weight), content i18n (todos labels customizáveis). Performance optimizations incluem debounced localStorage writes (100ms evitar writes excessivos), CSS-only animations (GPU-accelerated sem JS overhead), lazy loading de preferences modal (só renderiza ao abrir), memory-efficient event handlers (cleanup on unmount). Documentação técnica enterprise-grade inclui PRD (Product Requirements Document) completo em EN+PT-BR descrevendo features/user stories/acceptance criteria, PRD-2 documento separado para v2.0 updates (Consent Mode v2, Meta Pixel, cross-subdomain, UUID, setConsent action, new events), ADR (Architecture Decision Record) explicando decisões técnicas (dual storage rationale, Google/Meta integration approach, UUID vs timestamp IDs, cross-subdomain cookie strategy), WeWeb integration guide com step-by-step setup instructions, examples de workflows common (Google Analytics conditional load, save consent to database, A/B testing de mensagens). Componente production-ready utilizado em projetos reais WeWeb, testado cross-browser (Chrome/Firefox/Safari/Edge 80+), mobile-responsive, e pronto para evolução com TCF 2.0 vendors CMP, GPC signal, consent analytics dashboard, multi-domain sync além de subdomain.
