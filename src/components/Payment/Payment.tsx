import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './Payment.module.css';

interface PaymentConfig {
  PIX_KEY: string;
  PIX_HOLDER_NAME: string;
  CARD_FEE_PERCENT?: number;
  DEPOSIT_PERCENT: number;
  DEPOSIT_DEADLINE_HOURS: number;
  CANCEL_WINDOW_HOURS: number;
  CREDIT_VALIDITY_DAYS: number;
  LATE_TOLERANCE_MIN: number;
  WHATSAPP_URL: string;
}

interface PaymentProps {
  config: PaymentConfig;
}

const Payment: React.FC<PaymentProps> = ({ config }) => {
  const [copiedPix, setCopiedPix] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(config.PIX_KEY);
      setCopiedPix(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar PIX:', err);
    }
  };



  return (
    <section className={styles.payment} id="pagamento">
      <Container>
        {/* Cabeçalho da Seção */}
        <div className={styles.paymentHeader}>
          <h2 className={styles.paymentTitle}>Pagamento & Políticas</h2>
          <p className={styles.paymentSubtitle}>
            Transparência e praticidade para o nosso encontro.
          </p>
          
          {/* Linha de Ícones/Badges */}
          <div className={styles.paymentMethods}>
            <div className={styles.methodBadge}>
              <span className={styles.methodIcon}>💳</span>
              <span className={styles.methodText}>Pix</span>
            </div>
            <div className={styles.methodBadge}>
              <span className={styles.methodIcon}>💵</span>
              <span className={styles.methodText}>Dinheiro</span>
            </div>
            <div className={styles.methodBadge}>
              <span className={styles.methodIcon}>💳</span>
              <span className={styles.methodText}>Cartão</span>
            </div>
          </div>
        </div>

        <Row className={styles.paymentContent}>
          {/* Coluna Esquerda - Métodos de Pagamento */}
          <Col lg={6} className={styles.paymentColumn}>
            <div className={styles.paymentCard}>
              <h3 className={styles.cardTitle}>Métodos de Pagamento</h3>
              
              {/* PIX */}
              <div className={styles.paymentMethod}>
                <div className={styles.methodHeader}>
                  <span className={styles.methodIcon}>💳</span>
                  <span className={styles.methodName}>Pix</span>
                </div>
                <div className={styles.pixSection}>
                  <div className={styles.pixKey}>
                    <span className={styles.pixLabel}>Chave PIX:</span>
                    <div className={styles.pixValue}>
                      <code>{config.PIX_KEY}</code>
                      <button 
                        className={styles.copyButton}
                        onClick={handleCopyPix}
                        title="Copiar chave PIX"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <p className={styles.pixNote}>
                    Envie o comprovante no WhatsApp após reservar
                  </p>
                  <div className={styles.pixWarning}>
                    <strong>⚠️ IMPORTANTE:</strong> Faça o adiantamento, somente depois de confirmar seu horário comigo no WhatsApp.<br/>
                    Qualquer valor enviado, referente a horários não agendados não serão considerados.
                  </div>
                </div>
              </div>

              {/* Dinheiro */}
              <div className={styles.paymentMethod}>
                <div className={styles.methodHeader}>
                  <span className={styles.methodIcon}>💵</span>
                  <span className={styles.methodName}>Dinheiro</span>
                </div>
                <p className={styles.cashNote}>
                  Pagamento no início do encontro
                </p>
              </div>

              {/* Cartão */}
              <div className={styles.paymentMethod}>
                <div className={styles.methodHeader}>
                  <span className={styles.methodIcon}>💳</span>
                  <span className={styles.methodName}>Cartão (Crédito/Débito)</span>
                </div>
                {config.CARD_FEE_PERCENT && (
                  <p className={styles.cardFee}>
                    Taxa da maquininha: {config.CARD_FEE_PERCENT}%
                  </p>
                )}
                <div className={styles.cardInfo}>
                  <p className={styles.cardNote}>
                    <span className={styles.cardIcon}>📱</span>
                    Pagamento somente por aproximação
                  </p>
                  <p className={styles.cardNote}>
                    <span className={styles.cardIcon}>❌</span>
                    Não realizo pagamentos parcelados
                  </p>
                </div>
              </div>


            </div>
          </Col>

          {/* Coluna Direita - Políticas e FAQ */}
          <Col lg={6} className={styles.paymentColumn}>
            {/* Card de Políticas */}
            <div className={styles.policiesCard}>
              <h3 className={styles.cardTitle}>Políticas</h3>
              
              <div className={styles.policiesList}>
                <div className={styles.policyItem}>
                  <span className={styles.policyIcon}>💰</span>
                  <div className={styles.policyContent}>
                    <strong>Sinal para confirmar:</strong> {config.DEPOSIT_PERCENT}% do valor
                  </div>
                </div>

                <div className={styles.policyItem}>
                  <span className={styles.policyIcon}>🔄</span>
                  <div className={styles.policyContent}>
                    <strong>Cancelamento/Remarcação:</strong> Avisar com muita antecedência. Avisar no dia, resultará em cancelamento do horário.
                  </div>
                </div>

                <div className={styles.policyItem}>
                  <span className={styles.policyIcon}>⏰</span>
                  <div className={styles.policyContent}>
                    <strong>Atrasos:</strong> Tolerância de {config.LATE_TOLERANCE_MIN}min; após isso, desconta do tempo
                  </div>
                </div>

                <div className={styles.policyItem}>
                  <span className={styles.policyIcon}>❌</span>
                  <div className={styles.policyContent}>
                    <strong>Não compareceu:</strong> Perda do sinal
                  </div>
                </div>

                <div className={styles.policyItem}>
                  <span className={styles.policyIcon}>💸</span>
                  <div className={styles.policyContent}>
                    <strong>Reembolsos:</strong> Não realizo
                  </div>
                </div>

                <div className={styles.policyItem}>
                  <span className={styles.policyIcon}>🤝</span>
                  <div className={styles.policyContent}>
                    <strong>Respeito & Limites:</strong> Atendimento apenas com conduta adequada
                  </div>
                </div>
              </div>
            </div>


          </Col>
        </Row>



        {/* Toast de Confirmação */}
        {showToast && (
          <div className={styles.toast}>
            <span className={styles.toastIcon}>✅</span>
            <span className={styles.toastText}>Pix copiado!</span>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Payment;
