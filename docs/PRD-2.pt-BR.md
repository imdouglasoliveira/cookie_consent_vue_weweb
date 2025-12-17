# PRD-2: Atualizacoes do Componente Cookie Consent — Consentimento, IDs e Integracoes

**Versao:** 2.0
**Data:** 2024-12-16
**Status:** Rascunho
**Autor:** Equipe de Desenvolvimento

---

## 1. Visao Geral

### 1.1 Proposito
Evoluir o componente Cookie Consent para um **modo opt-in compliance-first** com integracoes opcionais e comportamento previsivel entre subdominios.

### 1.2 Estado Atual
O componente ja:
- Salva consentimento em `localStorage` (`cookieConsent`) com fallback em cookie
- Dispara eventos (`consentGiven`, `preferencesUpdated`, etc.) e expoe acoes publicas (workflows)
- Implementa **script gating** com `data-cc-category` + `type="text/plain"` e ativa via `enableScripts()`
- Gera `consentId` com `Date.now()` + `Math.random()`

### 1.3 Desafios
Faltam garantias e padronizacoes para:
- Sincronizacao entre subdominios/sessoes
- Consent Mode v2 completo (default denied + update)
- Geracao de consentId mais robusta
- API publica mais consistente (acoes/eventos/config)
- Configuracao explicita para **notificar** GA/Meta Pixel quando consentimento muda
- Estado inicial como "negado/ausente" ate o usuario escolher

### 1.4 Usuarios Alvo
- **Visitantes**: "Quero navegar sem ser rastreado antes de aceitar."
- **Admin/Dev**: "Quero controlar GA/Pixel por config sem mexer em varios pontos do site."
- **Compliance**: "Preciso provar que o default era negado e so habilitou apos acao do usuario."

---

## 2. Objetivos

| ID | Objetivo | Metrica de Sucesso |
|----|----------|-------------------|
| O-01 | Implementar estado inicial compliance-first | Default denied verificado na primeira visita |
| O-02 | Suporte completo ao Google Consent Mode v2 | Todos os 4 sinais (analytics_storage, ad_storage, ad_user_data, ad_personalization) |
| O-03 | Sincronizacao de consentimento entre subdominios | Consentimento reconhecido em sub.dominio.com |
| O-04 | Geracao robusta de ID de consentimento | Formato UUID v4 com fallback |
| O-05 | API publica consistente | Nomes padronizados de acoes/eventos |

---

## 3. Escopo

### 3.1 Dentro do Escopo
1. Sincronizar consentimento entre **subdominios** e melhorar persistencia de sessao
2. Implementar **Google Consent Mode v2 completo**
3. Melhorar geracao do `consentId` (UUID)
4. Tornar API publica mais consistente (nomes, payload, acoes)
5. Config para controlar:
   - Se notifica GA (Consent Mode update)
   - Se notifica Meta Pixel (consent grant/revoke)
   - Se aplica "default denied" na inicializacao
6. Definir estado inicial como **negado/ausente** (ate clique do usuario)

### 3.2 Fora do Escopo (PRD-2)
- Vendors IAB TCF 2.0 / TC string (pode virar PRD-3)
- Scanner automatico de cookies
- Backend obrigatorio (opcional via triggers continua)

---

## 4. Premissas

- O componente continuara sendo usado dentro do **WeWeb** (workflows + triggers)
- Scripts de terceiros podem ser "gated" no HTML via `type="text/plain"` e `data-cc-category`
- Para Consent Mode v2, seguiremos a logica: **"default denied" o mais cedo possivel** e "update" quando o usuario escolher

---

## 5. Requisitos Funcionais

### Epico A — Estado Inicial "negado/ausente"

#### A1. Estado Padrao
**Prioridade:** Critica

- Quando nao existe consentimento armazenado, o estado interno deve ser "noConsent"
- Em modo `opt-in`, **nao ativar** analytics/marketing/personalization
- O banner deve aparecer (como ja acontece) quando nao ha consentimento e nao e "informational"

**Criterios de Aceitacao:**
- [ ] Estado e "noConsent" quando localStorage esta vazio
- [ ] Scripts nao executam antes de consentimento explicito em modo opt-in
- [ ] Banner aparece automaticamente para visitantes de primeira vez

#### A2. Eventos Iniciais (opcional)
**Prioridade:** Media

- Emitir um evento opcional `Cookie: Consent Defaulted` (novo) informando:
  - `hasConsent: false`
  - `effectiveConsent: denied` por categoria (por padrao)
- Controlado por config: `emitDefaultStateEvent`

