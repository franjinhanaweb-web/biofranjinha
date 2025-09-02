import React, { useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
  const carouselRef = useRef<HTMLDivElement>(null);

  const handlePackageSelect = (packageName: string) => {
    setSelectedPackage(selectedPackage === packageName ? null : packageName);
  };

  // Carrossel usa animação CSS contínua

  // Touch handlers para carrossel com navegação manual
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);
  const [isManualMode, setIsManualMode] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.targetTouches[0].clientX);
    setAnimationPaused(true);
    setIsManualMode(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault(); // Previne scroll da página
    
    const currentX = e.targetTouches[0].clientX;
    const offset = currentX - dragStart;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 50; // Distância mínima para considerar um swipe
    const currentOffset = dragOffset;
    const maxOffset = 300; // Limite máximo de movimento manual
    
    setIsDragging(false);
    setDragOffset(0);
    
    // Se o usuário fez um swipe significativo, mantém o modo manual
    if (Math.abs(currentOffset) > threshold) {
      setManualOffset(prev => {
        const newOffset = prev + currentOffset;
        // Limita o movimento dentro de limites razoáveis
        return Math.max(-maxOffset, Math.min(maxOffset, newOffset));
      });
      setIsManualMode(true);
      setAnimationPaused(true);
    } else {
      // Se foi apenas um toque, volta para o modo automático após 3 segundos
      setIsManualMode(false);
      setTimeout(() => {
        if (!isDragging) {
          setAnimationPaused(false);
          setManualOffset(0);
        }
      }, 3000);
    }
  };

  // Mouse handlers removidos - desktop usa apenas layout estático



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

          {/* Carrossel Container - Mobile */}
          <div className={styles.carouselContainer}>
            {/* Container dos slides */}
            <div 
              className={styles.carouselWrapper}
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className={styles.carouselTrack}
                style={{
                  transform: isManualMode 
                    ? `translateX(${manualOffset + dragOffset}px)` 
                    : `translateX(${dragOffset * 0.1}%)`,
                  animationPlayState: animationPaused ? 'paused' : 'running'
                }}
              >
                {/* Cria múltiplas sequências para carrossel infinito */}
                {[...Array(3)].map((_, sequenceIndex) => 
                  packages.map((pkg, index) => (
                    <div key={`${sequenceIndex}-${index}`} className={styles.carouselSlide}>
                      <BubbleCard
                        package={pkg}
                        isSelected={selectedPackage === pkg.name}
                        isOtherSelected={selectedPackage !== null && selectedPackage !== pkg.name}
                        onSelect={() => handlePackageSelect(pkg.name)}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Indicadores de navegação manual */}
            <div className={styles.carouselIndicators}>
              <div className={styles.manualHint}>
                {isManualMode ? (
                  <span className={styles.manualActive}>🎯 Modo manual ativo</span>
                ) : (
                  <span className={styles.autoHint}>👆 Toque e arraste para navegar</span>
                )}
              </div>
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
