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
  { label: 'Buscando rodada ativa', detail: 'Conectando ao sistema promocional', pct: 18 },
  { label: 'Validando novo acesso', detail: 'Verificando elegibilidade de cadastro', pct: 39 },
  { label: 'Reservando banca inicial', detail: 'Separando acesso promocional por alguns minutos', pct: 66 },
  { label: 'Cadastro liberado', detail: 'Próxima etapa: concluir cadastro oficial', pct: 100 }
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

  const banksLeft = useMemo(() => {
    if (stageIndex === 0) return 13;
    if (stageIndex === 1) return 9;
    if (stageIndex === 2) return 5;
    return 3;
  }, [stageIndex]);

  useEffect(() => {
    track('PreLP_Loaded', { page: 'jogo_do_hexa_pre_lp' });
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
          track('PreLP_AccessUnlocked', { step: 'cadastro_liberado' });
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
      banks_left: banksLeft,
      stage: currentStage.label
    });
    window.location.href = CADASTRO_URL;
  }

  return (
    <main className="pageShell">
      <section className="phoneFrame" aria-label="Pré cadastro Jogo do Hexa">
        <div className="ambient ambientOne" />
        <div className="ambient ambientTwo" />
        <div className="gridGlow" />

        <header className="hero">
          <div className="liveBadge">
            <span /> Rodada promocional ativa agora
          </div>
          <img src="/logo.png" alt="Jogo do Hexa" className="logo" />
          <div className="heroCopy">
            <p className="kicker">Acesso inicial para novos cadastros</p>
            <h1>
              Banca de <strong>R$50</strong> em análise
            </h1>
            <p>
              Conclua a verificação e avance para o cadastro oficial enquanto a reserva está disponível.
            </p>
          </div>
        </header>

        <section className="gameCard">
          <div className="gameHeader">
            <span>Jogo do Hexa</span>
            <strong>{currentStage.pct}%</strong>
          </div>

          <div className="field">
            <span className="ball ballOne">7</span>
            <span className="ball ballTwo">5</span>
            <span className="ball ballThree">2</span>
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
            <span>Tempo da reserva</span>
            <strong>{minutes}:{secs}</strong>
          </div>
          <div>
            <span>Bancas restantes</span>
            <strong>{banksLeft}</strong>
          </div>
        </section>

        <section className="rewardCard">
          <div className="chips">
            <span>+18</span>
            <span>Sem custo inicial</span>
            <span>Rodada limitada</span>
          </div>

          <h2>
            Seu acesso está quase pronto para o cadastro
          </h2>
          <p>
            Na próxima tela, finalize seu cadastro oficial para ativar a banca inicial da rodada promocional.
          </p>

          <div className="valueBox">
            <span>Banca inicial</span>
            <strong>R$50</strong>
            <small>liberada para novos cadastros elegíveis</small>
          </div>
        </section>

        <section className="steps">
          <div className="step active"><b>1</b><span>Rodada localizada</span></div>
          <div className="step active"><b>2</b><span>Banca reservada</span></div>
          <div className={`step ${unlocked ? 'active' : ''}`}><b>3</b><span>Cadastro oficial</span></div>
        </section>

        <button className="mainCta" type="button" onClick={goToCadastro}>
          <span>{unlocked ? 'Continuar para cadastro' : 'Finalizar verificação'}</span>
          <b>Ativar banca R$50</b>
        </button>

        <footer className="footerSafe">
          <span>Jogue com responsabilidade</span>
          <span>Proibido para menores de 18 anos</span>
        </footer>
      </section>
    </main>
  );
}