**Criterios de Aceitacao:**
- [ ] Evento dispara no carregamento da pagina quando nao existe consentimento
- [ ] Evento e configuravel (pode ser desabilitado)
- [ ] Payload inclui todas as categorias como denied

---

### Epico B — Google Consent Mode v2 Completo

#### B1. Default Denied (novo)
**Prioridade:** Critica

Implementar chamada automatica (configuravel) ao carregar o componente:
- `gtag('consent','default', {... denied ...})`

Deve rodar **o mais cedo possivel** (idealmente em `mounted()` imediatamente, ou em um "init method" que o WeWeb chame no page load).

Valores minimos:
- `analytics_storage: 'denied'`
- `ad_storage: 'denied'`
- `ad_user_data: 'denied'`
- `ad_personalization: 'denied'`

**Justificativa:** O "default" deve ser executado cedo e pode iniciar tudo como denied.

**Criterios de Aceitacao:**
- [ ] Default denied roda antes de qualquer script executar
- [ ] Todos os 4 sinais de consentimento sao definidos como 'denied'
- [ ] Funciona com carregamento assincrono de scripts

#### B2. Update na Escolha
**Prioridade:** Critica

Ao aceitar tudo ou salvar preferencias, chamar `gtag('consent','update', {...})` refletindo categorias.

Exemplo: se analytics=true → `analytics_storage: 'granted'` e o resto permanece denied.

Controlado por config: `googleConsentMode.enabled`

**Criterios de Aceitacao:**
- [ ] Update dispara no acceptAll
- [ ] Update dispara no savePreferences
- [ ] Apenas categorias concedidas mudam para 'granted'

#### B3. Mapeamento Categoria para Consent Mode
**Prioridade:** Alta

| Categoria | Sinal(is) do Consent Mode |
|-----------|--------------------------|
| `analytics` | `analytics_storage` |
| `marketing` | `ad_storage`, `ad_user_data`, `ad_personalization` |

Mapeamento granular opcional configuravel via: `googleConsentMode.mapMarketingToAdsStorage`

**Criterios de Aceitacao:**
- [ ] Mapeamento esta correto e documentado
- [ ] Mapeamento granular e opcional

#### B4. Compatibilidade com Script Gating
**Prioridade:** Alta

Mesmo com Consent Mode, manter o script gating como garantia (defesa em profundidade).

**Criterios de Aceitacao:**
- [ ] Script gating funciona independentemente do Consent Mode
- [ ] Ambos mecanismos podem funcionar juntos

---

### Epico C — Notificacao Meta Pixel

#### C1. Atualizar Consentimento Meta
**Prioridade:** Media

- Quando `marketing` se torna `true`, chamar `fbq('consent', 'grant')`
- Quando `marketing` se torna `false`, chamar `fbq('consent', 'revoke')` (quando aplicavel)
- Controlado por config: `metaPixel.enabled`

> Nota: Se o pixel nem estiver carregado porque voce o mantem gated, o "grant/revoke" so faz sentido quando `fbq` existir. Entao o comportamento padrao deve ser: **tentativa segura** (check `typeof fbq === 'function'`).

**Criterios de Aceitacao:**
- [ ] Grant e chamado quando marketing e aceito
- [ ] Revoke e chamado quando marketing e recusado
- [ ] Verificacao segura da existencia do fbq antes de chamar

---

### Epico D — Sincronizacao entre Subdominios

#### D1. Cookie de Consentimento Real (novo)
**Prioridade:** Alta

Hoje voce cria um cookie simples `cookieConsent=1` como fallback. Atualizar para armazenar:
- Um *minimo* de estado em cookie (ex.: versao + categorias + timestamp) **ou** um hash/ID que permita recuperar o estado do `localStorage` quando necessario
- Config: `storage.cookie.enabled`

**Criterios de Aceitacao:**
- [ ] Cookie contem dados significativos de consentimento
- [ ] Cookie pode inicializar localStorage em novo subdominio

#### D2. Suporte a Dominio Compartilhado
**Prioridade:** Alta

- Adicionar config `storage.cookie.domain` (ex.: `.meudominio.com`)
- Se definido, setar cookie com `domain=.meudominio.com` para compartilhar entre subdominios

**Criterios de Aceitacao:**
- [ ] Config de dominio esta disponivel no ww-config
- [ ] Cookie e definido com atributo de dominio correto

#### D3. Estrategia de Fonte da Verdade
**Prioridade:** Media

Prioridade recomendada:
1. `localStorage.cookieConsent` (completo)
2. cookie (minimo) para bootstrap cross-subdomain
3. (opcional) trigger/workflow para backend

