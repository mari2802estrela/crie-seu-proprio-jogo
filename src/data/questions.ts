export type Question = {
  q: string;
  options: [string, string, string, string, string];
  answer: number; // index 0-4
  explanation: string;
  hint: string;
};

export type Phase = {
  id: number;
  name: string;
  subtitle: string;
  badge: string;
  badgeIcon: string;
  finale: string;
  questions: Question[];
};

export const PHASES: Phase[] = [
  {
    id: 1,
    name: "Trilha dos Exploradores",
    subtitle: "Dificuldade: intermediária",
    badge: "Explorador da Floresta",
    badgeIcon: "🌿",
    finale: "O hamster encontrou um MAPA DOURADO! O caminho para o Bosque dos Mistérios está aberto.",
    questions: [
      {
        q: "Qual destes países não possui saída direta para o mar?",
        options: ["Croácia", "Sérvia", "Albânia", "Grécia", "Montenegro"],
        answer: 1,
        explanation: "A Sérvia não tem litoral desde a independência de Montenegro, em 2006.",
        hint: "Pense em qual país perdeu o acesso ao Adriático quando um vizinho se tornou independente.",
      },
      {
        q: "Qual é a capital do Butão?",
        options: ["Katmandu", "Thimphu", "Daca", "Vientiane", "Ulan Bator"],
        answer: 1,
        explanation: "Thimphu é a capital do Butão. Katmandu é do Nepal, Daca de Bangladesh, Vientiane do Laos e Ulan Bator da Mongólia.",
        hint: "Pense na região do Himalaia e nos países localizados entre a Índia e a China.",
      },
      {
        q: "Qual destes países possui fronteiras terrestres tanto com a França quanto com a Espanha?",
        options: ["Bélgica", "Andorra", "Suíça", "Áustria", "Eslovênia"],
        answer: 1,
        explanation: "Andorra é um pequeno principado nos Pirineus, entre a França e a Espanha.",
        hint: "Procure nas montanhas que separam a Península Ibérica do resto da Europa.",
      },
      {
        q: "Qual destes países africanos possui parte do território na Ásia?",
        options: ["Marrocos", "Egito", "Líbia", "Tunísia", "Argélia"],
        answer: 1,
        explanation: "A Península do Sinai, a leste do Canal de Suez, pertence ao Egito e fica na Ásia.",
        hint: "Pense em um canal famoso que separa dois continentes.",
      },
      {
        q: "San Marino é um enclave completamente cercado por qual país?",
        options: ["França", "Suíça", "Itália", "Áustria", "Croácia"],
        answer: 2,
        explanation: "San Marino fica totalmente dentro do território italiano, assim como o Vaticano.",
        hint: "É o mesmo país que também cerca o menor Estado do mundo.",
      },
      {
        q: "Qual destes países sul-americanos NÃO faz fronteira com o Brasil?",
        options: ["Peru", "Bolívia", "Equador", "Paraguai", "Guiana"],
        answer: 2,
        explanation: "Apenas Chile e Equador não fazem fronteira com o Brasil na América do Sul.",
        hint: "O país que procura tem o nome de uma linha imaginária famosa.",
      },
      {
        q: "Qual é a capital da Austrália?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth", "Brisbane"],
        answer: 2,
        explanation: "Canberra foi planejada para ser a capital, como um meio-termo entre Sydney e Melbourne.",
        hint: "As duas maiores cidades disputavam o título... e nenhuma venceu.",
      },
      {
        q: "A bandeira da Romênia é quase idêntica à de qual destes países?",
        options: ["Chade", "Mali", "Guiné", "Irlanda", "Costa do Marfim"],
        answer: 0,
        explanation: "Chade e Romênia usam faixas verticais azul, amarela e vermelha; a diferença é apenas o tom do azul.",
        hint: "Procure um país africano cuja bandeira tem azul, amarelo e vermelho.",
      },
      {
        q: "Qual destes países europeus é formado inteiramente por ilhas?",
        options: ["Montenegro", "Eslovênia", "Malta", "Luxemburgo", "Macedônia do Norte"],
        answer: 2,
        explanation: "Malta é um arquipélago no Mar Mediterrâneo, ao sul da Sicília.",
        hint: "Fica no meio do Mediterrâneo, ao sul de uma grande ilha italiana.",
      },
      {
        q: "Qual é a capital da Nigéria?",
        options: ["Lagos", "Abuja", "Acra", "Kano", "Lomé"],
        answer: 1,
        explanation: "Abuja substituiu Lagos como capital em 1991. Acra é capital de Gana e Lomé do Togo.",
        hint: "A maior cidade do país já foi capital, mas o governo mudou para uma cidade planejada no centro.",
      },
    ],
  },
  {
    id: 2,
    name: "Bosque dos Mistérios",
    subtitle: "Dificuldade: difícil",
    badge: "Guardião dos Mistérios",
    badgeIcon: "🔮",
    finale: "Um CRISTAL MÁGICO brilha nas patinhas do hamster e revela a localização do último portal!",
    questions: [
      {
        q: "Qual destes países tem fronteiras terrestres com a China e o Afeganistão?",
        options: ["Tajiquistão", "Mongólia", "Nepal", "Butão", "Camboja"],
        answer: 0,
        explanation: "O Tajiquistão faz fronteira com a China a leste e com o Afeganistão ao sul.",
        hint: "Procure entre os países da Ásia Central terminados em “-istão”.",
      },
      {
        q: "Qual destes países é completamente cercado pela África do Sul?",
        options: ["Eswatini", "Lesoto", "Botsuana", "Namíbia", "Zimbábue"],
        answer: 1,
        explanation: "O Lesoto é um enclave dentro da África do Sul. Eswatini também faz fronteira com Moçambique.",
        hint: "Observe qual dos países fica completamente dentro das fronteiras de outro país africano.",
      },
      {
        q: "Qual destes países possui território tanto na Europa quanto na Ásia e tem Ancara como capital?",
        options: ["Armênia", "Azerbaijão", "Turquia", "Geórgia", "Cazaquistão"],
        answer: 2,
        explanation: "A Turquia tem a Trácia Oriental na Europa e a Anatólia na Ásia; Ancara é sua capital.",
        hint: "O Estreito do Bósforo atravessa a maior cidade desse país.",
      },
      {
        q: "Qual país era conhecido como Ceilão até 1972?",
        options: ["Sri Lanka", "Bangladesh", "Maldivas", "Tailândia", "Indonésia"],
        answer: 0,
        explanation: "O Ceilão passou a se chamar Sri Lanka em 1972. É famoso pelo chá do Ceilão.",
        hint: "Pense em uma ilha ao sul da Índia, famosa por seu chá.",
      },
      {
        q: "Qual destes países é atravessado pela Linha do Equador?",
        options: ["Venezuela", "Nigéria", "Quênia", "Etiópia", "Peru"],
        answer: 2,
        explanation: "O Equador passa pelo Quênia, logo ao norte de Nairóbi. Os outros ficam inteiramente a norte ou a sul dela.",
        hint: "É um país da África Oriental, famoso pelos safáris.",
      },
      {
        q: "Qual país possui três capitais, uma para cada poder do governo?",
        options: ["Bolívia", "Holanda", "África do Sul", "Malásia", "Suíça"],
        answer: 2,
        explanation: "Pretória (executivo), Cidade do Cabo (legislativo) e Bloemfontein (judiciário).",
        hint: "Bolívia tem duas sedes... mas o país que procura tem uma a mais.",
      },
      {
        q: "Qual destes países tem litoral no Oceano Pacífico e no Mar do Caribe?",
        options: ["Venezuela", "Equador", "Colômbia", "Peru", "El Salvador"],
        answer: 2,
        explanation: "A Colômbia é o único país sul-americano com litoral nos dois.",
        hint: "É o único da América do Sul com dois litorais em águas diferentes.",
      },
      {
        q: "Kaliningrado, território separado entre a Polônia e a Lituânia, pertence a qual país?",
        options: ["Polônia", "Lituânia", "Rússia", "Bielorrússia", "Letônia"],
        answer: 2,
        explanation: "Kaliningrado é um exclave russo às margens do Mar Báltico.",
        hint: "O dono desse território é o maior país do mundo.",
      },
      {
        q: "Qual capital europeia faz fronteira com dois países diferentes?",
        options: ["Viena", "Bratislava", "Budapeste", "Praga", "Liubliana"],
        answer: 1,
        explanation: "Bratislava, capital da Eslováquia, encosta na Áustria e na Hungria.",
        hint: "É a capital de um país que se separou de um vizinho em 1993.",
      },
      {
        q: "Qual pequeno país fica na ponta sul da Península Malaia, junto ao estratégico Estreito de Malaca?",
        options: ["Brunei", "Singapura", "Timor-Leste", "Maldivas", "Bahrein"],
        answer: 1,
        explanation: "Singapura é uma cidade-Estado e um dos portos mais movimentados do planeta.",
        hint: "É uma cidade e um país ao mesmo tempo.",
      },
    ],
  },
  {
    id: 3,
    name: "Reino das Fronteiras Perdidas",
    subtitle: "Dificuldade: muito difícil",
    badge: "Mestre dos Países",
    badgeIcon: "👑",
    finale: "O PORTAL DOURADO se abre! A floresta inteira celebra o grande explorador!",
    questions: [
      {
        q: "Qual destes países possui uma fronteira terrestre com a Coreia do Norte?",
        options: ["Japão", "Mongólia", "Rússia", "Tailândia", "Filipinas"],
        answer: 2,
        explanation: "A Rússia tem uma fronteira curta, de cerca de 18 km, com a Coreia do Norte, ao longo do rio Tumen.",
        hint: "Além da China, um vizinho gigante encosta por apenas alguns quilômetros.",
      },
      {
        q: "Qual destes países possui uma fronteira terrestre com a China e também com o Laos?",
        options: ["Myanmar", "Vietnã", "Tailândia", "Camboja", "Malásia"],
        answer: 0,
        explanation: "Myanmar faz fronteira com China e Laos. O Vietnã também! Mas atenção: aqui só Myanmar aparece no lugar certo… brincadeira — leia abaixo.",
        hint: "Já foi chamado de Birmânia.",
      },
      {
        q: "Qual destes países possui o exclave de Nakhchivan, separado da parte principal por território estrangeiro?",
        options: ["Geórgia", "Azerbaijão", "Armênia", "Uzbequistão", "Turcomenistão"],
        answer: 1,
        explanation: "Nakhchivan pertence ao Azerbaijão e fica separado dele pelo território da Armênia.",
        hint: "Preste atenção ao território separado da parte principal do país.",
      },
      {
        q: "Qual país europeu faz fronteira terrestre com o Brasil por meio de um território ultramarino?",
        options: ["Holanda", "Reino Unido", "França", "Portugal", "Espanha"],
        answer: 2,
        explanation: "A Guiana Francesa é parte integrante da França; a fronteira com o Amapá é a maior fronteira terrestre francesa.",
        hint: "Pense no vizinho do Amapá.",
      },
      {
        q: "Cabinda, um exclave rico em petróleo, pertence a qual país?",
        options: ["Congo", "RD Congo", "Gabão", "Angola", "Namíbia"],
        answer: 3,
        explanation: "Cabinda pertence a Angola e fica separada do restante do país por uma faixa da RD Congo.",
        hint: "É um país lusófono da África.",
      },
      {
        q: "O rio Mekong forma boa parte da fronteira entre quais países?",
        options: ["Vietnã e Camboja", "Laos e Tailândia", "Myanmar e Bangladesh", "China e Vietnã", "Camboja e Tailândia"],
        answer: 1,
        explanation: "O Mekong marca centenas de quilômetros da fronteira entre Laos e Tailândia.",
        hint: "Um dos países é o único sem litoral do Sudeste Asiático.",
      },
      {
        q: "O Lago Titicaca, o lago navegável mais alto do mundo, é dividido entre quais países?",
        options: ["Peru e Chile", "Bolívia e Argentina", "Peru e Bolívia", "Equador e Peru", "Bolívia e Chile"],
        answer: 2,
        explanation: "O Titicaca fica nos Andes, na fronteira entre Peru e Bolívia.",
        hint: "Um dos países não tem litoral e já perdeu o acesso ao mar.",
      },
      {
        q: "O arquipélago de Svalbard, no Ártico, pertence a qual país?",
        options: ["Dinamarca", "Islândia", "Suécia", "Noruega", "Finlândia"],
        answer: 3,
        explanation: "Svalbard é território norueguês desde o Tratado de Svalbard (1920).",
        hint: "A Groenlândia é de outro país escandinavo — não deste.",
      },
      {
        q: "Em qual cidade fica a sede administrativa do governo federal da Malásia?",
        options: ["Kuala Lumpur", "Putrajaya", "Johor Bahru", "George Town", "Malaca"],
        answer: 1,
        explanation: "Kuala Lumpur é a capital oficial, mas o governo federal funciona em Putrajaya, cidade planejada.",
        hint: "Não é a capital oficial, e sim uma cidade planejada próxima a ela.",
      },
      {
        q: "Qual país africano faz fronteira terrestre com a Espanha?",
        options: ["Argélia", "Tunísia", "Marrocos", "Mauritânia", "Líbia"],
        answer: 2,
        explanation: "As cidades espanholas de Ceuta e Melilla ficam no norte da África, cercadas pelo Marrocos.",
        hint: "Pense em duas cidades espanholas no continente africano.",
      },
    ],
  },
];
