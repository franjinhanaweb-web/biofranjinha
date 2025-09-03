import React, { useState, useRef, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { ExperiencePackage } from '../../types';
import VinylRecord from '../VinylRecord';
import styles from './Experiences.module.css';

interface ExperiencesProps {
  packages: ExperiencePackage[];
}

interface BubbleCardProps {
  package: ExperiencePackage;
  isSelected: boolean;
  isOtherSelected: boolean;
  onSelect: () => void;
}

const BubbleCard: React.FC<BubbleCardProps> = ({ 
  package: pkg, 
  isSelected, 
  isOtherSelected, 
  onSelect 
}) => {

  return (
    <div className={`${styles.bubbleContainer} ${isOtherSelected ? styles.otherSelected : ''}`}>
      {/* Disco de Vinil */}
      <VinylRecord
        labelImage={pkg.name.toLowerCase().includes('classic') ? "/images/classic.png" : ""}
        coverImage={
          pkg.name.toLowerCase().includes('classic') ? "/images/classic-1.jpg" :
          pkg.name.toLowerCase().includes('prestige') ? "/images/prestige-2.png" :
          pkg.name.toLowerCase().includes('girlfriend') ? "/images/girlfriend-1.png" :
          pkg.name.toLowerCase().includes('flash') ? "/images/flash3.1.png" :
          pkg.name.toLowerCase().includes('passaporte') ? "/images/passaporte.png" :
          pkg.name.toLowerCase().includes('comfort') ? "/images/confortee.png" :
          undefined
        }
        style={{
          backgroundSize: pkg.name.toLowerCase().includes('comfort') ? '140% 140%' : '100% 100%'
        }}
        coverText={pkg.name}
        onClick={onSelect}
        isSpinning={isSelected}
        className={isSelected ? styles.selected : ''}
      />
    </div>
  );
};

const Experiences: React.FC<ExperiencesProps> = ({ packages }) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPassaporteExpanded, setIsPassaporteExpanded] = useState(false);
  const [activePassaporteTab, setActivePassaporteTab] = useState<'how-it-works' | 'mimo-secreto' | 'transfer'>('how-it-works');


  const handlePackageSelect = (packageName: string) => {
    setSelectedPackage(selectedPackage === packageName ? null : packageName);
  };

  // Novo carrossel simples e limpo
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoplayInterval = useRef<NodeJS.Timeout | null>(null);

  // Função para ir para o próximo slide
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % packages.length);
  }, [packages.length]);

  // Função para ir para o slide anterior
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + packages.length) % packages.length);
  }, [packages.length]);

  // Autoplay
  const startAutoplay = useCallback(() => {
    if (autoplayInterval.current) clearInterval(autoplayInterval.current);
    autoplayInterval.current = setInterval(() => {
      if (isAutoPlaying) {
        goToNext();
      }
    }, 4000); // Aumentei para 4 segundos para dar mais tempo para ver cada álbum
  }, [isAutoPlaying, goToNext]);

  // Pausar autoplay
  const pauseAutoplay = () => {
    setIsAutoPlaying(false);
    if (autoplayInterval.current) clearInterval(autoplayInterval.current);
  };

  // Reiniciar autoplay
  const resumeAutoplay = () => {
    setIsAutoPlaying(true);
    startAutoplay();
  };

  // Iniciar autoplay quando o componente monta
  React.useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayInterval.current) clearInterval(autoplayInterval.current);
    };
  }, [startAutoplay]); // Adicionado startAutoplay como dependência

  // Handlers de touch
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    pauseAutoplay();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
    
    // Reinicia o autoplay após 5 segundos
    setTimeout(() => {
      resumeAutoplay();
    }, 5000);
  };



  return (
    <section className={styles.experiences} id="experiencias">
      <Container>
        {/* Pacotes Principais - Design de Bolhas */}
        <div className={styles.packagesSection}>
          <div className={styles.packagesIntro}>
            <h3 className={styles.packagesTitle}>Momentos Especiais</h3>
            <p className={styles.packagesDescription}>
              Diferentes durações para diferentes necessidades. Sempre com carinho e atenção.
            </p>
          </div>

          {/* Layout Original - Desktop */}
          <div className={styles.bubblesContainer}>
            {packages.map((pkg, index) => (
              <BubbleCard
                key={index}
                package={pkg}
                isSelected={selectedPackage === pkg.name}
                isOtherSelected={selectedPackage !== null && selectedPackage !== pkg.name}
                onSelect={() => handlePackageSelect(pkg.name)}
              />
            ))}
          </div>

          {/* Novo Carrossel - Mobile */}
          <div className={styles.mobileCarousel}>
            <div 
              className={styles.carouselContainer}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className={styles.carouselTrack}
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: 'transform 0.5s ease-in-out'
                }}
              >
                {packages.map((pkg, index) => (
                  <div key={index} className={styles.carouselSlide}>
                    <BubbleCard
                      package={pkg}
                      isSelected={selectedPackage === pkg.name}
                      isOtherSelected={selectedPackage !== null && selectedPackage !== pkg.name}
                      onSelect={() => handlePackageSelect(pkg.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Indicador de Swipe */}
            <div className={styles.swipeIndicator}>
              <div className={styles.swipeIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 6L4 10L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 6L20 10L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles.swipeText}>Deslize para navegar</span>
            </div>
          </div>

          {/* Seção de Informações */}
          {selectedPackage && (
            <div className={styles.infoSection}>
              {(() => {
                const selectedPkg = packages.find(pkg => pkg.name === selectedPackage);
                if (!selectedPkg) return null;

                const accentColor = selectedPkg.name.toLowerCase().includes('prestige') ? 'gold' :
                                  selectedPkg.name.toLowerCase().includes('girlfriend') ? 'pink' :
                                  selectedPkg.name.toLowerCase().includes('flash') ? 'brown' :
                                  selectedPkg.name.toLowerCase().includes('passaporte') ? 'green' :
                                  selectedPkg.name.toLowerCase().includes('comfort') ? 'red' : 'purple';

                const planColors = selectedPkg.name.toLowerCase().includes('prestige') ? {
                  primary: '#f59e0b',
                  light: 'rgba(245, 158, 11, 0.1)',
                  border: 'rgba(245, 158, 11, 0.2)',
                  shadow: 'rgba(245, 158, 11, 0.3)'
                } : selectedPkg.name.toLowerCase().includes('girlfriend') ? {
                  primary: '#ec4899',
                  light: 'rgba(236, 72, 153, 0.1)',
                  border: 'rgba(236, 72, 153, 0.2)',
                  shadow: 'rgba(236, 72, 153, 0.3)'
                } : selectedPkg.name.toLowerCase().includes('flash') ? {
                  primary: '#d2691e',
                  light: 'rgba(210, 105, 30, 0.1)',
                  border: 'rgba(210, 105, 30, 0.2)',
                  shadow: 'rgba(210, 105, 30, 0.3)'
                } : selectedPkg.name.toLowerCase().includes('passaporte') ? {
                  primary: '#059669',
                  light: 'rgba(5, 150, 105, 0.1)',
                  border: 'rgba(5, 150, 105, 0.2)',
                  shadow: 'rgba(5, 150, 105, 0.3)'
                } : selectedPkg.name.toLowerCase().includes('comfort') ? {
                  primary: '#ff69b4',
                  light: 'rgba(255, 105, 180, 0.1)',
                  border: 'rgba(255, 105, 180, 0.2)',
                  shadow: 'rgba(255, 105, 180, 0.3)'
                } : {
                  primary: '#e91e63',
                  light: 'rgba(233, 30, 99, 0.1)',
                  border: 'rgba(233, 30, 99, 0.2)',
                  shadow: 'rgba(233, 30, 99, 0.3)'
                };

                return (
                  <div 
                    className={`${styles.infoCard} ${styles[`card${accentColor.charAt(0).toUpperCase() + accentColor.slice(1)}`]}`}
                    style={{ 
                      '--accent-color': planColors.primary,
                      '--accent-light': planColors.light,
                      '--accent-border': planColors.border,
                      '--accent-shadow': planColors.shadow
                    } as React.CSSProperties}
                  >
                    {/* Badge "Mais escolhido" */}
                    {selectedPkg.popular && (
                      <div className={styles.cardPopularBadge}>
                        <span>✨ Mais escolhido</span>
                      </div>
                    )}

                    {/* Container com capa e informações */}
                    <div className={styles.infoContent}>
                      {/* Capa do Álbum */}
                      <div className={styles.albumCoverContainer}>
                        <div 
                          className={styles.vinylCover}
                          style={{ 
                            backgroundImage: selectedPkg.name.toLowerCase().includes('classic') ? "url('/images/classic-1.jpg')" :
                                          selectedPkg.name.toLowerCase().includes('prestige') ? "url('/images/prestige-2.png')" :
                                          selectedPkg.name.toLowerCase().includes('girlfriend') ? "url('/images/girlfriend-1.png')" :
                                          selectedPkg.name.toLowerCase().includes('flash') ? "url('/images/flash3.1.png')" :
                                          selectedPkg.name.toLowerCase().includes('passaporte') ? "url('/images/passaporte.png')" :
                                          selectedPkg.name.toLowerCase().includes('comfort') ? "url('/images/confortee.png')" :
                                          undefined,
                            backgroundSize: selectedPkg.name.toLowerCase().includes('comfort') ? '140% 140%' : '100% 100%'
                          }}
                        >
                          <div className={styles.vinylPrint}></div>
                          <div className={styles.vinylCoverText}>
                            {selectedPkg.name}
                          </div>
                        </div>
                      </div>

                      {/* Informações do Álbum */}
                      <div className={styles.albumInfo}>
                        {/* Tracklist */}
                        <div className={styles.tracklist}>
                          <div className={styles.tracklistTitle}>TRACKLIST</div>
                          <div className={styles.tracklistColumns}>
                            {selectedPkg.name.toLowerCase().includes('classic') ? (
                              // Tracklist específica para Classic
                              <div className={styles.tracklistColumn}>
                                <div className={styles.track}>1. ATENDIMENTO CARINHOSO</div>
                                <div className={styles.track}>2. AMBIENTE DISCRETO</div>
                                <div className={styles.track}>3. EXPERIÊNCIA ÚNICA</div>
                                <div className={styles.track}>4. TRANSFER METRÔ</div>
                              </div>
                            ) : selectedPkg.name.toLowerCase().includes('prestige') ? (
                              // Tracklist específica para Prestige
                              <div className={styles.tracklistColumn}>
                                <div className={styles.track}>1. MOMENTO DE CONEXÃO</div>
                                <div className={styles.track}>2. ATENDIMENTO CARINHOSO</div>
                                <div className={styles.track}>3. AMBIENTE DISCRETO</div>
                                <div className={styles.track}>4. MOMENTOS ESPECIAIS</div>
                                <div className={styles.track}>5. TEMPO DE QUALIDADE</div>
                                <div className={styles.track}>6. TRANSFER METRÔ</div>
                              </div>
                            ) : selectedPkg.name.toLowerCase().includes('flash') ? (
                              // Tracklist específica para Flash
                              <div className={styles.tracklistColumn}>
                                <div className={styles.track}>1. OBJETIVO</div>
                                <div className={styles.track}>2. SEM PERDER O CLIMA</div>
                                <div className={styles.track}>3. PRÁTICO</div>
                                <div className={styles.track}>4. TRANSFER METRÔ</div>
                              </div>
                            ) : selectedPkg.name.toLowerCase().includes('passaporte') ? (
                              // Tracklist específica para Passaporte
                              <div className={styles.tracklistColumn}>
                                <div className={styles.track}>1. EXCLUSIVO ASSINANTES</div>
                                <div className={styles.track}>2. AGENDA PRIORITÁRIA</div>
                                <div className={styles.track}>3. VALOR ESPECIAL</div>
                                <div className={styles.track}>4. MIMO SECRETO</div>
                              </div>
                            ) : selectedPkg.name.toLowerCase().includes('comfort') ? (
                              // Tracklist específica para Comfort
                              <div className={styles.tracklistColumn}>
                                <div className={styles.track}>1. COMPANHIA SOCIAL</div>
                                <div className={styles.track}>2. CONVERSAS LEVES</div>
                                <div className={styles.track}>3. MOMENTOS COMPARTILHADOS</div>
                                <div className={styles.track}>4. CAFÉ, JANTAR, CINEMA</div>
                                <div className={styles.track}>5. RESPEITO & GENTILEZA</div>
                                <div className={styles.track}>6. SEM CONTATO FÍSICO</div>
                                <div className={styles.track}>7. TRANSFER METRÔ</div>
                              </div>
                            ) : (
                              // Tracklist específica para Girlfriend
                              <>
                                <div className={styles.tracklistColumn}>
                                  <div className={styles.track}>1. MOMENTO DE CONEXÃO</div>
                                  <div className={styles.track}>2. ATENDIMENTO CARINHOSO</div>
                                  <div className={styles.track}>3. AMBIENTE DISCRETO</div>
                                  <div className={styles.track}>4. MOMENTOS ESPECIAIS</div>
                                </div>
                                <div className={styles.tracklistColumn}>
                                  <div className={styles.track}>5. TEMPO DE QUALIDADE</div>
                                  <div className={styles.track}>6. EXPERIÊNCIA ÚNICA</div>
                                  <div className={styles.track}>7. ATENÇÃO PERSONALIZADA</div>
                                  <div className={styles.track}>8. EXPERIÊNCIA PREMIUM</div>
                                  <div className={styles.track}>9. TRANSFER METRÔ</div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Seção Passaporte - Abas Expansíveis */}
                        {selectedPkg.name.toLowerCase().includes('passaporte') && (
                          <div className={styles.passaporteExpandable}>
                            <div className={styles.passaporteTabs}>
                              <button 
                                className={`${styles.passaporteTab} ${activePassaporteTab === 'how-it-works' ? styles.active : ''}`}
                                onClick={() => setActivePassaporteTab('how-it-works')}
                              >
                                COMO FUNCIONA
                              </button>
                              <button 
                                className={`${styles.passaporteTab} ${activePassaporteTab === 'mimo-secreto' ? styles.active : ''}`}
                                onClick={() => setActivePassaporteTab('mimo-secreto')}
                              >
                                MIMO SECRETO
                              </button>
                              <button 
                                className={`${styles.passaporteTab} ${activePassaporteTab === 'transfer' ? styles.active : ''}`}
                                onClick={() => setActivePassaporteTab('transfer')}
                              >
                                TRANSFER METRÔ
                              </button>
                            </div>
                            
                            <button 
                              className={styles.passaporteToggle}
                              onClick={() => setIsPassaporteExpanded(!isPassaporteExpanded)}
                            >
                              <span>
                                {activePassaporteTab === 'how-it-works' ? 'COMO FUNCIONA' : 
                                 activePassaporteTab === 'mimo-secreto' ? 'MIMO SECRETO' : 
                                 'TRANSFER METRÔ'}
                              </span>
                            </button>
                            
                            {isPassaporteExpanded && (
                              <div className={styles.passaporteContent}>
                                {activePassaporteTab === 'how-it-works' && (
                                  <>
                                    <div className={styles.passaporteSteps}>
                                      <div className={styles.passaporteStep}>
                                        <span className={styles.stepText}>Assine o meu privacy ou onlyfans</span>
                                      </div>
                                      <div className={styles.passaporteStep}>
                                        <span className={styles.stepText}>Reserve um horário</span>
                                      </div>
                                      <div className={styles.passaporteStep}>
                                        <span className={styles.stepText}>Envie comprovação de assinatura ativa</span>
                                      </div>
                                      <div className={styles.passaporteStep}>
                                        <span className={styles.stepText}>Envie o seu @ do privacy</span>
                                      </div>
                                    </div>
                                    <div className={styles.passaporteNote}>
                                      Válido apenas com assinatura ativa • Agenda prioritária sujeita à disponibilidade
                                    </div>
                                  </>
                                )}
                                
                                {activePassaporteTab === 'mimo-secreto' && (
                                  <div className={styles.passaporteMimo}>
                                    <p>O mimo secreto ele é um sorteio que acontece exclusivamente para os meus assinantes do privacy ou onlyfans.</p>
                                    <p>Você pode ganhar um atendimento comigo ou um valor em dinheiro.</p>
                                    <p>O resultado sai nos meus melhores amigos do instagram</p>
                                  </div>
                                )}
                                
                                {activePassaporteTab === 'transfer' && (
                                  <div className={styles.passaporteTransfer}>
                                    <div className={styles.passaporteTransferSection}>
                                      <h4>Conforto & Segurança:</h4>
                                      <p>Ao chegar na estação Trianon-Masp, peça um uber pelo seu celular, para vir ao meu flat. Tanto a ida quando a volta eu vou abater do valor final do atendimento.</p>
                                    </div>
                                    <div className={styles.passaporteTransferSection}>
                                      <h4>Área & Limite:</h4>
                                      <p>Estação Trianon-Masp</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Seção Classic - Transfer Cortesia */}
                        {selectedPkg.name.toLowerCase().includes('classic') && (
                          <div className={styles.transferCard}>
                            <div className={styles.transferHeader}>
                              <span>TRANSFER METRÔ</span>
                            </div>
                            <div className={styles.transferContent}>
                              <div className={styles.transferInfo}>
                                <div className={styles.transferSection}>
                                  <h4>Conforto & Segurança:</h4>
                                  <p>Ao chegar na estação Trianon-Masp, peça um uber pelo seu celular, para vir ao meu flat. Tanto a ida quando a volta eu vou abater do valor final do atendimento.</p>
                                </div>
                                <div className={styles.transferSection}>
                                  <h4>Área & Limite:</h4>
                                  <p>Estação Trianon-Masp</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Seção Transfer Cortesia - Flash */}
                        {selectedPkg.name.toLowerCase().includes('flash') && (
                          <div className={`${styles.transferCard} ${styles.flashTransfer}`}>
                            <div className={styles.flashTransferHeader}>
                              <span>TRANSFER METRÔ</span>
                            </div>
                            <div className={styles.transferContent}>
                              <div className={styles.transferInfo}>
                                <div className={styles.flashTransferSection}>
                                  <h4>Conforto & Segurança:</h4>
                                  <p>Ao chegar na estação Trianon-Masp, peça um uber pelo seu celular, para vir ao meu flat. Tanto a ida quando a volta eu vou abater do valor final do atendimento.</p>
                                </div>
                                <div className={styles.flashTransferSection}>
                                  <h4>Área & Limite:</h4>
                                  <p>Estação Trianon-Masp</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Seção Transfer Cortesia - Prestige */}
                        {selectedPkg.name.toLowerCase().includes('prestige') && (
                          <div className={`${styles.transferCard} ${styles.prestigeTransfer}`}>
                            <div className={styles.prestigeTransferHeader}>
                              <span>TRANSFER METRÔ</span>
                            </div>
                            <div className={styles.transferContent}>
                              <div className={styles.transferInfo}>
                                <div className={styles.prestigeTransferSection}>
                                  <h4>Conforto & Segurança:</h4>
                                  <p>Ao chegar na estação Trianon-Masp, peça um uber pelo seu celular, para vir ao meu flat. Tanto a ida quando a volta eu vou abater do valor final do atendimento.</p>
                                </div>
                                <div className={styles.prestigeTransferSection}>
                                  <h4>Área & Limite:</h4>
                                  <p>Estação Trianon-Masp</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Seção Transfer Cortesia - Comfort */}
                        {selectedPkg.name.toLowerCase().includes('comfort') && (
                          <div className={styles.transferCard}>
                            <div className={styles.transferHeader}>
                              <span>TRANSFER METRÔ</span>
                            </div>
                            <div className={styles.transferContent}>
                              <div className={styles.transferInfo}>
                                <div className={styles.transferSection}>
                                  <h4>Conforto & Segurança:</h4>
                                  <p>Ao chegar na estação Trianon-Masp, peça um uber pelo seu celular, para vir ao meu flat. Tanto a ida quando a volta eu vou abater do valor final do atendimento.</p>
                                </div>
                                <div className={styles.transferSection}>
                                  <h4>Área & Limite:</h4>
                                  <p>Estação Trianon-Masp</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Seção Transfer Cortesia - Girlfriend */}
                        {selectedPkg.name.toLowerCase().includes('girlfriend') && (
                          <div className={styles.transferCard}>
                            <div className={styles.transferHeader}>
                              <span>TRANSFER METRÔ</span>
                            </div>
                            <div className={styles.transferContent}>
                              <div className={styles.transferInfo}>
                                <div className={styles.transferSection}>
                                  <h4>Conforto & Segurança:</h4>
                                  <p>Ao chegar na estação Trianon-Masp, peça um uber pelo seu celular, para vir ao meu flat. Tanto a ida quando a volta eu vou abater do valor final do atendimento.</p>
                                </div>
                                <div className={styles.transferSection}>
                                  <h4>Área & Limite:</h4>
                                  <p>Estação Trianon-Masp</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Linha separadora */}
                        <div className={styles.separator}></div>

                        {/* Informações de Copyright */}
                        <div className={styles.copyrightSection}>
                          <div className={styles.copyrightLeft}>
                            <div className={styles.logoContainer}>
                              <div className={styles.logo}>F</div>
                              <div className={styles.lpBadge}>LP</div>
                            </div>
                            <div className={styles.copyrightText}>
                              <div>© 2025 Franjinha Records</div>
                              <div>Produzido por: Franjinha</div>
                              <div>Local: Jardim Paulista</div>
                              <div>Duração: {selectedPkg.duration}</div>
                            </div>
                          </div>
                          <div className={styles.copyrightRight}>
                            <div className={styles.barcode}>
                              <div className={styles.barcodeLines}></div>
                              <div className={styles.barcodeNumbers}>5 772466 75 000</div>
                            </div>
                            <div className={styles.priceInfo}>
                              <div className={styles.priceLabel}>PREÇO</div>
                              {selectedPkg.name.toLowerCase().includes('prestige') && (
                                <div className={styles.originalPrice}>R$ 1.910</div>
                              )}
                              <div className={styles.currentPrice}>R$ {selectedPkg.price}</div>
                              {selectedPkg.name.toLowerCase().includes('prestige') && (
                                <div className={styles.discount}>- R$ 230,80 off por hora</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className={styles.albumCTA}>
                          <button className={styles.albumActionButton}>
                            Agendar Agora
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>



        {/* Seção About - Valores */}
        <div className={styles.aboutSection}>
          <div className={styles.aboutIntro}>
            <h3 className={styles.aboutTitle}>Sobre Mim</h3>
            <p className={styles.aboutDescription}>
              Os valores que guiam cada encontro especial
            </p>
          </div>

          <div className={styles.triangularContainer}>
            {/* Anel circular de fundo */}
            <div className={styles.circularRing}></div>
            
            {/* Bolha Tranquilidade (topo) */}
            <div className={`${styles.valueBubble} ${styles.tranquilidadeBubble}`}>
              <div className={styles.bubbleContent}>
                <div className={styles.bubbleIcon}>😌</div>
                <h4 className={styles.bubbleTitle}>Tranquilidade</h4>
                <p className={styles.bubbleDescription}>
                  Companhia carinhosa, sem pressa. Momentos únicos.
                </p>
              </div>
            </div>

            {/* Bolha Carinho (esquerda) */}
            <div className={`${styles.valueBubble} ${styles.carinhoBubble}`}>
              <div className={styles.bubbleContent}>
                <div className={styles.bubbleIcon}>💝</div>
                <h4 className={styles.bubbleTitle}>Carinho</h4>
                <p className={styles.bubbleDescription}>
                  Encontros atenciosos, nada mecânico. Foco total em você.
                </p>
              </div>
            </div>

            {/* Bolha Respeito (direita) */}
            <div className={`${styles.valueBubble} ${styles.respeitoBubble}`}>
              <div className={styles.bubbleContent}>
                <div className={styles.bubbleIcon}>✨</div>
                <h4 className={styles.bubbleTitle}>Respeito</h4>
                <p className={styles.bubbleDescription}>
                  Higiene e gentileza essenciais. Ambiente seguro e acolhedor.
                </p>
              </div>
            </div>

            {/* Conectores curvos */}
            <svg className={styles.connectors} viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M 200 80 Q 120 200 200 200" 
                className={styles.connectorLine}
                stroke="rgba(147, 51, 234, 0.3)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path 
                d="M 200 80 Q 280 200 200 200" 
                className={styles.connectorLine}
                stroke="rgba(147, 51, 234, 0.3)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path 
                d="M 120 200 Q 200 250 280 200" 
                className={styles.connectorLine}
                stroke="rgba(147, 51, 234, 0.3)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Símbolo central opcional */}
            <div className={styles.centralSymbol}>
              <div className={styles.symbolIcon}>💖</div>
            </div>
          </div>
        </div>

        {/* Mensagem Final */}
        <div className={styles.finalMessage}>
          <div className={styles.messageContent}>
            <h4>Precisa de mais tempo?</h4>
            <p>
              Sempre podemos ajustar a duração do nosso encontro. 
              Me conte o que você tem em mente e vamos criar algo perfeito juntos.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Experiences;
