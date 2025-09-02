import React from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import Experiences from '../../components/Experiences/Experiences';
import About from '../../components/About/About';
import Location from '../../components/Location/Location';
import Preferences from '../../components/Preferences/Preferences';
import Marquee from '../../components/Marquee/Marquee';
import Footer from '../../components/Footer/Footer';
import { 
  NavItem, 
  HeroProps, 
  ExperiencePackage, 
  SpecialExperience,
  AboutSection,
  LocationInfo,
  PreferencesLimits
} from '../../types';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  const navItems: NavItem[] = [
    { label: 'Início', href: '#home' },
    { label: 'Experiências', href: '#experiencias' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Localização', href: '#localizacao' },
    { label: 'Preferências', href: '#preferencias' },
    { label: 'Pagamento', href: '#pagamento' },
    { label: 'Contato', href: '#contato' }
  ];

  const heroProps: HeroProps = {
    title: 'Um encontro que vai além do óbvio',
    subtitle: 'Carinho sem pressa, ambiente sofisticado e momentos feitos para despertar o melhor de você.',
    accentWord: 'encontro',
    ctaText: 'Agendar Agora',
    tagText: 'Hey Você!',
    imageSrc: '/images/hero-photo1.jpg',
    imageAlt: 'Mulher elegante em pose profissional'
  };

  const experiencePackages: ExperiencePackage[] = [
    {
      name: 'Classic',
      duration: '1 hora',
      price: '710,00',
      description: 'Experiência completa e satisfatória',
      features: ['Companhia carinhosa', 'Ambiente confortável', 'Sem pressa'],
      popular: false,
      imageSrc: '/images/classic-package.jpg',
      imageAlt: 'Pacote Classic - Experiência relaxante e acolhedora',
      personality: {
        trait: 'Tranquilidade',
        emotion: 'Serenidade',
        description: 'Um momento de paz e calma, onde cada segundo é aproveitado com carinho e sem pressa.'
      },
      mood: 'Zen e Acolhedor'
    },
    {
      name: 'Prestige',
      duration: '2 horas e 30 minutos',
      price: '1.340,00',
      description: 'Tempo ideal para uma experiência mais profunda',
      features: ['Mais tempo juntos', 'Conversa descontraída', 'Atenção especial'],
      popular: false,
      personality: {
        trait: 'Carinho',
        emotion: 'Intimidade',
        description: 'Dedicação total ao seu bem-estar, criando uma conexão genuína e atenciosa.'
      },
      mood: 'Quente e Conectivo'
    },
    {
      name: 'GirlFriend',
      duration: '3 horas +1 hora extra',
      price: '2.150,00',
      description: 'Experiência completa e memorável',
      features: ['Tempo amplo', 'Companhia exclusiva', 'Momentos especiais', 'Jantar especial ou saída'],
      popular: false,
      personality: {
        trait: 'Respeito',
        emotion: 'Profundidade',
        description: 'Uma experiência que honra cada momento, com gentileza e atenção aos detalhes.'
      },
      mood: 'Elegante e Refinado'
    }
  ];

  const specialExperiences: SpecialExperience[] = [
    {
      name: 'Passaporte Premium',
      duration: '1 hora',
      price: '530,00',
      description: 'Para seguidores do Privacy - experiência exclusiva com desconto especial',
      badge: 'Exclusivo',
      personality: {
        trait: 'Tranquilidade',
        emotion: 'Exclusividade',
        description: 'Um encontro especial que combina serenidade com momentos únicos e memoráveis.'
      },
      mood: 'VIP'
    },
    {
      name: 'Comfort',
      duration: '3 horas',
      price: '620,00',
      description: 'Companhia sem toque ou clima romântico - ideal para quem busca apenas conversa e atenção',
      badge: 'Especial',
      personality: {
        trait: 'Carinho',
        emotion: 'Companheirismo',
        description: 'Foco total na conexão emocional, criando um espaço seguro para conversas sinceras.'
      },
      mood: 'Conversativo'
    }
  ];

  const aboutData: AboutSection = {
    title: 'Sobre Mim',
    qualities: [
      {
        icon: '😌',
        title: 'Tranquilidade',
        description: 'Companhia carinhosa, sem pressa. Cada momento é único e especial.'
      },
      {
        icon: '💝',
        title: 'Carinho',
        description: 'Encontros atenciosos, nada mecânico. Foco total em você.'
      },
      {
        icon: '✨',
        title: 'Respeito',
        description: 'Higiene e gentileza como essenciais. Ambiente seguro e acolhedor.'
      }
    ]
  };

  const locationData: LocationInfo = {
    area: 'Região Paulista, próximo ao Paraíso',
    description: 'Flat discreto, confortável e sofisticado em localização privilegiada. Ambiente seguro e acolhedor para sua total tranquilidade.',
    amenities: [
      'Ducha quente',
      'Ar condicionado',
      'Wi-Fi gratuito',
      'Lençóis limpos',
      'Ambiente privado',
      'Entrada discreta'
    ],
    promise: 'Conforto, privacidade e discrição garantidos em um ambiente seguro e aconchegante.'
  };

  const preferencesData: PreferencesLimits = {
    offers: [
      'Experiência leve, divertida, de namoradinha',
      'Conversa, atenção, sem pressa',
      'Podolatria (calça 34, sem cócegas)',
      'Ambiente aconchegante e limpo'
    ],
    limits: [
      'Não finaliza na boca/rosto',
      'Não faz anal',
      'Não atende pessoas agressivas'
    ]
  };

  return (
    <div className={styles.landingPage}>
      <Header brandName="Franjinha" navItems={navItems} />
      <main>
        <Hero {...heroProps} />
        <Experiences 
          packages={experiencePackages} 
          specials={specialExperiences} 
        />
        <About aboutData={aboutData} />
        <Location locationData={locationData} />
        <Preferences preferencesData={preferencesData} />
      </main>
      <Marquee text="Agora Aceitando Reservas" />
      <Footer />
    </div>
  );
};

export default LandingPage;
