// Utilitário para proteção do código fonte
export const protectSourceCode = () => {
  // 1. Desabilitar DevTools básicos
  const disableDevTools = () => {
    // Detectar abertura do DevTools
    let devtools = {
      open: false,
      orientation: null
    };

    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          console.clear();
          console.log('%c🔒 Acesso negado ao código fonte!', 'color: red; font-size: 20px; font-weight: bold;');
          console.log('%cEste código é propriedade intelectual protegida.', 'color: red; font-size: 14px;');
          
          // Limpar console periodicamente
          setInterval(() => {
            console.clear();
            console.log('%c🔒 Acesso negado ao código fonte!', 'color: red; font-size: 20px; font-weight: bold;');
          }, 100);
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  };

  // 2. Desabilitar clique direito
  const disableRightClick = () => {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  };

  // 3. Desabilitar seleção de texto
  const disableTextSelection = () => {
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });
  };

  // 4. Desabilitar atalhos de teclado
  const disableKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && (e.key === 'u' || e.key === 's'))) {
        e.preventDefault();
        return false;
      }
    });
  };

  // 5. Ofuscar console
  const obfuscateConsole = () => {
    // Substituir console.log por versão ofuscada
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      // Mostrar mensagem de aviso em vez do conteúdo real
      originalLog('%c🔒 Conteúdo protegido', 'color: red; font-weight: bold;');
    };

    // Substituir console.dir por versão ofuscada
    const originalDir = console.dir;
    console.dir = (obj: any) => {
      originalDir('%c🔒 Objeto protegido', 'color: red; font-weight: bold;');
    };

    // Substituir console.table por versão ofuscada
    const originalTable = console.table;
    console.table = (data: any, properties?: string[]) => {
      originalTable([{ mensagem: '🔒 Dados protegidos' }]);
    };
  };

  // 6. Adicionar avisos de proteção
  const addProtectionWarnings = () => {
    // Aviso no console
    console.log('%c⚠️ ATENÇÃO!', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%cEste é um navegador de propriedade intelectual protegida.', 'color: red; font-size: 14px;');
    console.log('%cA reprodução, distribuição ou modificação não autorizada é proibida.', 'color: red; font-size: 14px;');
    console.log('%cViolações podem resultar em consequências legais.', 'color: red; font-size: 14px;');
  };

  // 7. Detectar tentativas de debug
  const detectDebugging = () => {
    let startTime = new Date().getTime();
    
    setInterval(() => {
      const currentTime = new Date().getTime();
      if (currentTime - startTime > 100) {
        // Possível debugger ativo
        console.clear();
        console.log('%c🔒 Debugging detectado!', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%cAcesso negado ao código fonte.', 'color: red; font-size: 14px;');
      }
      startTime = currentTime;
    }, 100);
  };

  // 8. Adicionar script de ofuscação adicional
  const addObfuscationScript = () => {
    const script = document.createElement('script');
    script.textContent = `
      // Ofuscar funções globais
      (function() {
        const originalEval = window.eval;
        window.eval = function(code) {
          console.log('%c🔒 Eval bloqueado', 'color: red; font-weight: bold;');
          return originalEval('console.log("Acesso negado")');
        };
      })();
    `;
    document.head.appendChild(script);
  };

  // Inicializar todas as proteções
  disableDevTools();
  disableRightClick();
  disableTextSelection();
  disableKeyboardShortcuts();
  obfuscateConsole();
  addProtectionWarnings();
  detectDebugging();
  addObfuscationScript();

  console.log('%c🛡️ Proteção do código fonte ativada', 'color: green; font-size: 16px; font-weight: bold;');
};

// Função para desabilitar proteção (apenas para desenvolvimento)
export const disableSourceProtection = () => {
  console.clear();
  console.log('%c🔓 Proteção do código fonte desabilitada', 'color: green; font-size: 16px; font-weight: bold;');
  // Recarregar a página para remover todas as proteções
  window.location.reload();
};
