# 🎵 Componente VinylRecord

Um componente React que renderiza um disco de vinil animado com capa de álbum e efeitos visuais.

## ✨ Características

- **Design Realista**: Simula um disco de vinil com capa de álbum
- **Animações**: Efeito de rotação quando ativo
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Interativo**: Suporte a clique e hover
- **Customizável**: Aceita diferentes imagens para capa e label

## 🚀 Como Usar

```tsx
import VinylRecord from '../VinylRecord';

// Uso básico
<VinylRecord
  labelImage="/images/album-label.jpg"
  onClick={() => console.log('Disco clicado!')}
/>

// Com capa personalizada
<VinylRecord
  labelImage="/images/album-label.jpg"
  coverImage="/images/custom-cover.jpg"
  onClick={handleClick}
/>

// Com animação de rotação
<VinylRecord
  labelImage="/images/album-label.jpg"
  isSpinning={true}
  onClick={handleClick}
/>

// Com classe customizada
<VinylRecord
  labelImage="/images/album-label.jpg"
  className="custom-vinyl"
  onClick={handleClick}
/>
```

## 📋 Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `labelImage` | `string` | **Obrigatório** | URL da imagem do label do disco |
| `coverImage` | `string` | - | URL da imagem da capa do álbum |
| `vinylImage` | `string` | - | URL da imagem do vinil |
| `onClick` | `() => void` | - | Função chamada ao clicar no disco |
| `isSpinning` | `boolean` | `false` | Ativa a animação de rotação |
| `className` | `string` | - | Classe CSS adicional |

## 🎨 Estilos

O componente usa CSS Modules e inclui:

- **Efeitos de sombra** para profundidade
- **Mix-blend-mode** para texturas realistas
- **Animações CSS** para rotação e entrada
- **Responsividade** para diferentes breakpoints

## 📱 Responsividade

- **Desktop**: 250px × 250px
- **Tablet**: 200px × 200px  
- **Mobile**: 160px × 160px

## 🔧 Personalização

Para customizar as imagens padrão, edite o arquivo CSS:

```css
.cover {
  background-image: url('sua-imagem-de-capa.jpg');
  background-size: 80% 100%; /* Proporção da capa */
}

.vinyl {
  background-image: url('sua-imagem-de-vinil.png');
}
```

### 📐 Configurações de Tamanho

- **Capa do álbum**: `background-size: 80% 100%` (80% da largura, 100% da altura)
- **Label do vinil**: `background-size: cover` (preenche todo o espaço disponível)
- **Imagem do vinil**: `background-size: 106% 106%` (ligeiramente maior para efeito visual)
