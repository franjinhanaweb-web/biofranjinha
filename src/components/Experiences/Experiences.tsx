import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ExperiencePackage, SpecialExperience } from '../../types';
import VinylRecord from '../VinylRecord';
import styles from './Experiences.module.css';

interface ExperiencesProps {
  packages: ExperiencePackage[];
  specials: SpecialExperience[];
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
          undefined
        }
        coverText={pkg.name}
        onClick={onSelect}
        isSpinning={isSelected}
        className={isSelected ? styles.selected : ''}
      />
    </div>
  );
};

const Experiences: React.FC<ExperiencesProps> = ({ packages, specials }) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handlePackageSelect = (packageName: string) => {
    setSelectedPackage(selectedPackage === packageName ? null : packageName);
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

          {/* Seção de Informações */}
          {selectedPackage && (
            <div className={styles.infoSection}>
              {(() => {
                const selectedPkg = packages.find(pkg => pkg.name === selectedPackage);
                if (!selectedPkg) return null;

                const accentColor = selectedPkg.name.toLowerCase().includes('prestige') ? 'gold' :
                                  selectedPkg.name.toLowerCase().includes('girlfriend') ? 'pink' : 'purple';

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
                                          undefined,
                            backgroundSize: '100% 100%'
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
                            <div className={styles.tracklistColumn}>
                              <div className={styles.track}>1. MOMENTO DE CONEXÃO</div>
                              <div className={styles.track}>2. ATENDIMENTO CARINHOSO</div>
                              <div className={styles.track}>3. AMBIENTE DISCRETO</div>
                              <div className={styles.track}>4. EXPERIÊNCIA ÚNICA</div>
                              <div className={styles.track}>5. TEMPO DE QUALIDADE</div>
                              <div className={styles.track}>6. MOMENTOS ESPECIAIS</div>
                            </div>
                            <div className={styles.tracklistColumn}>
                              <div className={styles.track}>7. CONEXÃO GENUÍNA</div>
                              <div className={styles.track}>8. ATENÇÃO PERSONALIZADA</div>
                              <div className={styles.track}>9. AMBIENTE ACOLHEDOR</div>
                              <div className={styles.track}>10. EXPERIÊNCIA PREMIUM</div>
                              {selectedPkg.name.toLowerCase().includes('girlfriend') && (
                                <>
                                  <div className={styles.track}>11. TEMPO EXTRA</div>
                                  <div className={styles.track}>12. MOMENTO COMPLETO</div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

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
                              <div>© 2024 Franjinha Records</div>
                              <div>Produzido por: Franjinha</div>
                              <div>Local: Região Paulista</div>
                              <div>Estilo: {selectedPkg.mood || 'Especial'}</div>
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
                                <div className={styles.discount}>- R$ 230,80 off</div>
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

        {/* Experiências Especiais - Design Moderno (mantido) */}
        <div className={styles.specialsSection}>
          <div className={styles.specialsIntro}>
            <h3 className={styles.specialsTitle}>Para Momentos Únicos</h3>
            <p className={styles.specialsDescription}>
              Opções especiais para quem busca algo diferente e exclusivo.
            </p>
          </div>

          <Row className={styles.specialsRow}>
            {specials.map((special, index) => (
              <Col key={index} lg={6} className={styles.specialCol}>
                <div className={styles.modernSpecialCard}>
                  <div className={styles.specialBadge}>
                    {special.badge}
                  </div>
                  
                  <div className={styles.specialHeader}>
                    <h4 className={styles.specialName}>{special.name}</h4>
                    <div className={styles.specialMood}>
                      <span className={styles.moodText}>{special.mood}</span>
                    </div>
                  </div>
                  
                  <div className={styles.specialPrice}>
                    <span className={styles.currency}>R$</span>
                    <span className={styles.amount}>{special.price}</span>
                  </div>
                  
                  <div className={styles.specialTime}>
                    <span className={styles.timeIcon}>⏰</span>
                    <span className={styles.durationMain}>
                      {special.duration.includes('+') ? special.duration.split('+')[0].trim() : special.duration}
                    </span>
                    {special.duration.includes('+') && (
                      <span className={styles.durationExtra}>
                        +{special.duration.split('+')[1].trim()}
                      </span>
                    )}
                  </div>

                  <p className={styles.specialDescription}>{special.description}</p>

                  <div className={styles.specialHighlights}>
                    <div className={styles.highlightItem}>
                      <span className={styles.highlightIcon}>💎</span>
                      <span>Experiência exclusiva</span>
                    </div>
                    <div className={styles.highlightItem}>
                      <span className={styles.highlightIcon}>🎯</span>
                      <span>Personalizada para você</span>
                    </div>
                  </div>
                  
                  <button className={styles.specialActionButton}>
                    Agendar agora
                  </button>
                </div>
              </Col>
            ))}
          </Row>
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
