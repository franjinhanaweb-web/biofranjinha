import React from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import Experiences from '../../components/Experiences/Experiences';

import Location from '../../components/Location/Location';
import Preferences from '../../components/Preferences/Preferences';
import Payment from '../../components/Payment/Payment';
import Marquee from '../../components/Marquee/Marquee';
import Footer from '../../components/Footer/Footer';
import { 
  NavItem, 
  HeroProps, 
  ExperiencePackage, 

  LocationInfo,
  PreferencesLimits,
  PaymentConfig
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
    },
    {
      name: 'Flash',
      duration: '30 minutos',
      price: '530,00',
      description: 'Conexão profunda e íntima',
      features: ['Momento íntimo', 'Conexão especial', 'Ambiente privado'],
      popular: false,
      personality: {
        trait: 'Intimidade',
        emotion: 'Conexão',
        description: 'Um encontro focado na conexão íntima e momentos especiais compartilhados.'
      },
      mood: 'Íntimo e Especial'
    },
    {
      name: 'Passaporte',
      duration: '1 hora',
      price: '530,00',
      description: 'Experiência exclusiva para assinantes',
      features: ['Agenda prioritária', 'Valor especial', 'Mimo secreto'],
      popular: false,
      personality: {
        trait: 'Exclusividade',
        emotion: 'Privilegio',
        description: 'Uma experiência premium exclusiva para assinantes ativos do Privacy ou OnlyFans.'
      },
      mood: 'Exclusivo e Privilegiado'
    },
    {
      name: 'Comfort',
      duration: '3 horas',
      price: '620,00',
      description: 'Encontro romântico e especial',
      features: ['Clima romântico', 'Momentos especiais', 'Ambiente acolhedor'],
      popular: false,
      personality: {
        trait: 'Romantismo',
        emotion: 'Paixão',
        description: 'Um encontro dedicado ao romantismo e aos momentos especiais entre duas pessoas.'
      },
      mood: 'Romântico e Apaixonante'
    }
  ];





  const locationData: LocationInfo = {
    area: 'Bairro Jardins, próximo a Paulista',
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
      'Podolatria (Calço 34 e não sinto cocegas)',
      'Ambiente aconchegante e limpo'
    ],
    limits: [
      'Não aceito finalizações na boca ou rosto',
      'Não faço anal',
      'Não atendo pessoas agressivas',
      'Não tolero desrespeito'
    ]
  };

  const paymentConfig: PaymentConfig = {
    PIX_KEY: 'pix@franjinha.com',
    PIX_HOLDER_NAME: 'Franjinha',
    CARD_FEE_PERCENT: 3.5,
    DEPOSIT_PERCENT: 30,
    DEPOSIT_DEADLINE_HOURS: 24,
    CANCEL_WINDOW_HOURS: 12,
    CREDIT_VALIDITY_DAYS: 30,
    LATE_TOLERANCE_MIN: 15,
    WHATSAPP_URL: 'https://wa.me/5511999999999'
  };

  return (
    <div className={styles.landingPage}>
      <Header brandName="Franjinha" navItems={navItems} />
      <main>
        <Hero {...heroProps} />
        <Experiences 
          packages={experiencePackages} 
        />

        <Location locationData={locationData} />
        <Preferences preferencesData={preferencesData} />
        <Payment config={paymentConfig} />
      </main>
      <Marquee text="Agora Aceitando Reservas" />
      <Footer />
    </div>
  );
};

export default LandingPage;