Quando detectar cookie cross-subdomain e nao houver localStorage, "hidratar" localStorage a partir do cookie.

**Criterios de Aceitacao:**
- [ ] Ordem de prioridade e respeitada
- [ ] Hidratacao funciona de cookie para localStorage

#### D4. Migracao Compativel
**Prioridade:** Baixa

Se achar o cookie antigo `cookieConsent=1`, tratar como "consentimento existe" mas sem categorias → abrir banner ou assumir "declined" (por config `legacyCookiePolicy`).

**Criterios de Aceitacao:**
- [ ] Formato antigo de cookie e reconhecido
- [ ] Comportamento de migracao e configuravel

---

### Epico E — Melhor Geracao de consentId

#### E1. UUID Nativo
**Prioridade:** Media

Trocar `generateConsentId()` atual por:
- `crypto.randomUUID()` quando disponivel
- Fallback para metodo atual quando nao disponivel

Formato sugerido: `cc_<uuid-v4>`

**Criterios de Aceitacao:**
- [ ] UUID e usado quando crypto.randomUUID esta disponivel
- [ ] Fallback funciona em navegadores antigos
- [ ] Formato e cc_<uuid>

#### E2. Reuso do ConsentId
**Prioridade:** Baixa

Definir regra:
- Novo `consentId` somente quando o usuario **faz uma nova escolha** (accept/decline/save)
- `getLastConsent()` continua retornando o ultimo evento salvo

**Criterios de Aceitacao:**
- [ ] ConsentId muda em nova escolha
- [ ] Mesma recuperacao de consentimento retorna mesmo ID

---

### Epico F — API Publica Mais Consistente

#### F1. Padronizacao de Acoes
**Prioridade:** Alta

Hoje suas acoes existem e chamam handlers. Padronizar nomes e assinaturas:

| Acao | Argumentos | Descricao |
|------|------------|-----------|
| `showBanner()` | nenhum | Exibe o banner de consentimento |
| `hideBanner({ reason? })` | `{ reason?: string }` | Oculta o banner de consentimento |
| `openPreferences()` | nenhum | Abre modal de preferencias |
| `closePreferences()` | nenhum | Fecha modal de preferencias |
| `setConsent(categories, options)` | `{ analytics, marketing, personalization }, { source }` | **Novo** - Setter geral de consentimento (substitui `savePreferences`) |
| `resetConsent()` | nenhum | Limpa consentimento e exibe banner |
| `getConsentStatus()` | nenhum | Retorna estado atual de consentimento |

**Criterios de Aceitacao:**
- [ ] Todas as acoes tem nomenclatura consistente
- [ ] setConsent e mais geral que savePreferences
- [ ] Compatibilidade retroativa mantida por 1 versao

#### F2. Padronizacao de Eventos
**Prioridade:** Alta

Manter eventos atuais e adicionar:

| Evento | Label | Payload |
|--------|-------|---------|
| `consentDefaulted` | Cookie: Consent Defaulted | `{ hasConsent: false, effectiveConsent }` |
| `consentChanged` | Cookie: Consent Changed | `{ consentId, categories, timestamp, source }` |

Payload deve ser consistente com o que voce ja monta (consentId, categories, timestamp, browser/page/source/ip).

**Criterios de Aceitacao:**
- [ ] Novos eventos sao adicionados
- [ ] Eventos existentes continuam funcionando
- [ ] Payload e consistente entre eventos

#### F3. Novas Configs (props WeWeb)
**Prioridade:** Alta

Adicionar ao `ww-config.js`:

| Config | Tipo | Padrao | Descricao |
|--------|------|--------|-----------|
| `googleConsentMode.enabled` | bool | `false` | Habilita Google Consent Mode v2 |
| `googleConsentMode.defaultDeniedOnLoad` | bool | `true` | Dispara default denied no carregamento |
| `googleConsentMode.mapMarketingToAdsStorage` | bool | `true` | Mapeia categoria marketing para sinais de ads |
| `metaPixel.enabled` | bool | `false` | Habilita notificacoes de consentimento Meta Pixel |
| `storage.cookie.enabled` | bool | `true` | Habilita armazenamento em cookie |
| `storage.cookie.domain` | text | `""` | Dominio do cookie para cross-subdomain |
| `emitDefaultStateEvent` | bool | `false` | Emite evento consentDefaulted no carregamento |

**Criterios de Aceitacao:**
- [ ] Todas as configs estao no ww-config.js
- [ ] Configs tem valores padrao apropriados
- [ ] Configs sao bindable no WeWeb

