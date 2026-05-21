// ROTA: app/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

const CADASTRO_URL = 'https://jogodohexa.plataformapremios.site/#cadastro';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type Stage = {
  label: string;
  detail: string;
  pct: number;
};

const stages: Stage[] = [
  { label: 'Localizando evento ativo', detail: 'Conectando ao desafio promocional mobile', pct: 18 },
  { label: 'Validando participação', detail: 'Checando disponibilidade para novo jogador', pct: 42 },
  { label: 'Reservando acesso especial', detail: 'Separando uma posição na rodada por tempo limitado', pct: 68 },
  { label: 'Acesso promocional liberado', detail: 'Próxima etapa: concluir cadastro oficial', pct: 100 }
];

function track(eventName: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  const eventID = `hex_${eventName}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  window.fbq('trackCustom', eventName, { ...data, event_id: eventID });
}

export default function Home() {
  const [stageIndex, setStageIndex] = useState(0);
  const [seconds, setSeconds] = useState(597);
  const [unlocked, setUnlocked] = useState(false);

  const currentStage = stages[stageIndex];
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  const spotsLeft = useMemo(() => {
    if (stageIndex === 0) return 13;
    if (stageIndex === 1) return 9;
    if (stageIndex === 2) return 5;
    return 3;
  }, [stageIndex]);

  useEffect(() => {
    track('PreLP_Loaded', { page: 'desafio_do_hexa_pre_lp_safe' });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStageIndex((value) => {
        if (value >= stages.length - 1) {
          setUnlocked(true);
          window.clearInterval(interval);
          track('PreLP_AccessUnlocked', { step: 'acesso_promocional_liberado' });
          return value;
        }
        return value + 1;
      });
    }, 1350);
    return () => window.clearInterval(interval);
  }, []);

  function goToCadastro() {
    track('PreLP_ClickCadastro', {
      destination: CADASTRO_URL,
      spots_left: spotsLeft,
      stage: currentStage.label
    });
    window.location.href = CADASTRO_URL;
  }

  return (
    <main className="pageShell">
      <section className="phoneFrame" aria-label="Pré cadastro Desafio do Hexa">
        <div className="ambient ambientOne" />
        <div className="ambient ambientTwo" />
        <div className="gridGlow" />
        <div className="stadiumLines" />

        <header className="hero">
          <div className="liveBadge">
            <span /> Evento promocional ativo hoje
          </div>
          <img src="/logo.png" alt="Desafio do Hexa" className="logo" />
          <div className="heroCopy">
            <p className="kicker">Challenge mobile para novos jogadores</p>
            <h1>
              Desafio especial <strong>em análise</strong>
            </h1>
            <p>
              Conclua a verificação rápida para consultar a disponibilidade da rodada promocional.
            </p>
          </div>
        </header>

        <section className="gameCard">
          <div className="gameHeader">
            <span>Desafio do Hexa</span>
            <strong>{currentStage.pct}%</strong>
          </div>

          <div className="field">
            <span className="ball ballOne">⚽</span>
            <span className="ball ballTwo">🏆</span>
            <span className="ball ballThree">⭐</span>
            <div className="goalBox" />
          </div>

          <div className="progressBox">
            <div className="progressTop">
              <span>{currentStage.label}</span>
              <b>{currentStage.pct}%</b>
            </div>
            <div className="progressTrack">
              <div style={{ width: `${currentStage.pct}%` }} />
            </div>
            <small>{currentStage.detail}</small>
          </div>
        </section>

        <section className="statusPanel">
          <div>
            <span>Tempo do acesso</span>
            <strong>{minutes}:{secs}</strong>
          </div>
          <div>
            <span>Vagas da rodada</span>
            <strong>{spotsLeft}</strong>
          </div>
        </section>

        <section className="rewardCard">
          <div className="chips">
            <span>+18</span>
            <span>Challenge casual</span>
            <span>Rodada limitada</span>
          </div>

          <h2>
            Sua participação está quase liberada
          </h2>
          <p>
            Finalize a próxima etapa para entrar na experiência oficial do Desafio do Hexa.
          </p>

          <div className="valueBox">
            <span>Status do acesso</span>
            <strong>Ativo</strong>
            <small>disponibilidade promocional sujeita às regras da rodada</small>
          </div>
        </section>

        <section className="steps">
          <div className="step active"><b>1</b><span>Evento localizado</span></div>
          <div className="step active"><b>2</b><span>Acesso reservado</span></div>
          <div className={`step ${unlocked ? 'active' : ''}`}><b>3</b><span>Cadastro oficial</span></div>
        </section>

        <button className="mainCta" type="button" onClick={goToCadastro}>
          <span>{unlocked ? 'Entrar na rodada' : 'Continuar verificação'}</span>
          <b>Acessar desafio</b>
        </button>

        <footer className="footerSafe">
          <span>Experiência de entretenimento</span>
          <span>Proibido para menores de 18 anos</span>
        </footer>
      </section>
    </main>
  );
}
