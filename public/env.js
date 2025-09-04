// Script para expor variáveis de ambiente do Cloudflare
// Este arquivo é injetado no HTML para disponibilizar variáveis não-REACT_APP_

window.ENV = {
  RECAPTCHA_SITE_KEY: '%%RECAPTCHA_SITE_KEY%%'
};
