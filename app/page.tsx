// ROTA: app/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

const CADASTRO_URL = 'https://desafiodohexa.com.br/';

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

function getSessionEventId(eventName: string) {
  if (typeof window === 'undefined') return `hex_${eventName}_ssr`;
  const key = `hex_event_id_${eventName}`;
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;

  const created = `hex_${eventName}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  window.sessionStorage.setItem(key, created);
  return created;
}

function track(eventName: string, data: Record<string, unknown> = {}, standard = false) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  const eventID = getSessionEventId(eventName);
  const payload = { ...data, event_id: eventID };

  if (standard) {
    window.fbq('track', eventName, payload, { eventID });
    return;
  }

  window.fbq('trackCustom', eventName, payload, { eventID });
}

function getCookieValue(name: string) {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length !== 2) return '';
  return decodeURIComponent(parts.pop()?.split(';').shift() || '');
}

function setCookieValue(name: string, value: string, days = 90) {
  if (typeof document === 'undefined' || !value) return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getOrCreateFbc(fbclid: string) {
  const cookieFbc = getCookieValue('_fbc');
  if (cookieFbc) return cookieFbc;

  const savedFbc = window.localStorage.getItem('hex_fbc') || '';
  if (savedFbc) {
    setCookieValue('_fbc', savedFbc);
    return savedFbc;
  }

  if (!fbclid) return '';

  const fbc = `fb.1.${Date.now()}.${fbclid}`;
  window.localStorage.setItem('hex_fbc', fbc);
  setCookieValue('_fbc', fbc);
  return fbc;
}

function captureMetaBridge() {
  if (typeof window === 'undefined') {
    return { fbclid: '', fbp: '', fbc: '' };
  }

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid') || window.localStorage.getItem('hex_fbclid') || '';
  const fbp = getCookieValue('_fbp') || window.localStorage.getItem('hex_fbp') || '';
  const fbc = getOrCreateFbc(fbclid);

  if (fbclid) window.localStorage.setItem('hex_fbclid', fbclid);
  if (fbp) window.localStorage.setItem('hex_fbp', fbp);
  if (fbc) window.localStorage.setItem('hex_fbc', fbc);

  return { fbclid, fbp, fbc };
}

function buildCadastroUrl() {
  const bridge = captureMetaBridge();
  const url = new URL('https://desafiodohexa.com.br/');
  url.searchParams.set('src', 'lp');

  if (bridge.fbclid) url.searchParams.set('fbclid', bridge.fbclid);
  if (bridge.fbp) url.searchParams.set('fbp', bridge.fbp);
  if (bridge.fbc) url.searchParams.set('fbc', bridge.fbc);

  return url.toString();
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
    const bridge = captureMetaBridge();

    track('ViewContent', {
      content_name: 'Pre LP Desafio do Hexa',
      content_category: 'challenge_game',
      source: 'lp',
      ...bridge
    }, true);

    track('PreLP_Loaded', {
      page: 'desafio_do_hexa_pre_lp_safe',
      source: 'lp',
      ...bridge
    });
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
          const bridge = captureMetaBridge();

          track('Lead', {
            content_name: 'Acesso Promocional Liberado',
            content_category: 'challenge_game',
            source: 'lp',
            ...bridge
          }, true);

          track('PreLP_AccessUnlocked', {
            step: 'acesso_promocional_liberado',
            source: 'lp',
            ...bridge
          });
          return value;
        }
        return value + 1;
      });
    }, 1350);
    return () => window.clearInterval(interval);
  }, []);

  function goToCadastro() {
    const destination = buildCadastroUrl();
    const bridge = captureMetaBridge();

    track('InitiateCheckout', {
      content_name: 'Clique CTA Pre LP',
      content_category: 'challenge_game',
      source: 'lp',
      destination,
      spots_left: spotsLeft,
      stage: currentStage.label,
      ...bridge
    }, true);

    track('CompleteRegistration', {
      content_name: 'Acesso LP para Cadastro Oficial',
      content_category: 'challenge_game',
      source: 'lp',
      destination,
      ...bridge
    }, true);

    track('PreLP_ClickCadastro', {
      destination,
      spots_left: spotsLeft,
      stage: currentStage.label,
      source: 'lp',
      ...bridge
    });

    window.location.href = destination;
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
