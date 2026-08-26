<p align="center">
    <a href="https://croct.com">
      <img src="https://cdn.croct.io/brand/logo/repo-icon-green.svg" alt="Croct" height="80"/>
    </a>
    <br />
    <strong>Croct App</strong>
    <br />
</p>
<p align="center">
    <img alt="Language" src="https://img.shields.io/badge/language-TypeScript-blue" />
    <img alt="Build" src="https://img.shields.io/badge/build-passing-green" />
    <img alt="Coverage" src="https://img.shields.io/badge/coverage-100%25-green" />
    <img alt="Maintainability" src="https://img.shields.io/badge/maintainability-100-green" />
</p>

# Tempo Challenge Project

This project is a web application created as part of the Customer Success Engineer technical challenge.

It contains a website with a Croct integration that you will investigate as part of the challenge. The goal is to run the application locally and use it to reproduce and troubleshoot the scenarios described in the main challenge instructions.

For the challenge description, scenarios, and questions, please refer to the [README](https://github.com/croct-tech/challenges/tree/main/customer-success-engineer) in the parent directory.

## Getting started

Follow the steps below to run the project locally.

### 1. Clone and install

```bash
git clone <repository-url>
cd tempo-challenge-project
npm install
```

### 2. Run

Start Next.js server:

```bash
npm run dev
```
Once the server is running, open http://localhost:3000 in your browser.

## Further Information

If you have any questions about the challenge, the scenarios, or what is expected in your answers, please refer to the main challenge [README](https://github.com/croct-tech/challenges/tree/main/customer-success-engineer).


markdown
---

# Challenge Responses — Customer Success Engineer

## Part 1: Debugging

### Issue 1: Hero Section não exibe conteúdo do slot

**Resposta ao Cliente:**

Olá,

Investiguei a implementação da seção Hero e identifiquei a causa do problema.

**O que está acontecendo:**

O componente `CroctProvider` no arquivo `layout.tsx` está sem a propriedade `appId`. Essa é a informação que autentica suas requisições e conecta sua aplicação ao seu workspace na Croct. Sem ela, a plataforma não consegue localizar seus slots e retorna o erro "resource not found" no console.

**Causa raiz:**


// Código com problema
<CroctProvider>
  {children}
</CroctProvider>
Como resolver:

Adicione o appId ao CroctProvider no seu layout:

// Código corrigido
<CroctProvider appId="SEU_APP_ID_AQUI">
  {children}
</CroctProvider>
Você encontra seu appId no painel da Croct em Settings → Applications.

Após essa alteração, a seção Hero passará a exibir o conteúdo configurado no slot.

# Issue 2: Features — Cards, tagline e description atualizam, mas o título não.
Resposta ao Cliente:

Olá,

Analisei o componente FeaturesSection e identifiquei a causa do problema.

O que está acontecendo:

Você está usando fetchContent('features-section@2'), que busca especificamente a versão 2 do slot. Quando você publica atualizações no painel da Croct, a versão do slot é incrementada automaticamente (vira @3, @4, etc.). Seu código continua "preso" na versão 2, mostrando conteúdo desatualizado para o título.

Por que cards e descrição funcionam?
Provavelmente porque a estrutura do JSON não mudou significativamente entre as versões para esses campos, mas o campo title foi alterado na versão mais recente.

Como resolver:

Use a versão mais recente automaticamente, trocando @2 por @latest:


// De:
const {content} = await fetchContent('features-section@2');

// Para:
const {content} = await fetchContent('features-section@latest');
Isso garante que você sempre receba a versão mais recente publicada no painel, sem precisar alterar o código a cada atualização.

# Issue 3: How It Works mostra conteúdo em Português
Resposta ao Cliente:

Olá,

Encontrei a causa do problema na seção How It Works.

O que está acontecendo:

No componente HowItWorks, você está definindo manualmente a preferência de idioma com preferredLocale: "pt-br". Isso instrui a Croct a sempre entregar o conteúdo em português, ignorando o idioma real do visitante.

Causa raiz:

// Código com problema
const {content} = useContent('how-it-works-section', {
  initial: { ... },
  preferredLocale: "pt-br"  // ← Forçando idioma
});
Como resolver:

Remova a propriedade preferredLocale para que a Croct detecte automaticamente o idioma do visitante:

// Código corrigido
const {content} = useContent('how-it-works-section', {
  initial: { ... }
});
O que acontece depois:

A Croct usará o cabeçalho Accept-Language do navegador e a localização do visitante para servir o idioma correto. Visitantes dos EUA verão inglês, do Brasil verão português, etc.

Nota adicional: Verifiquei também a configuração do workspace e notei que apenas o locale pt-br estava habilitado. Para servir conteúdo em inglês, é necessário habilitar o locale en no painel da Croct (Settings → Localization) e configurar o conteúdo do slot em inglês.


# Parte 2: PErguntas


Pergunta 1: "Nosso conteúdo personalizado às vezes aparece um segundo depois do resto da página... No primeiro carregamento os visitantes veem a versão genérica. Isso é esperado ou é um bug?"
Resposta ao Cliente:

Olá,

Excelente pergunta! Isso é esperado, mas não é o ideal. O que você está vendo é o comportamento padrão de renderização no "Client-Side" (lado do cliente) e é conhecido como "Flash of Default Content" (FoDC).

Por que isso acontece?
Quando o HTML da sua página é montado no navegador, o código da aplicação precisa ser baixado, executado e fazer uma chamada de rede para os servidores da Croct para buscar a variante personalizada do usuário. Durante esses milissegundos/segundos de processamento, o código mostra o conteúdo "fallback" (a versão genérica) para evitar que a tela fique em branco. Assim que a Croct responde, ele troca o conteúdo.

É um bug?
Não, é uma proteção contra quebras de layout e tempos de carregamento infinitos. Mas, para os seus visitantes, ver essa "piscada" de conteúdo pode parecer falta de profissionalismo.

O que fazer a seguir:
Para resolver isso, você pode implementar Renderização no Servidor (SSR). Isso faz com que o conteúdo personalizado seja buscado antes da página chegar ao navegador, eliminando a 'piscada' e melhorando o SEO. Posso te ajudar a verificar a melhor abordagem para o seu caso.

Pergunta 4: "Estamos rodando um teste há dois dias, e o dashboard já mostra 90% de chance de que a variante B está ganhando, mas ainda é um número bem pequeno de pessoas. Podemos confiar nesse número ou é muito cedo?"
Resposta ao Cliente:

Olá,

Boa pergunta! A resposta curta é: é muito cedo para confiar nesse número.

O que está acontecendo:

O resultado de 90% de confiança com poucos visitantes é como jogar uma moeda para cima 10 vezes e obter 7 caras, é apenas variação natural. Com poucas amostras, os resultados podem mudar drasticamente de um dia para o outro.

Por que isso acontece?

Quando você roda um teste A/B, a plataforma calcula a probabilidade de uma variante ser melhor que a outra com base nos dados coletados. Mas esses cálculos precisam de volume suficiente para serem confiáveis.

Volume suficiente de visitantes — Para ter significância estatística

Tempo suficiente de teste — Para capturar variações de comportamento (dias de semana vs. fim de semana)

Conversões suficientes — Para ter dados confiáveis

O que fazer a seguir:

Recomendo:

Deixe o teste rodar mais tempo — Idealmente pelo menos 1-2 semanas

Não tome decisões precipitadas — Aguarde o volume de visitantes aumentar

Verifique se o teste tem tráfego suficiente — Se o número de visitantes for muito baixo, o teste pode precisar de mais tempo

Se quiser, posso te ajudar a analisar o volume de tráfego e estimar quanto tempo o teste precisa para ter resultados confiáveis.

Pergunta 5: "Só traduzimos o banner da campanha para inglês e espanhol, mas agora um visitante do Canadá navegando em francês está vendo a versão em inglês. Não deveria estar em francês?"
Resposta ao Cliente:

Olá,

Boa observação! O comportamento está correto, mas vou explicar o porquê.

O que está acontecendo:

Você traduziu o banner apenas para inglês e espanhol. Não há versão em francês disponível. Quando um visitante do Canadá navega em francês, a Croct procura uma versão em francês do banner. Como não encontra, ela precisa escolher uma alternativa.

Por que mostra em inglês?

A Croct usa uma lógica de "fallback" (plano B):

Primeiro: Tenta encontrar o conteúdo no idioma do visitante (francês)

Segundo: Se não encontrar, tenta o idioma padrão do workspace (provavelmente inglês)

Terceiro: Se não houver nenhum, usa o que estiver disponível

Como você só tem inglês e espanhol, e o inglês é provavelmente o idioma padrão do workspace, o visitante canadense vê a versão em inglês.

O que fazer a seguir se você quer atender visitantes que falam francês:

Adicione a tradução em francês no painel da Croct

Ou configure uma regra de fallback diferente (ex: mostrar espanhol para visitantes do Canadá)

Dica: Se você não tem recursos para traduzir para francês agora, pode manter o inglês como fallback. É uma escolha razoável, já que o inglês é amplamente compreendido no Canadá.

Se quiser, posso te ajudar a configurar as traduções no painel da Croct.
