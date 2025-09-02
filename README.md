# Franjinha Landing Page

Uma landing page moderna e elegante construída com React, TypeScript e React Bootstrap, inspirada no design minimalista de Steve Jobs.

## 🚀 Características

- **Design Minimalista**: Interface limpa e elegante com tipografia profissional
- **Responsivo**: Mobile-first design que funciona perfeitamente em todos os dispositivos
- **Acessível**: Conformidade com WCAG 2.1 AA e suporte a navegação por teclado
- **Performance**: Otimizado para velocidade e SEO
- **TypeScript**: Código totalmente tipado para maior confiabilidade

## 🛠️ Tecnologias

- React 18
- TypeScript
- React Bootstrap
- CSS Modules
- Create React App

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd my-app
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm start
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Build para Produção

Para criar uma build otimizada para produção:

```bash
npm run build
```

A pasta `build` será criada com os arquivos estáticos prontos para deploy.

## 🌐 Deploy

### Cloudflare Pages

1. Faça push do código para o GitHub
2. Conecte seu repositório ao Cloudflare Pages
3. Configure o build command: `npm run build`
4. Configure o output directory: `build`
5. Deploy!

### Outras Plataformas

O projeto é compatível com qualquer plataforma de hosting estático:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 🎨 Personalização

### Cores
As cores principais estão definidas em CSS variables:
- **Primária**: #e91e63 (rosa)
- **Secundária**: #9c27b0 (mauve)
- **Acento**: #ff9800 (laranja)
- **Texto**: #2c2c2c (charcoal)

### Tipografia
- **Headlines**: Georgia (serif)
- **Body**: Inter (sans-serif)
- **Acento**: Dancing Script (script)

### Conteúdo
Edite o arquivo `src/pages/LandingPage/LandingPage.tsx` para personalizar:
- Textos
- Imagens
- Links de navegação
- CTA

## 📱 Responsividade

O projeto é testado nos seguintes breakpoints:
- **Mobile**: 360px
- **Tablet**: 768px
- **Desktop**: 1024px
- **Large**: 1440px

## ♿ Acessibilidade

- Suporte completo a navegação por teclado
- Focus states visíveis e bonitos
- Respeita `prefers-reduced-motion`
- Contraste AA-compliant
- HTML semântico

## 🔧 Scripts Disponíveis

- `npm start` - Executa o app em modo de desenvolvimento
- `npm run build` - Cria a build para produção
- `npm test` - Executa os testes
- `npm run eject` - Ejecta do Create React App (irreversível)

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header/         # Navegação principal
│   ├── Hero/           # Seção hero principal
│   ├── BadgeTag/       # Tags pequenas
│   ├── Marquee/        # Barra de anúncios
│   └── Footer/         # Rodapé
├── pages/              # Páginas da aplicação
│   └── LandingPage/    # Página principal
├── types/              # Definições TypeScript
└── index.tsx           # Ponto de entrada
```

## 🎯 Componentes Principais

### Header
Navbar minimalista com navegação responsiva e efeito sticky.

### Hero
Seção principal com layout split (imagem + conteúdo) e CTA destacado.

### BadgeTag
Tags pequenas para destacar informações importantes.

### Marquee
Barra de anúncios animada com suporte a `prefers-reduced-motion`.

### Footer
Rodapé simples e elegante.

## 🚀 Próximos Passos

- [ ] Adicionar mais seções (Sobre, Serviços, Contato)
- [ ] Implementar formulário de contato
- [ ] Adicionar animações mais elaboradas
- [ ] Integrar com CMS headless
- [ ] Adicionar analytics e tracking

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

**Desenvolvido com ❤️ e ☕**
