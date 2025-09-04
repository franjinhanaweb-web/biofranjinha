import { shouldSuppressUrl, defaultNetworkConfig, NetworkSuppressionConfig } from './networkConfig';

// Utilitário para suprimir requisições de rede na aba Network do console
export const suppressNetworkRequests = (config: NetworkSuppressionConfig = defaultNetworkConfig) => {
  // Interceptar XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  // Interceptar XMLHttpRequest
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
    (this as any)._url = url.toString();
    return originalOpen.call(this, method, url, async, username, password);
  };

  XMLHttpRequest.prototype.send = function(body?: any) {
    const url = (this as any)._url;
    if (url && shouldSuppressUrl(url, config)) {
      // Simular uma requisição bem-sucedida sem realmente fazer a requisição
      setTimeout(() => {
        if (this.readyState === XMLHttpRequest.OPENED) {
          // Usar Object.defineProperty para definir propriedades read-only
          Object.defineProperty(this, 'readyState', { value: XMLHttpRequest.DONE, writable: false });
          Object.defineProperty(this, 'status', { value: 200, writable: false });
          Object.defineProperty(this, 'statusText', { value: 'OK', writable: false });
          Object.defineProperty(this, 'response', { value: '', writable: false });
          Object.defineProperty(this, 'responseText', { value: '', writable: false });
          
          // Disparar eventos de sucesso
          if (this.onreadystatechange) {
            this.onreadystatechange(new ProgressEvent('readystatechange'));
          }
          if (this.onload) {
            this.onload(new ProgressEvent('load'));
          }
        }
      }, 0);
      return;
    }
    
    return originalSend.call(this, body);
  };

  // Interceptar fetch
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    
    if (shouldSuppressUrl(url, config)) {
      // Retornar uma resposta simulada
      return new Response('', {
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    }
    
    return originalFetch(input, init);
  };

  // Interceptar criação de elementos que fazem requisições
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName: string, options?: ElementCreationOptions) {
    const element = originalCreateElement.call(this, tagName, options);
    
    // Interceptar src e href para elementos que fazem requisições
    if (tagName.toLowerCase() === 'img' || tagName.toLowerCase() === 'link') {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name: string, value: string) {
        if ((name === 'src' || name === 'href') && shouldSuppressUrl(value, config)) {
          // Não definir o atributo para evitar a requisição
          return;
        }
        return originalSetAttribute.call(this, name, value);
      };
    }
    
    return element;
  };

  // Interceptar mudanças de propriedades
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function<T>(obj: T, prop: PropertyKey, descriptor: PropertyDescriptor & ThisType<any>): T {
    if (prop === 'src' || prop === 'href') {
      const originalSet = descriptor.set;
      
      if (originalSet) {
        descriptor.set = function(value: string) {
          if (shouldSuppressUrl(value, config)) {
            return; // Não definir a propriedade
          }
          return originalSet.call(this, value);
        };
      }
    }
    
    return originalDefineProperty.call(this, obj, prop, descriptor) as T;
  };

  // Suprimir logs de rede no console
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  const suppressNetworkLogs = (originalMethod: Function) => {
    return (...args: any[]) => {
      const message = args.join(' ');
      if (shouldSuppressUrl(message, config)) {
        return; // Não mostrar logs relacionados a URLs suprimidas
      }
      return originalMethod.apply(console, args);
    };
  };

  console.log = suppressNetworkLogs(originalLog);
  console.info = suppressNetworkLogs(originalInfo);
  console.warn = suppressNetworkLogs(originalWarn);
  console.error = suppressNetworkLogs(originalError);
};

// Re-exportar funções de configuração para conveniência
export { 
  addSuppressedUrl, 
  removeSuppressedUrl, 
  addSuppressedPattern, 
  setDebugMode,
  defaultNetworkConfig 
} from './networkConfig';
