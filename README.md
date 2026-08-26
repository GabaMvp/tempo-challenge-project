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

Issue 1: Hero Section não exibe conteúdo do slot

Resposta ao Cliente:

Olá,

Investiguei a implementação da seção Hero e identifiquei a causa do problema.

O que está acontecendo:

O componente CroctProvider, no arquivo layout.tsx, está sem a propriedade appId. Essa informação é necessária para identificar a aplicação e permitir que a integração se comunique corretamente com o workspace da Croct.

Sem o appId configurado, a aplicação não consegue acessar corretamente os recursos esperados, resultando no erro resource not found no console.

Causa raiz:

O CroctProvider foi configurado sem o appId.

Como resolver:

Adicione o appId ao CroctProvider no arquivo layout.tsx:

<CroctProvider appId={SEU__AppID}>
  {children}
</CroctProvider>

O valor do appId pode ser obtido no painel da Croct, na configuração da aplicação.

Após essa alteração, a integração irá identificar corretamente a aplicação e o conteúdo configurado para o Hero poderá ser carregado.

# Issue 2: Features — Cards, tagline e description atualizam, mas o título não.
Resposta ao Cliente:

Olá,

Analisei o componente FeaturesSection e identifiquei que o código está solicitando explicitamente a versão @2 do slot:

const { content } = await fetchContent('features-section@2');

Isso significa que a aplicação continuará consumindo essa versão específica, mesmo quando uma versão mais recente for publicada no painel da Croct.

Por isso, alterações realizadas nas versões posteriores não serão necessariamente refletidas pela aplicação.

Como resolver:

Se a intenção é sempre utilizar a versão mais recente publicada, altere a referência para:

const { content } = await fetchContent('features-section@latest');

Dessa forma, a aplicação passa a consumir a versão mais recente do slot sem precisar alterar o código a cada nova publicação.

Caso seja necessário manter uma versão específica por questões de compatibilidade ou controle de release, o uso de uma versão fixa também pode ser apropriado.

# Issue 3: How It Works mostra conteúdo em Português
Olá,

Encontrei a causa do problema na seção How It Works.

O que está acontecendo:

No componente HowItWorks, a propriedade preferredLocale está definida manualmente como pt-br:

const { content } = useContent('how-it-works-section', {
  initial: {
    // ...
  },
  preferredLocale: 'pt-br'
});

Isso faz com que a aplicação solicite preferencialmente o conteúdo em português, independentemente da preferência de idioma do visitante.

Como resolver:

Remova o preferredLocale fixo:

const { content } = useContent('how-it-works-section', {
  initial: {
    // ...
  }
});

Assim, a aplicação poderá utilizar o mecanismo de localização da Croct para determinar o conteúdo adequado ao visitante.

Além disso, verifiquei que o workspace possui apenas o locale pt-br habilitado. Para disponibilizar uma versão em inglês, é necessário habilitar o locale correspondente e configurar o conteúdo traduzido no painel da Croct.

Dessa forma, visitantes que utilizam inglês poderão receber a versão em inglês, enquanto os demais poderão receber o conteúdo correspondente às configurações de localização disponíveis.


# Parte 2: PErguntas


# Pergunta 1: "Nosso conteúdo personalizado às vezes aparece um segundo depois do resto da página... No primeiro carregamento os visitantes veem a versão genérica. Isso é esperado ou é um bug?"


Olá, Tudo bem?

Esse comportamento pode ser esperado quando o conteúdo personalizado é carregado no lado do cliente, mas não é necessariamente o comportamento ideal para a experiência do usuário.

Nesse cenário, a página é exibida inicialmente com o conteúdo padrão e, depois que a aplicação é executada no navegador e obtém a resposta da Croct, o conteúdo personalizado substitui o fallback. Isso pode causar o chamado Flash of Default Content (FoDC).

Isso não significa necessariamente que exista um bug na integração, mas pode resultar em uma experiência visual indesejada.

O que fazer:

Uma possível abordagem para evitar esse comportamento é buscar o conteúdo durante a renderização no servidor, quando a arquitetura da aplicação permitir. Isso permite que o conteúdo personalizado já esteja presente na resposta inicial da página, reduzindo ou eliminando essa troca visual após o carregamento.

Também vale avaliar a estratégia de fallback e o tempo de resposta da requisição para identificar se existe alguma oportunidade adicional de otimização.

# Pergunta 4: "Estamos rodando um teste há dois dias, e o dashboard já mostra 90% de chance de que a variante B está ganhando, mas ainda é um número bem pequeno de pessoas. Podemos confiar nesse número ou é muito cedo?"


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

# Pergunta 5: "Só traduzimos o banner da campanha para inglês e espanhol, mas agora um visitante do Canadá navegando em francês está vendo a versão em inglês. Não deveria estar em francês?"

Olá,

Sim, esse comportamento pode ser esperado caso não exista uma versão em francês disponível e o francês esteja configurado para utilizar outro locale como fallback.

O que está acontecendo:

O visitante está navegando em francês, mas o banner possui traduções apenas em inglês e espanhol. Como não existe conteúdo correspondente ao locale francês, a plataforma precisa utilizar uma alternativa disponível de acordo com a configuração de localização e fallback.

Nesse caso, o visitante pode receber a versão em inglês se esse for o locale configurado como fallback.

O que fazer a seguir:

Se a intenção é oferecer uma experiência totalmente localizada para visitantes que falam francês, recomendo:

Habilitar o locale francês no workspace; Adicionar a tradução francesa do banner; Verificar as regras de fallback configuradas para os demais idiomas.

Se não houver uma versão francesa disponível, utilizar o inglês como fallback também pode ser uma estratégia válida, desde que isso esteja de acordo com o objetivo da experiência.
Se quiser, posso te ajudar a configurar as traduções no painel da Croct.
