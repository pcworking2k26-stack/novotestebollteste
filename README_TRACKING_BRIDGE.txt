LP TRACKING BRIDGE — DESAFIO DO HEXA

Correções aplicadas:
- Pixel ID atualizado para 1864065377567105.
- CTA final monta URL com parâmetros antes do hash:
  https://desafiodohexa.com.br/?src=lp&fbclid=...&fbp=...&fbc=...
- Captura fbclid da URL.
- Captura _fbp do cookie quando existir.
- Gera/preserva _fbc quando existir fbclid.
- Salva fbclid/fbp/fbc no localStorage.
- Mantém Pixel e eventos existentes.
- Adiciona ViewContent ao carregar.
- Adiciona Lead quando acesso é liberado.
- Adiciona InitiateCheckout e CompleteRegistration no clique do CTA.
- Usa event_id consistente por sessão.

Sem alterações de design/copy além do essencial de tracking.


AJUSTE FINAL:
- CTA agora envia para a URL principal:
  https://desafiodohexa.com.br/
- Mantém src=lp, fbclid, fbp e fbc na query string.
- Não usa mais #cadastro, pois a home principal possui demo do jogo e cadastro próprio.