---

## 6. Requisitos Nao-Funcionais

| Requisito | Descricao |
|-----------|-----------|
| **Seguranca/Privacidade** | Nao habilitar scripts nao-essenciais antes de consentimento (gating permanece obrigatorio) |
| **Compatibilidade** | Manter eventos atuais e acoes antigas com depreciacao (1 versao) |
| **Performance** | Init deve ser leve; sem chamadas externas obrigatorias |
| **Confiabilidade** | Tolerar ausencia de `gtag`/`fbq` sem quebrar pagina |

---

## 7. Fluxos Principais

### Fluxo 1 — Primeira Visita (opt-in)

```
1. Sem localStorage → estado "noConsent"
2. Se googleConsentMode.defaultDeniedOnLoad=true, dispara default denied
3. Banner aparece
4. Usuario escolhe:
   - acceptAll → salva + enableScripts + (update consent)
   - declineAll → salva "false" nas categorias (scripts continuam bloqueados)
   - save preferences → idem
```

### Fluxo 2 — Subdominio Diferente

```
1. Nao ha localStorage, mas ha cookie cross-subdomain
2. Hidratar localStorage e aplicar estado (sem exibir banner)
3. Aplicar Consent Mode update conforme categorias
```

### Fluxo 3 — Visitante Retornando

```
1. localStorage existe e nao expirou
2. Aplicar Consent Mode update conforme categorias armazenadas
3. Habilitar scripts para categorias concedidas
4. Mostrar botao gerenciador (se configurado)
```

---

## 8. Criterios de Aceitacao (Self-check)

- [ ] **Default denied**: Na primeira visita, antes do clique, GA nao cria cookies e `enableScripts` nao executa scripts nao-essenciais
- [ ] **Update correto**: Ao aceitar analytics, `analytics_storage` muda para granted, mantendo os demais denied
- [ ] **Meta**: marketing=true chama `fbq('consent','grant')` apenas se `fbq` existir
- [ ] **Subdominio**: Consentimento e reconhecido em `sub.meudominio.com` quando `storage.cookie.domain=.meudominio.com`
- [ ] **consentId**: Vira UUID (com fallback), substituindo atual `Date.now()+Math.random()`
- [ ] **API**: `setConsent()` cobre o caso do `savePreferences()` e mantem compatibilidade por 1 versao
- [ ] **Config**: E possivel desligar completamente notificacoes para GA/Meta mantendo apenas gating

---

## 9. Plano de Implementacao

| Fase | Entregaveis |
|------|-------------|
| Fase 1 | Infraestrutura de config (ww-config.js): adicionar novas props e defaults |
| Fase 2 | Armazenamento cross-subdomain: cookie domain + hidratacao |
| Fase 3 | consentId UUID: trocar gerador + fallback |
| Fase 4 | Consent Mode v2: default denied no load (config), update no accept/decline/save |
| Fase 5 | Meta consent: grant/revoke por config |
| Fase 6 | API: adicionar `setConsent()` + novos eventos + depreciacao |

---

## 10. Checklist Tecnico

### Mudancas em `wwElement.vue`

- [ ] Adicionar funcao `generateUUID()` com fallback crypto.randomUUID
- [ ] Atualizar `generateConsentId()` para usar nova funcao UUID
- [ ] Adicionar metodo `emitConsentDefaulted()`
- [ ] Adicionar metodo `updateGoogleConsentMode()`
- [ ] Adicionar metodo `updateMetaPixelConsent()`
- [ ] Adicionar metodo `hydrateFromCookie()`
- [ ] Adicionar acao `setConsent()`
- [ ] Adicionar eventos `consentDefaulted` e `consentChanged`

### Mudancas em `ww-config.js`

- [ ] Adicionar secao Google Consent Mode com enabled, defaultDeniedOnLoad, mapMarketingToAdsStorage
- [ ] Adicionar secao Meta Pixel com enabled
- [ ] Adicionar secao Storage com cookie.enabled, cookie.domain
- [ ] Adicionar config emitDefaultStateEvent

### Mudancas no README

- [ ] Documentar novas configs
- [ ] Documentar novos eventos
- [ ] Documentar novas acoes
- [ ] Adicionar exemplo de integracao Google Consent Mode v2
- [ ] Adicionar exemplo de setup cross-subdomain

---

## 11. Referencias

- [Google Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent)
- [Meta Pixel Consent](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr)
- [Web Crypto API - randomUUID](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
- [PRD v1](PRD.pt-BR.md)
