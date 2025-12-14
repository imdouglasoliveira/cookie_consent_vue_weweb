export default {
  editor: {
    label: {
      en: "Cookie Consent",
      pt: "Consentimento de Cookies",
    },
    icon: "cookie",
  },

  properties: {
    // ═══════════════════════════════════════════════════════════════
    // GENERAL SETTINGS
    // ═══════════════════════════════════════════════════════════════
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
      label: { en: "Position", pt: "Posicao" },
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
    showManager: {
      label: { en: "Show Manager Button", pt: "Exibir Botao Gerenciador" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    managerPosition: {
      label: { en: "Manager Position", pt: "Posicao do Gerenciador" },
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
    policyPageUrl: {
      label: { en: "Privacy Policy URL", pt: "URL da Politica de Privacidade" },
      type: "Text",
      defaultValue: "/privacy-policy",
      section: "settings",
      bindable: true,
    },
    showEditorPlaceholder: {
      label: { en: "Show Editor Placeholder", pt: "Exibir Placeholder no Editor" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },

    // ═══════════════════════════════════════════════════════════════
    // BUTTON & UI OPTIONS
    // ═══════════════════════════════════════════════════════════════
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
    showCloseButton: {
      label: { en: "Show Close Button (X)", pt: "Exibir Botao Fechar (X)" },
      type: "OnOff",
      defaultValue: false,
      section: "settings",
    },
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

    // ═══════════════════════════════════════════════════════════════
    // COOKIE CATEGORIES
    // ═══════════════════════════════════════════════════════════════
    analyticsEnabled: {
      label: { en: "Enable Analytics Category", pt: "Habilitar Categoria Analytics" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    marketingEnabled: {
      label: { en: "Enable Marketing Category", pt: "Habilitar Categoria Marketing" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    personalizationEnabled: {
      label: { en: "Enable Personalization Category", pt: "Habilitar Categoria Personalizacao" },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },

    // ═══════════════════════════════════════════════════════════════
    // CONTENT / i18n
    // ═══════════════════════════════════════════════════════════════
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

    // Category Labels
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

    // ═══════════════════════════════════════════════════════════════
    // STYLING
    // ═══════════════════════════════════════════════════════════════
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
  },

  // ═══════════════════════════════════════════════════════════════
  // ACTIONS (Workflow)
  // ═══════════════════════════════════════════════════════════════
  actions: [
    {
      label: { en: "Show Banner", pt: "Exibir Banner" },
      action: "showBanner",
      args: [],
    },
    {
      label: { en: "Hide Banner", pt: "Ocultar Banner" },
      action: "hideBanner",
      args: [],
    },
    {
      label: { en: "Open Preferences", pt: "Abrir Preferencias" },
      action: "openPreferences",
      args: [],
    },
    {
      label: { en: "Close Preferences", pt: "Fechar Preferencias" },
      action: "closePreferences",
      args: [],
    },
    {
      label: { en: "Accept All", pt: "Aceitar Todos" },
      action: "acceptAll",
      args: [],
    },
    {
      label: { en: "Decline All", pt: "Recusar Todos" },
      action: "declineAll",
      args: [],
    },
    {
      label: { en: "Save Preferences", pt: "Salvar Preferencias" },
      action: "savePreferences",
      args: [
        {
          name: "categories",
          type: "object",
          bindable: true,
          placeholder: '{"analytics": true, "marketing": false, "personalization": true}',
        },
      ],
    },
    {
      label: { en: "Reset Consent", pt: "Resetar Consentimento" },
      action: "resetConsent",
      args: [],
    },
    {
      label: { en: "Get Consent Status", pt: "Obter Status do Consentimento" },
      action: "getConsentStatus",
      args: [],
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // TRIGGER EVENTS
  // ═══════════════════════════════════════════════════════════════
  triggerEvents: [
    {
      name: "consentGiven",
      label: { en: "On Consent Given", pt: "Ao Dar Consentimento" },
      event: {
        consentId: "",
        categories: {
          essential: true,
          analytics: false,
          marketing: false,
          personalization: false,
        },
        timestamp: "",
      },
    },
    {
      name: "consentDeclined",
      label: { en: "On Consent Declined", pt: "Ao Recusar Consentimento" },
      event: {
        consentId: "",
        timestamp: "",
      },
    },
    {
      name: "preferencesUpdated",
      label: { en: "On Preferences Updated", pt: "Ao Atualizar Preferencias" },
      event: {
        consentId: "",
        categories: {
          essential: true,
          analytics: false,
          marketing: false,
          personalization: false,
        },
        timestamp: "",
      },
    },
    {
      name: "bannerShown",
      label: { en: "On Banner Shown", pt: "Ao Exibir Banner" },
      event: {},
    },
    {
      name: "bannerHidden",
      label: { en: "On Banner Hidden", pt: "Ao Ocultar Banner" },
      event: {
        reason: "",
      },
    },
    {
      name: "preferencesOpened",
      label: { en: "On Preferences Opened", pt: "Ao Abrir Preferencias" },
      event: {},
    },
    {
      name: "preferencesClosed",
      label: { en: "On Preferences Closed", pt: "Ao Fechar Preferencias" },
      event: {},
    },
    {
      name: "consentStatusRetrieved",
      label: { en: "On Consent Status Retrieved", pt: "Ao Obter Status do Consentimento" },
      event: {
        hasConsent: false,
        consent: {},
      },
    },
  ],
};
