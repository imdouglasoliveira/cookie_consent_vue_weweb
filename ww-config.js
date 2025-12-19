export default {
  editor: {
    label: {
      en: "Cookie Consent",
      pt: "Consentimento de Cookies",
    },
    icon: "cookie",
  },

  properties: {
    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  1. CONSENT BEHAVIOR - Modo e regras de consentimento         ║
    // ╚═══════════════════════════════════════════════════════════════╝
    componentLanguage: {
      label: { en: "Component Language", pt: "Idioma do Componente" },
      type: "TextSelect",
      defaultValue: "en-US",
      section: "settings",
      options: {
        options: [
          { value: "en-US", label: { en: "English (US)", pt: "Ingles (EUA)" } },
          { value: "pt-BR", label: { en: "Portuguese (BR)", pt: "Portugues (BR)" } },
        ],
      },
    },
    consentMode: {
      label: { en: "Consent Mode", pt: "Modo de Consentimento" },
      type: "TextSelect",
      defaultValue: "opt-in",
      section: "settings",
      options: {
        options: [
          { value: "opt-in", label: { en: "Opt-in (GDPR/LGPD)", pt: "Opt-in (GDPR/LGPD)" } },
          { value: "opt-out", label: { en: "Opt-out", pt: "Opt-out" } },
          { value: "informational", label: { en: "Informational", pt: "Informativo" } },
        ],
      },
    },
    cookieExpiration: {
      label: { en: "Cookie Expiration (days)", pt: "Expiracao do Cookie (dias)" },
      type: "Number",
      defaultValue: 365,
      section: "settings",
      options: {
        min: 1,
        max: 730,
        step: 1,
      },
    },
    autoConsentBots: {
      label: { en: "Auto-consent for Bots/Crawlers", pt: "Auto-consentir para Bots/Crawlers" },
      type: "OnOff",
      defaultValue: false,
      section: "settings",
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  2. COOKIE CATEGORIES - Categorias habilitadas                ║
    // ╚═══════════════════════════════════════════════════════════════╝
    analyticsMode: {
      label: { en: "Analytics", pt: "Analytics" },
      type: "TextSelect",
      options: [
        { value: "disabled", label: { en: "Disabled", pt: "Desabilitado" } },
        { value: "optional", label: { en: "Optional", pt: "Opcional" } },
        { value: "required", label: { en: "Required", pt: "Obrigatorio" } },
      ],
      defaultValue: "optional",
      section: "settings",
    },
    marketingMode: {
      label: { en: "Marketing", pt: "Marketing" },
      type: "TextSelect",
      options: [
        { value: "disabled", label: { en: "Disabled", pt: "Desabilitado" } },
        { value: "optional", label: { en: "Optional", pt: "Opcional" } },
        { value: "required", label: { en: "Required", pt: "Obrigatorio" } },
      ],
      defaultValue: "optional",
      section: "settings",
    },
    personalizationMode: {
      label: { en: "Personalization", pt: "Personalizacao" },
      type: "TextSelect",
      options: [
        { value: "disabled", label: { en: "Disabled", pt: "Desabilitado" } },
        { value: "optional", label: { en: "Optional", pt: "Opcional" } },
        { value: "required", label: { en: "Required", pt: "Obrigatorio" } },
      ],
      defaultValue: "optional",
      section: "settings",
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  3. INTEGRATIONS - Google Consent Mode, Meta Pixel            ║
    // ╚═══════════════════════════════════════════════════════════════╝
    googleConsentModeEnabled: {
      label: { en: "Enable Google Consent Mode v2", pt: "Habilitar Google Consent Mode v2" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    googleConsentDefaultDenied: {
      label: { en: "Default Denied on Load", pt: "Default Negado ao Carregar" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
      hidden: (content) => !content.googleConsentModeEnabled,
    },
    googleConsentMapMarketing: {
      label: { en: "Map Marketing to Ad Signals", pt: "Mapear Marketing para Sinais de Ads" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
      hidden: (content) => !content.googleConsentModeEnabled,
    },
    metaPixelEnabled: {
      label: { en: "Enable Meta Pixel Consent", pt: "Habilitar Consentimento Meta Pixel" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  4. STORAGE - Armazenamento e cross-subdomain                 ║
    // ╚═══════════════════════════════════════════════════════════════╝
    storageCookieEnabled: {
      label: { en: "Enable Cookie Storage", pt: "Habilitar Armazenamento em Cookie" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    storageCookieDomainAuto: {
      label: { en: "Auto-detect Cookie Domain", pt: "Detectar Dominio Automaticamente" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
      hidden: (content) => !content.storageCookieEnabled,
    },
    storageCookieDomain: {
      label: { en: "Cookie Domain", pt: "Dominio do Cookie" },
      type: "Text",
      defaultValue: "",
      options: {
        placeholder: ".yourdomain.com",
      },
      section: "settings",
      hidden: (content) => !content.storageCookieEnabled || content.storageCookieDomainAuto,
      bindable: true,
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  5. DATA COLLECTION - Coleta de dados e eventos               ║
    // ╚═══════════════════════════════════════════════════════════════╝
    collectIpAddress: {
      label: { en: "Collect IP Address & Geolocation", pt: "Coletar Endereco IP e Geolocalizacao" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    emitDefaultStateEvent: {
      label: { en: "Emit Consent Defaulted Event", pt: "Emitir Evento Consent Defaulted" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    lastConsentData: {
      label: { en: "Last Consent Data", pt: "Ultimos Dados de Consentimento" },
      type: "Object",
      defaultValue: null,
      bindable: true,
      hidden: true,
      section: "settings",
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  6. BANNER LAYOUT - Layout e posicionamento do banner         ║
    // ╚═══════════════════════════════════════════════════════════════╝
    bannerLayout: {
      label: { en: "Banner Layout", pt: "Layout do Banner" },
      type: "TextSelect",
      defaultValue: "card",
      section: "settings",
      options: {
        options: [
          { value: "bar", label: { en: "Bar (Full Width)", pt: "Barra (Largura Total)" } },
          { value: "card", label: { en: "Card (Floating)", pt: "Card (Flutuante)" } },
          { value: "popup", label: { en: "Popup (Compact)", pt: "Popup (Compacto)" } },
          { value: "modal", label: { en: "Modal (Centered)", pt: "Modal (Centralizado)" } },
          { value: "toast", label: { en: "Toast (Snackbar)", pt: "Toast (Snackbar)" } },
          { value: "banner", label: { en: "Banner (Inline)", pt: "Banner (Inline)" } },
          { value: "expandable", label: { en: "Expandable List", pt: "Lista Expansivel" } },
          { value: "floating", label: { en: "Floating (Corner)", pt: "Flutuante (Canto)" } },
        ],
      },
    },
    bannerStyle: {
      label: { en: "Banner Style", pt: "Estilo do Banner" },
      type: "TextSelect",
      defaultValue: "standard",
      section: "settings",
      options: {
        options: [
          { value: "minimal", label: { en: "Minimal", pt: "Minimo" } },
          { value: "standard", label: { en: "Standard", pt: "Padrao" } },
          { value: "detailed", label: { en: "Detailed", pt: "Detalhado" } },
        ],
      },
    },
    bannerWidth: {
      label: { en: "Banner Width", pt: "Largura do Banner" },
      type: "TextSelect",
      defaultValue: "480",
      section: "settings",
      hidden: (content) => content.bannerLayout === 'bar',
      options: {
        options: [
          { value: "320", label: { en: "Small (320px)", pt: "Pequeno (320px)" } },
          { value: "400", label: { en: "Compact (400px)", pt: "Compacto (400px)" } },
          { value: "480", label: { en: "Medium (480px)", pt: "Medio (480px)" } },
          { value: "560", label: { en: "Standard (560px)", pt: "Padrao (560px)" } },
          { value: "640", label: { en: "Large (640px)", pt: "Grande (640px)" } },
          { value: "auto", label: { en: "Auto", pt: "Automatico" } },
        ],
      },
    },
    position: {
      label: { en: "Banner Position", pt: "Posicao do Banner" },
      type: "TextSelect",
      defaultValue: "bottom-left",
      section: "settings",
      options: {
        options: [
          { value: "bottom-left", label: { en: "Bottom Left", pt: "Inferior Esquerda" } },
          { value: "bottom-right", label: { en: "Bottom Right", pt: "Inferior Direita" } },
          { value: "bottom-center", label: { en: "Bottom Center", pt: "Inferior Centro" } },
          { value: "top-left", label: { en: "Top Left", pt: "Superior Esquerda" } },
          { value: "top-right", label: { en: "Top Right", pt: "Superior Direita" } },
          { value: "top-center", label: { en: "Top Center", pt: "Superior Centro" } },
        ],
      },
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  7. BANNER BUTTONS - Botoes do banner                         ║
    // ╚═══════════════════════════════════════════════════════════════╝
    buttonLayout: {
      label: { en: "Button Layout", pt: "Layout dos Botoes" },
      type: "TextSelect",
      defaultValue: "horizontal",
      section: "settings",
      options: {
        options: [
          { value: "horizontal", label: { en: "Horizontal", pt: "Horizontal" } },
          { value: "vertical", label: { en: "Vertical (Stacked)", pt: "Vertical (Empilhado)" } },
          { value: "inline", label: { en: "Inline with Text", pt: "Inline com Texto" } },
        ],
      },
    },
    showDeclineButton: {
      label: { en: "Show Decline Button", pt: "Exibir Botao Recusar" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    showPreferencesButton: {
      label: { en: "Show Preferences Button", pt: "Exibir Botao Preferencias" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    allowPreferencesModal: {
      label: { en: "Allow Preferences Modal", pt: "Permitir Modal de Preferencias" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
      hidden: (content) => content.bannerStyle === 'minimal',
    },
    showCloseButton: {
      label: { en: "Show Close Button (X)", pt: "Exibir Botao Fechar (X)" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  8. BANNER UI ELEMENTS - Elementos visuais do banner          ║
    // ╚═══════════════════════════════════════════════════════════════╝
    showCookieIcon: {
      label: { en: "Show Cookie Icon", pt: "Exibir Icone de Cookie" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    iconStyle: {
      label: { en: "Icon Style", pt: "Estilo do Icone" },
      type: "TextSelect",
      defaultValue: "default",
      section: "settings",
      hidden: (content) => !content.showCookieIcon,
      options: {
        options: [
          { value: "default", label: { en: "Default Cookie", pt: "Cookie Padrao" } },
          { value: "shield", label: { en: "Shield (Privacy)", pt: "Escudo (Privacidade)" } },
          { value: "lock", label: { en: "Lock (Security)", pt: "Cadeado (Seguranca)" } },
          { value: "settings", label: { en: "Settings Gear", pt: "Engrenagem" } },
        ],
      },
    },
    showPolicyLink: {
      label: { en: "Show Policy Link", pt: "Exibir Link de Politica" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    policyPageUrl: {
      label: { en: "Privacy Policy URL", pt: "URL da Politica de Privacidade" },
      type: "Text",
      defaultValue: "/privacy-policy",
      section: "settings",
      bindable: true,
      hidden: (content) => !content.showPolicyLink,
    },
    policyLinkNewTab: {
      label: { en: "Open Policy in New Tab", pt: "Abrir Politica em Nova Aba" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
      hidden: (content) => !content.showPolicyLink,
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  9. FLOAT BUTTON - Botao flutuante (gerenciador)              ║
    // ╚═══════════════════════════════════════════════════════════════╝
    showManager: {
      label: { en: "Enable Float Button", pt: "Habilitar Botao Flutuante" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    showManagerAfterDecline: {
      label: { en: "Show Float After Decline", pt: "Exibir Float Apos Recusar" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
      hidden: (content) => !content.showManager,
    },
    managerPosition: {
      label: { en: "Float Position", pt: "Posicao do Float" },
      type: "TextSelect",
      defaultValue: "bottom-left",
      section: "settings",
      hidden: (content) => !content.showManager,
      options: {
        options: [
          { value: "bottom-left", label: { en: "Bottom Left", pt: "Inferior Esquerda" } },
          { value: "bottom-right", label: { en: "Bottom Right", pt: "Inferior Direita" } },
        ],
      },
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  10. VISIBILITY CONTROLLER - Controle via binding             ║
    // ╚═══════════════════════════════════════════════════════════════╝
    isOpen: {
      label: { en: "Is Open (Controller)", pt: "Esta Aberto (Controlador)" },
      type: "OnOff",
      defaultValue: null,
      bindable: true,
      section: "settings",
    },
    showEditorPlaceholder: {
      label: { en: "Show Editor Placeholder", pt: "Exibir Placeholder no Editor" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  11. CONTENT / i18n - Textos do banner                        ║
    // ╚═══════════════════════════════════════════════════════════════╝
    bannerTitle: {
      label: { en: "Banner Title", pt: "Titulo do Banner" },
      type: "Text",
      defaultValue: "Cookie Consent",
      section: "settings",
      bindable: true,
    },
    bannerMessage: {
      label: { en: "Banner Message", pt: "Mensagem do Banner" },
      type: "Text",
      defaultValue: "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.",
      section: "settings",
      bindable: true,
    },
    acceptAllLabel: {
      label: { en: "Accept All Button", pt: "Botao Aceitar Todos" },
      type: "Text",
      defaultValue: "Accept All",
      section: "settings",
      bindable: true,
    },
    declineAllLabel: {
      label: { en: "Decline Button", pt: "Botao Recusar" },
      type: "Text",
      defaultValue: "Decline",
      section: "settings",
      bindable: true,
    },
    preferencesLabel: {
      label: { en: "Preferences Button", pt: "Botao Preferencias" },
      type: "Text",
      defaultValue: "Preferences",
      section: "settings",
      bindable: true,
    },
    savePreferencesLabel: {
      label: { en: "Save Preferences Button", pt: "Botao Salvar Preferencias" },
      type: "Text",
      defaultValue: "Save Preferences",
      section: "settings",
      bindable: true,
    },
    policyLinkLabel: {
      label: { en: "Policy Link Text", pt: "Texto do Link de Politica" },
      type: "Text",
      defaultValue: "Privacy Policy",
      section: "settings",
      bindable: true,
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  12. CATEGORY LABELS - Rotulos das categorias                 ║
    // ╚═══════════════════════════════════════════════════════════════╝
    essentialLabel: {
      label: { en: "Essential Label", pt: "Rotulo Essencial" },
      type: "Text",
      defaultValue: "Essential",
      section: "settings",
      bindable: true,
    },
    essentialDescription: {
      label: { en: "Essential Description", pt: "Descricao Essencial" },
      type: "Text",
      defaultValue: "Required for basic website functionality and security.",
      section: "settings",
      bindable: true,
    },
    analyticsLabel: {
      label: { en: "Analytics Label", pt: "Rotulo Analytics" },
      type: "Text",
      defaultValue: "Analytics",
      section: "settings",
      bindable: true,
    },
    analyticsDescription: {
      label: { en: "Analytics Description", pt: "Descricao Analytics" },
      type: "Text",
      defaultValue: "Help us understand how visitors interact with our website.",
      section: "settings",
      bindable: true,
    },
    marketingLabel: {
      label: { en: "Marketing Label", pt: "Rotulo Marketing" },
      type: "Text",
      defaultValue: "Marketing",
      section: "settings",
      bindable: true,
    },
    marketingDescription: {
      label: { en: "Marketing Description", pt: "Descricao Marketing" },
      type: "Text",
      defaultValue: "Used to deliver relevant advertisements and track campaign effectiveness.",
      section: "settings",
      bindable: true,
    },
    personalizationLabel: {
      label: { en: "Personalization Label", pt: "Rotulo Personalizacao" },
      type: "Text",
      defaultValue: "Personalization",
      section: "settings",
      bindable: true,
    },
    personalizationDescription: {
      label: { en: "Personalization Description", pt: "Descricao Personalizacao" },
      type: "Text",
      defaultValue: "Remember your preferences and customize your experience.",
      section: "settings",
      bindable: true,
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  13. EXPANDABLE LAYOUT - Textos do layout expansivel          ║
    // ╚═══════════════════════════════════════════════════════════════╝
    expandableHowWeUseLabel: {
      label: { en: "How We Use Cookies Label", pt: "Rotulo Como Usamos Cookies" },
      type: "Text",
      defaultValue: "How we use cookies",
      section: "settings",
      bindable: true,
      hidden: (content) => content.bannerLayout !== 'expandable',
    },
    expandableHowWeUseDescription: {
      label: { en: "How We Use Description", pt: "Descricao Como Usamos" },
      type: "Text",
      defaultValue: "We use cookies to improve your experience on our website, analyze traffic, and personalize content.",
      section: "settings",
      bindable: true,
      hidden: (content) => content.bannerLayout !== 'expandable',
    },
    expandableNecessaryLabel: {
      label: { en: "Necessary Cookies Label", pt: "Rotulo Cookies Necessarios" },
      type: "Text",
      defaultValue: "We use necessary cookies",
      section: "settings",
      bindable: true,
      hidden: (content) => content.bannerLayout !== 'expandable',
    },
    expandableNecessaryDescription: {
      label: { en: "Necessary Description", pt: "Descricao Necessarios" },
      type: "Text",
      defaultValue: "These cookies are essential for the website to function properly and cannot be disabled.",
      section: "settings",
      bindable: true,
      hidden: (content) => content.bannerLayout !== 'expandable',
    },
    expandableAnalyticsLabel: {
      label: { en: "Analytics Label (Expandable)", pt: "Rotulo Analytics (Expansivel)" },
      type: "Text",
      defaultValue: "Accept analytical cookies",
      section: "settings",
      bindable: true,
      hidden: (content) => content.bannerLayout !== 'expandable',
    },
    expandableMarketingLabel: {
      label: { en: "Marketing Label (Expandable)", pt: "Rotulo Marketing (Expansivel)" },
      type: "Text",
      defaultValue: "Accept marketing cookies",
      section: "settings",
      bindable: true,
      hidden: (content) => content.bannerLayout !== 'expandable',
    },
    expandablePersonalizationLabel: {
      label: { en: "Personalization Label (Expandable)", pt: "Rotulo Personalizacao (Expansivel)" },
      type: "Text",
      defaultValue: "Accept personalization cookies",
      section: "settings",
      bindable: true,
      hidden: (content) => content.bannerLayout !== 'expandable',
    },

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  STYLING - Cores e aparencia                                  ║
    // ╚═══════════════════════════════════════════════════════════════╝
    backgroundColor: {
      label: { en: "Background Color", pt: "Cor de Fundo" },
      type: "Color",
      defaultValue: "#ffffff",
      section: "style",
    },
    textColor: {
      label: { en: "Text Color", pt: "Cor do Texto" },
      type: "Color",
      defaultValue: "#1f2937",
      section: "style",
    },
    secondaryTextColor: {
      label: { en: "Secondary Text Color", pt: "Cor do Texto Secundario" },
      type: "Color",
      defaultValue: "#6b7280",
      section: "style",
    },
    primaryButtonBg: {
      label: { en: "Accept Button Background", pt: "Fundo Botao Aceitar" },
      type: "Color",
      defaultValue: "#10b981",
      section: "style",
    },
    primaryButtonText: {
      label: { en: "Accept Button Text", pt: "Texto Botao Aceitar" },
      type: "Color",
      defaultValue: "#ffffff",
      section: "style",
    },
    primaryButtonHover: {
      label: { en: "Accept Button Hover", pt: "Hover Botao Aceitar" },
      type: "Color",
      defaultValue: "#059669",
      section: "style",
    },
    secondaryButtonBg: {
      label: { en: "Decline Button Background", pt: "Fundo Botao Recusar" },
      type: "Color",
      defaultValue: "#f3f4f6",
      section: "style",
    },
    secondaryButtonText: {
      label: { en: "Decline Button Text", pt: "Texto Botao Recusar" },
      type: "Color",
      defaultValue: "#374151",
      section: "style",
    },
    secondaryButtonHover: {
      label: { en: "Decline Button Hover", pt: "Hover Botao Recusar" },
      type: "Color",
      defaultValue: "#e5e7eb",
      section: "style",
    },
    borderColor: {
      label: { en: "Border Color", pt: "Cor da Borda" },
      type: "Color",
      defaultValue: "#e5e7eb",
      section: "style",
    },
    toggleOnColor: {
      label: { en: "Toggle On Color", pt: "Cor Toggle Ligado" },
      type: "Color",
      defaultValue: "#10b981",
      section: "style",
    },
    toggleOffColor: {
      label: { en: "Toggle Off Color", pt: "Cor Toggle Desligado" },
      type: "Color",
      defaultValue: "#d1d5db",
      section: "style",
    },
    linkColor: {
      label: { en: "Link Color", pt: "Cor do Link" },
      type: "Color",
      defaultValue: "#3b82f6",
      section: "style",
    },
    borderRadius: {
      label: { en: "Border Radius", pt: "Raio da Borda" },
      type: "Length",
      defaultValue: "12px",
      section: "style",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 0, max: 32 },
        ],
      },
    },
    boxShadow: {
      label: { en: "Box Shadow", pt: "Sombra" },
      type: "TextSelect",
      defaultValue: "lg",
      section: "style",
      options: {
        options: [
          { value: "none", label: { en: "None", pt: "Nenhuma" } },
          { value: "sm", label: { en: "Small", pt: "Pequena" } },
          { value: "md", label: { en: "Medium", pt: "Media" } },
          { value: "lg", label: { en: "Large", pt: "Grande" } },
          { value: "xl", label: { en: "Extra Large", pt: "Extra Grande" } },
        ],
      },
    },
    bannerShape: {
      label: { en: "Banner Shape", pt: "Formato do Banner" },
      type: "TextSelect",
      defaultValue: "rounded",
      section: "style",
      options: {
        options: [
          { value: "rounded", label: { en: "Rounded (Default)", pt: "Arredondado (Padrao)" } },
          { value: "pill", label: { en: "Pill (Capsule)", pt: "Pilula (Capsula)" } },
          { value: "square", label: { en: "Square (Sharp)", pt: "Quadrado (Reto)" } },
        ],
      },
    },

  },

  // ═══════════════════════════════════════════════════════════════
  // ACTIONS (Workflow)
  // ═══════════════════════════════════════════════════════════════
  actions: [
    {
      label: { en: "Show Banner", pt: "Exibir Banner" },
      action: "showBanner",
    },
    {
      label: { en: "Hide Banner", pt: "Ocultar Banner" },
      action: "hideBanner",
    },
    {
      label: { en: "Open Preferences", pt: "Abrir Preferencias" },
      action: "openPreferences",
    },
    {
      label: { en: "Close Preferences", pt: "Fechar Preferencias" },
      action: "closePreferences",
    },
    {
      label: { en: "Accept All", pt: "Aceitar Todos" },
      action: "acceptAll",
    },
    {
      label: { en: "Decline All", pt: "Recusar Todos" },
      action: "declineAll",
    },
    {
      label: { en: "Save Preferences", pt: "Salvar Preferencias" },
      action: "savePreferences",
      args: [
        {
          name: "categories",
          type: "object",
          label: { en: "Categories", pt: "Categorias" },
        },
      ],
    },
    {
      label: { en: "Reset Consent", pt: "Resetar Consentimento" },
      action: "resetConsent",
    },
    {
      label: { en: "Get Consent Status", pt: "Obter Status do Consentimento" },
      action: "getConsentStatus",
    },
    {
      label: { en: "Get Last Consent", pt: "Obter Ultimo Consentimento" },
      action: "getLastConsent",
    },
    {
      label: { en: "Set Consent", pt: "Definir Consentimento" },
      action: "setConsent",
      args: [
        {
          name: "categories",
          type: "object",
          label: { en: "Categories", pt: "Categorias" },
        },
        {
          name: "options",
          type: "object",
          label: { en: "Options (source)", pt: "Opcoes (source)" },
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // TRIGGER EVENTS
  // ═══════════════════════════════════════════════════════════════
  triggerEvents: [
    {
      name: "consentGiven",
      label: { en: "Cookie: User Accepted All Cookies", pt: "Cookie: Usuario Aceitou Todos os Cookies" },
      event: {
        consentId: "",
        categories: {
          essential: true,
          analytics: false,
          marketing: false,
          personalization: false,
        },
        timestamp: "",
        browser: {
          userAgent: "",
          language: "",
          languages: [],
          timezone: "",
          timezoneOffset: 0,
          screenSize: "",
          viewportSize: "",
          colorDepth: 0,
          pixelRatio: 1,
          cookieEnabled: false,
          doNotTrack: "",
          online: true,
          platform: "",
          vendor: "",
          touchSupport: false,
          maxTouchPoints: 0,
        },
        page: {
          url: "",
          hostname: "",
          pathname: "",
          referrer: "",
          title: "",
        },
        source: {
          method: "",
          style: "",
          layout: "",
          position: "",
          buttonClicked: "",
          interactionTimeMs: 0,
        },
        ip: {
          ip: "",
          city: "",
          region: "",
          regionCode: "",
          country: "",
          countryCode: "",
          continent: "",
          postal: "",
          latitude: null,
          longitude: null,
          timezone: "",
          utcOffset: "",
          org: "",
          asn: "",
          currency: "",
        },
      },
    },
    {
      name: "consentDeclined",
      label: { en: "Cookie: User Declined All Cookies", pt: "Cookie: Usuario Recusou Todos os Cookies" },
      event: {
        consentId: "",
        timestamp: "",
        browser: {
          userAgent: "",
          language: "",
          languages: [],
          timezone: "",
          timezoneOffset: 0,
          screenSize: "",
          viewportSize: "",
          colorDepth: 0,
          pixelRatio: 1,
          cookieEnabled: false,
          doNotTrack: "",
          online: true,
          platform: "",
          vendor: "",
          touchSupport: false,
          maxTouchPoints: 0,
        },
        page: {
          url: "",
          hostname: "",
          pathname: "",
          referrer: "",
          title: "",
        },
        source: {
          method: "",
          style: "",
          layout: "",
          position: "",
          buttonClicked: "",
          interactionTimeMs: 0,
        },
        ip: {
          ip: "",
          city: "",
          region: "",
          regionCode: "",
          country: "",
          countryCode: "",
          continent: "",
          postal: "",
          latitude: null,
          longitude: null,
          timezone: "",
          utcOffset: "",
          org: "",
          asn: "",
          currency: "",
        },
      },
    },
    {
      name: "preferencesUpdated",
      label: { en: "Cookie: User Saved Custom Preferences", pt: "Cookie: Usuario Salvou Preferencias Personalizadas" },
      event: {
        consentId: "",
        categories: {
          essential: true,
          analytics: false,
          marketing: false,
          personalization: false,
        },
        timestamp: "",
        browser: {
          userAgent: "",
          language: "",
          languages: [],
          timezone: "",
          timezoneOffset: 0,
          screenSize: "",
          viewportSize: "",
          colorDepth: 0,
          pixelRatio: 1,
          cookieEnabled: false,
          doNotTrack: "",
          online: true,
          platform: "",
          vendor: "",
          touchSupport: false,
          maxTouchPoints: 0,
        },
        page: {
          url: "",
          hostname: "",
          pathname: "",
          referrer: "",
          title: "",
        },
        source: {
          method: "",
          style: "",
          layout: "",
          position: "",
          buttonClicked: "",
          interactionTimeMs: 0,
        },
        ip: {
          ip: "",
          city: "",
          region: "",
          regionCode: "",
          country: "",
          countryCode: "",
          continent: "",
          postal: "",
          latitude: null,
          longitude: null,
          timezone: "",
          utcOffset: "",
          org: "",
          asn: "",
          currency: "",
        },
      },
    },
    {
      name: "bannerShown",
      label: { en: "Cookie: Banner Displayed", pt: "Cookie: Banner Exibido" },
      event: {},
    },
    {
      name: "bannerHidden",
      label: { en: "Cookie: Banner Closed", pt: "Cookie: Banner Fechado" },
      event: {
        reason: "",
      },
    },
    {
      name: "preferencesOpened",
      label: { en: "Cookie: Preferences Modal Opened", pt: "Cookie: Modal de Preferencias Aberto" },
      event: {},
    },
    {
      name: "preferencesClosed",
      label: { en: "Cookie: Preferences Modal Closed", pt: "Cookie: Modal de Preferencias Fechado" },
      event: {},
    },
    {
      name: "consentStatusRetrieved",
      label: { en: "Cookie: Consent Status Retrieved", pt: "Cookie: Status do Consentimento Obtido" },
      event: {
        hasConsent: false,
        consent: {},
      },
    },
    {
      name: "lastConsentRetrieved",
      label: { en: "Cookie: Last Consent Retrieved", pt: "Cookie: Ultimo Consentimento Obtido" },
      event: {
        consentId: "",
        categories: {
          essential: true,
          analytics: false,
          marketing: false,
          personalization: false,
        },
        timestamp: "",
        browser: {},
        page: {},
        source: {},
        ip: {},
      },
    },
    {
      name: "consentDefaulted",
      label: { en: "Cookie: Consent Defaulted", pt: "Cookie: Consentimento Padrao Aplicado" },
      event: {
        hasConsent: false,
        effectiveConsent: {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        },
        timestamp: "",
      },
    },
    {
      name: "consentChanged",
      label: { en: "Cookie: Consent Changed", pt: "Cookie: Consentimento Alterado" },
      event: {
        consentId: "",
        categories: {
          essential: true,
          analytics: false,
          marketing: false,
          personalization: false,
        },
        previousCategories: {
          essential: true,
          analytics: false,
          marketing: false,
          personalization: false,
        },
        timestamp: "",
        source: "",
      },
    },
  ],
};
