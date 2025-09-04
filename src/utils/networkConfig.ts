// Configurações avançadas para supressão de requisições de rede
export interface NetworkSuppressionConfig {
  // URLs específicas para suprimir
  suppressedUrls: string[];
  
  // Padrões de URL para suprimir (usando regex)
  suppressedPatterns: RegExp[];
  
  // Tipos de recursos para suprimir
  suppressedResourceTypes: string[];
  
  // Se deve suprimir requisições de imagens
  suppressImages: boolean;
  
  // Se deve suprimir requisições de fontes
  suppressFonts: boolean;
  
  // Se deve suprimir requisições de CSS
  suppressCSS: boolean;
  
  // Se deve suprimir requisições de scripts
  suppressScripts: boolean;
  
  // Se deve suprimir requisições de APIs
  suppressAPIs: boolean;
  
  // Se deve mostrar logs de debug
  debugMode: boolean;
}

// Configuração padrão
export const defaultNetworkConfig: NetworkSuppressionConfig = {
  suppressedUrls: [
    'https://resources.wimpmusic.com',
    'http://i.imgur.com',
    'https://orig06.deviantart.net',
    'https://gallery.yopriceville.com',
    'http://www.designresourcebox.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    // Imagens locais da seção hero
    '/images/hero-photo1.jpg',
    '/images/hero-background.png'
    // Removido Firebase URLs para permitir funcionamento normal
  ],
  
  suppressedPatterns: [
    // Padrões para imagens locais
    /^\/images\/.*\.(jpg|jpeg|png|gif|webp|svg|ico)$/i,
    
    // Padrões para imagens externas
    /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i,
    
    // Padrões para fontes
    /\.(woff|woff2|ttf|eot|otf)$/i,
    
    // Padrões para recursos externos específicos (excluindo APIs)
    /wimpmusic\.com/i,
    /imgur\.com/i,
    /deviantart\.net/i,
    /yopriceville\.com/i,
    /designresourcebox\.com/i,
    /fonts\.googleapis\.com/i,
    /fonts\.gstatic\.com/i
    // Removido padrões do Firebase para permitir funcionamento normal
  ],
  
  suppressedResourceTypes: [
    'image',
    'font',
    'media'
  ],
  
  suppressImages: true,
  suppressFonts: true,
  suppressCSS: false,
  suppressScripts: false,
  suppressAPIs: false, // Manter APIs funcionando (incluindo Firebase)
  debugMode: false
};

// Função para verificar se uma URL deve ser suprimida baseada na configuração
export const shouldSuppressUrl = (url: string, config: NetworkSuppressionConfig = defaultNetworkConfig): boolean => {
  // Permitir sempre URLs do Firebase para evitar problemas de autenticação
  if (url.includes('firebase.googleapis.com') || 
      url.includes('firestore.googleapis.com') || 
      url.includes('identitytoolkit.googleapis.com') ||
      url.includes('securetoken.googleapis.com')) {
    return false;
  }

  // Verificar URLs específicas
  if (config.suppressedUrls.some(suppressedUrl => url.includes(suppressedUrl))) {
    if (config.debugMode) {
      console.log(`[Network Suppression] URL suprimida (lista específica): ${url}`);
    }
    return true;
  }
  
  // Verificar padrões regex
  if (config.suppressedPatterns.some(pattern => pattern.test(url))) {
    if (config.debugMode) {
      console.log(`[Network Suppression] URL suprimida (padrão regex): ${url}`);
    }
    return true;
  }
  
  // Verificar tipos de recursos baseados na extensão
  if (config.suppressImages && /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url)) {
    if (config.debugMode) {
      console.log(`[Network Suppression] Imagem suprimida: ${url}`);
    }
    return true;
  }
  
  if (config.suppressFonts && /\.(woff|woff2|ttf|eot|otf)$/i.test(url)) {
    if (config.debugMode) {
      console.log(`[Network Suppression] Fonte suprimida: ${url}`);
    }
    return true;
  }
  
  if (config.suppressCSS && /\.css$/i.test(url)) {
    if (config.debugMode) {
      console.log(`[Network Suppression] CSS suprimido: ${url}`);
    }
    return true;
  }
  
  if (config.suppressScripts && /\.js$/i.test(url)) {
    if (config.debugMode) {
      console.log(`[Network Suppression] Script suprimido: ${url}`);
    }
    return true;
  }
  
  return false;
};

// Função para adicionar uma URL à lista de supressão
export const addSuppressedUrl = (url: string, config: NetworkSuppressionConfig = defaultNetworkConfig): void => {
  if (!config.suppressedUrls.includes(url)) {
    config.suppressedUrls.push(url);
    if (config.debugMode) {
      console.log(`[Network Suppression] URL adicionada: ${url}`);
    }
  }
};

// Função para remover uma URL da lista de supressão
export const removeSuppressedUrl = (url: string, config: NetworkSuppressionConfig = defaultNetworkConfig): void => {
  const index = config.suppressedUrls.indexOf(url);
  if (index > -1) {
    config.suppressedUrls.splice(index, 1);
    if (config.debugMode) {
      console.log(`[Network Suppression] URL removida: ${url}`);
    }
  }
};

// Função para adicionar um padrão regex à lista de supressão
export const addSuppressedPattern = (pattern: RegExp, config: NetworkSuppressionConfig = defaultNetworkConfig): void => {
  if (!config.suppressedPatterns.some(p => p.toString() === pattern.toString())) {
    config.suppressedPatterns.push(pattern);
    if (config.debugMode) {
      console.log(`[Network Suppression] Padrão adicionado: ${pattern}`);
    }
  }
};

// Função para habilitar/desabilitar debug mode
export const setDebugMode = (enabled: boolean, config: NetworkSuppressionConfig = defaultNetworkConfig): void => {
  config.debugMode = enabled;
  console.log(`[Network Suppression] Modo debug ${enabled ? 'habilitado' : 'desabilitado'}`);
};
