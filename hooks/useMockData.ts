import type { Project, UserPortfolio, DAOProposal, PlatformStats, UserTransaction, Achievement, CommunityGoal } from '../types';
import { ICONS } from '../constants';

export const useMockData = () => {
    const projects: Project[] = [
        {
            id: 'solar-aurora',
            name: 'Solar Batel Home',
            location: 'Batel, Curitiba',
            image: 'https://media.123i.com.br/rest/image/outer/350/350/konecty/photo/catalog/979acc02c62e44ef70ac6e6c39265730/images/7640959a6a9d38ff9085a577804f734b.jpg',
            apy: 12.5,
            fundingGoal: 150000,
            fundingRaised: 112500,
            term: '10 anos',
            type: 'Solar',
            description: 'Instalação de painéis solares no telhado do Batel Home para abastecer áreas comuns e vender o excedente.',
            investors: 42,
            kwhGeneratedPerYear: 50000,
            co2AvoidedPerYear: 25,
            documents: [
                { name: 'Prospecto Completo', url: '#', size: '2.5 MB' },
                { name: 'Especificações Técnicas', url: '#', size: '1.8 MB' },
                { name: 'Detalhes Legais e Contrato', url: '#', size: '850 KB' },
            ],
            updates: [
                { id: 'upd-sa-1', date: '2024-04-10', title: 'Início da Instalação dos Painéis', description: 'A equipe começou a instalação dos 150 painéis solares no telhado do Batel Home.', imageUrl: 'https://picsum.photos/seed/update-aurora-1/400/200' },
                { id: 'upd-sa-2', date: '2024-05-22', title: 'Sistema Conectado à Rede', description: 'Após a conclusão da instalação e testes, o sistema foi oficialmente conectado à rede elétrica da Copel.', imageUrl: 'https://picsum.photos/seed/update-aurora-2/400/200' },
                { id: 'upd-sa-3', date: '2024-06-30', title: 'Primeiro Relatório de Geração', description: 'O primeiro mês completo de operação gerou 4.500 kWh, superando a meta inicial em 8%. Os primeiros rendimentos foram calculados.' },
            ],
        },
        {
            id: 'eolica-barigui',
            name: 'Micro-eólica Parque Barigui',
            location: 'Parque Barigui, Curitiba',
            image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/4c/56/ef/parque-baragui-view-oi.jpg?w=900&h=500&s=1',
            apy: 9.8,
            fundingGoal: 300000,
            fundingRaised: 290000,
            term: '15 anos',
            type: 'Eólica',
            description: 'Pequenas turbinas eólicas de baixo impacto para iluminação e pontos de recarga no parque.',
            investors: 89,
            kwhGeneratedPerYear: 90000,
            co2AvoidedPerYear: 45,
            documents: [
                { name: 'Estudo de Viabilidade', url: '#', size: '3.1 MB' },
                { name: 'Licença Ambiental', url: '#', size: '1.2 MB' },
            ],
            updates: [
                { id: 'upd-eb-1', date: '2024-03-15', title: 'Fundações Concluídas', description: 'As bases de concreto para as micro-turbinas foram concluídas, garantindo a estabilidade para a instalação.', imageUrl: 'https://picsum.photos/seed/update-barigui-1/400/200' },
                { id: 'upd-eb-2', date: '2024-04-25', title: 'Turbinas Instaladas', description: 'As 5 micro-turbinas foram instaladas com sucesso e estão prontas para a fase de testes e comissionamento.' },
            ],
        },
        {
            id: 'solar-cic',
            name: 'Fazenda Solar CIC',
            location: 'Cidade Industrial, Curitiba',
            image: 'https://i0.wp.com/jornalcomunicacao.ufpr.br/wp-content/uploads/2023/09/jornalcomunicacao.ufpr.br-strongo-bairro-de-quase-200-mil-habitantesstrong-image-large.jpeg?ssl=1',
            apy: 15.0,
            fundingGoal: 500000,
            fundingRaised: 120000,
            term: '12 anos',
            type: 'Solar',
            description: 'Projeto de maior escala em área industrial para fornecer energia limpa para empresas locais.',
            investors: 15,
            kwhGeneratedPerYear: 200000,
            co2AvoidedPerYear: 100,
            documents: [
                { name: 'Prospecto de Investimento', url: '#', size: '4.5 MB' },
                { name: 'Plano de Negócios', url: '#', size: '2.0 MB' },
                { name: 'Contrato de Parceria', url: '#', size: '950 KB' },
            ],
            updates: [],
        },
        {
            id: 'solar-ecoville',
            name: 'Solar Palazzo Lumini',
            location: 'Ecoville, Curitiba',
            image: 'https://construtorasanremo.com.br/assets/img/palazzo-parallax-01-f1198f04.jpg',
            apy: 11.8,
            fundingGoal: 200000,
            fundingRaised: 75000,
            term: '10 anos',
            type: 'Solar',
            description: 'Instalação de painéis solares na cobertura e estacionamentos do luxuoso condomínio Palazzo Lumini, visando a autossuficiência energética das áreas comuns e gerando economia para os moradores.',
            investors: 35,
            kwhGeneratedPerYear: 70000,
            co2AvoidedPerYear: 35,
            documents: [
                { name: 'Apresentação do Projeto', url: '#', size: '2.8 MB' },
            ],
            updates: [],
        },
        {
            id: 'eolica-tatuquara',
            name: 'Vento Limpo Tatuquara',
            location: 'Tatuquara, Curitiba',
            image: 'https://mid-noticias.curitiba.pr.gov.br/2021/00333282.jpg',
            apy: 10.5,
            fundingGoal: 250000,
            fundingRaised: 250000,
            term: '12 anos',
            type: 'Eólica',
            description: 'Instalação de turbinas eólicas de pequeno porte em uma área aberta para alimentar a iluminação pública local.',
            investors: 112,
            kwhGeneratedPerYear: 85000,
            co2AvoidedPerYear: 42,
            documents: [
                { name: 'Prospecto Completo', url: '#', size: '3.0 MB' },
                { name: 'Análise de Vento', url: '#', size: '1.5 MB' },
            ],
            updates: [
                 { id: 'upd-vt-1', date: '2024-06-01', title: 'Projeto Totalmente Financiado', description: 'A meta de financiamento foi atingida com sucesso graças à nossa incrível comunidade de investidores! O planejamento para a construção começará imediatamente.' },
            ],
        },
        {
            id: 'solar-mercado-municipal',
            name: 'Energia do Mercado Municipal',
            location: 'Centro, Curitiba',
            image: 'https://www.mercadomunicipaldecuritiba.com.br/wp-content/uploads/2024/05/mercado_municipal_de_curitiba.jpg',
            apy: 13.2,
            fundingGoal: 180000,
            fundingRaised: 180000,
            term: '8 anos',
            type: 'Solar',
            description: 'Modernização do telhado do Mercado Municipal com painéis solares para reduzir a pegada de carbono do icônico local.',
            investors: 95,
            kwhGeneratedPerYear: 60000,
            co2AvoidedPerYear: 30,
            documents: [
                { name: 'Prospecto de Investimento', url: '#', size: '2.2 MB' },
                { name: 'Aprovação da Prefeitura', url: '#', size: '780 KB' },
            ],
            updates: [
                 { id: 'upd-smm-1', date: '2024-06-15', title: 'Aprovações Finais da Prefeitura', description: 'Todas as licenças e aprovações necessárias da prefeitura foram concedidas. A instalação está programada para começar no próximo mês.' },
                 { id: 'upd-smm-2', date: '2024-07-20', title: 'Materiais Recebidos no Local', description: 'Os painéis solares, inversores e estruturas de montagem foram entregues no Mercado Municipal.', imageUrl: 'https://picsum.photos/seed/update-mercado-1/400/200' },
            ],
        },
    ];

    const transactions: UserTransaction[] = [
        { id: 'txn-001', date: '2024-07-20', project: 'Solar Batel Home', type: 'Rendimento', amount: 25.50, tokens: 0, status: 'Concluído' },
        { id: 'txn-002', date: '2024-07-15', project: 'Micro-eólica Parque Barigui', type: 'Rendimento', amount: 18.75, tokens: 0, status: 'Concluído' },
        { id: 'txn-003', date: '2024-06-20', project: 'Solar Batel Home', type: 'Rendimento', amount: 25.00, tokens: 0, status: 'Concluído' },
        { id: 'txn-004', date: '2024-06-15', project: 'Micro-eólica Parque Barigui', type: 'Rendimento', amount: 18.50, tokens: 0, status: 'Concluído' },
        { id: 'txn-005', date: '2024-05-28', project: 'Energia do Mercado Municipal', type: 'Investimento', amount: 1500, tokens: 1500, status: 'Concluído' },
        { id: 'txn-006', date: '2024-05-20', project: 'Solar Batel Home', type: 'Rendimento', amount: 24.50, tokens: 0, status: 'Concluído' },
        { id: 'txn-007', date: '2024-05-15', project: 'Micro-eólica Parque Barigui', type: 'Rendimento', amount: 18.00, tokens: 0, status: 'Concluído' },
        { id: 'txn-008', date: '2024-04-20', project: 'Solar Batel Home', type: 'Rendimento', amount: 22.00, tokens: 0, status: 'Concluído' },
        { id: 'txn-009', date: '2024-04-15', project: 'Micro-eólica Parque Barigui', type: 'Rendimento', amount: 15.00, tokens: 0, status: 'Concluído' },
        { id: 'txn-010', date: '2024-03-05', project: 'Solar Batel Home', type: 'Investimento', amount: 7500, tokens: 750, status: 'Concluído' },
        { id: 'txn-011', date: '2024-02-10', project: 'Micro-eólica Parque Barigui', type: 'Investimento', amount: 5000, tokens: 500, status: 'Concluído' },
    ];

    const userPortfolio: UserPortfolio = {
        totalInvested: 14000,
        totalEarnings: 167.75,
        votingPower: 14000,
        personalCO2Impact: 150.7, // kg
        personalKWhGenerated: 4500, // kWh
        socialImpactScore: 65, // out of 100
        governanceActivityScore: 85, // out of 100
        investments: [
            {
                projectId: 'solar-aurora',
                projectName: 'Solar Batel Home',
                projectImage: 'https://media.123i.com.br/rest/image/outer/350/350/konecty/photo/catalog/979acc02c62e44ef70ac6e6c39265730/images/7640959a6a9d38ff9085a577804f734b.jpg',
                tokensOwned: 750,
                amountInvested: 7500,
                currentEarnings: 97.00,
                status: 'Ativo',
            },
            {
                projectId: 'eolica-barigui',
                projectName: 'Micro-eólica Parque Barigui',
                projectImage: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/4c/56/ef/parque-baragui-view-oi.jpg?w=900&h=500&s=1',
                tokensOwned: 500,
                amountInvested: 5000,
                currentEarnings: 70.75,
                status: 'Ativo',
            },
            {
                projectId: 'solar-mercado-municipal',
                projectName: 'Energia do Mercado Municipal',
                projectImage: 'https://www.mercadomunicipaldecuritiba.com.br/wp-content/uploads/2024/05/mercado_municipal_de_curitiba.jpg',
                tokensOwned: 1500,
                amountInvested: 1500,
                currentEarnings: 0,
                status: 'Ativo',
            },
        ],
        earningsHistory: [
            { month: 'Jan', value: 0 }, { month: 'Fev', value: 0 }, { month: 'Mar', value: 0 },
            { month: 'Abr', value: 37 }, { month: 'Mai', value: 42.5 }, { month: 'Jun', value: 43.5 },
            { month: 'Jul', value: 44.25 }
        ],
        transactions,
    };

    const daoProposals: DAOProposal[] = [
        {
            id: 'prop-001',
            title: 'Próximo projeto no bairro Portão?',
            summary: 'Alocar fundos para um novo projeto de painéis solares em um centro comunitário no bairro Portão.',
            details: `
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Descrição Completa</h4>
                <p class="mb-4">Esta proposta visa aprovar a alocação de R$ 250.000,00 do fundo de desenvolvimento da comunidade para a instalação de um sistema de painéis solares no telhado do Centro Comunitário do bairro Portão. O projeto tem potencial para gerar 80.000 kWh por ano, cobrindo 100% do consumo do centro e vendendo o excedente para a rede, gerando receita recorrente.</p>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Impacto Esperado</h4>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                    <li>Redução de custos de energia para o centro comunitário, liberando orçamento para atividades sociais.</li>
                    <li>Geração de aproximadamente 40 toneladas de CO₂ evitadas por ano.</li>
                    <li>Retorno educacional, servindo como um exemplo de sustentabilidade para a comunidade local.</li>
                </ul>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Análise Financeira</h4>
                <p>O APY estimado para os investidores da plataforma neste projeto é de 11.5%, com um prazo de contrato de 10 anos. O payback do investimento inicial é projetado para 7 anos.</p>
            `,
            status: 'Ativa',
            deadline: '3 dias restantes',
            votesFor: 18500,
            votesAgainst: 4200,
            votesAbstain: 1100,
            totalVotes: 23800,
        },
        {
            id: 'prop-004',
            title: 'Programa de Recompra de Tokens',
            summary: 'Utilizar 15% dos lucros trimestrais para recomprar tokens EVC no mercado, aumentando o valor para os detentores.',
            details: `
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Descrição Completa</h4>
                <p class="mb-4">Esta proposta sugere a criação de um programa de recompra de tokens EVC, utilizando 15% dos lucros líquidos trimestrais da plataforma. Os tokens recomprados seriam "queimados" (retirados permanentemente de circulação), o que reduziria a oferta total e potencialmente aumentaria o valor dos tokens restantes em posse dos investidores.</p>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Objetivos</h4>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                    <li>Aumentar o valor intrínseco dos tokens EVC para os investidores de longo prazo.</li>
                    <li>Criar um mecanismo de retorno de valor direto para a comunidade.</li>
                    <li>Sinalizar confiança no futuro e na saúde financeira da plataforma.</li>
                </ul>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Considerações</h4>
                <p>A alocação de 15% dos lucros para este fim significa que haverá uma redução no montante disponível para novos investimentos ou para o fundo de desenvolvimento. A comunidade deve ponderar se a valorização do token é a melhor utilização destes fundos no momento.</p>
            `,
            status: 'Ativa',
            deadline: '12 dias restantes',
            votesFor: 5500,
            votesAgainst: 1200,
            votesAbstain: 300,
            totalVotes: 7000,
        },
        {
            id: 'prop-002',
            title: 'Parceria com a instaladora "Sol Maior"',
            summary: 'Firmar parceria de exclusividade com a empresa "Sol Maior" para os próximos 3 projetos.',
            details: `
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Descrição Completa</h4>
                <p class="mb-4">A proposta sugere a formalização de um contrato de exclusividade com a "Sol Maior Instalações Elétricas", uma empresa com 10 anos de experiência e alta reputação no mercado de Curitiba. A parceria visa agilizar o processo de implantação dos próximos três projetos solares aprovados pela DAO, garantindo custos pré-negociados e um padrão de qualidade consistente.</p>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Benefícios</h4>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                    <li>Redução de 10% nos custos de instalação em comparação com orçamentos avulsos.</li>
                    <li>Diminuição do tempo de implantação em aproximadamente 20 dias por projeto.</li>
                    <li>Garantia estendida de 5 anos nos equipamentos instalados.</li>
                </ul>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Riscos</h4>
                <p>A exclusividade pode limitar a negociação com outros fornecedores que possam oferecer tecnologias mais novas ou preços mais competitivos durante a vigência do contrato. A votação da comunidade indicou forte apoio aos benefícios.</p>
            `,
            status: 'Aprovada',
            deadline: 'Finalizada',
            votesFor: 35000,
            votesAgainst: 5000,
            votesAbstain: 800,
            totalVotes: 40800,
        },
        {
            id: 'prop-005',
            title: 'Expansão para a Região Metropolitana',
            summary: 'Iniciar estudos de viabilidade para expandir a atuação para cidades como São José dos Pinhais.',
            details: `
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Descrição Completa</h4>
                <p class="mb-4">Com o sucesso dos projetos em Curitiba, esta proposta aprovou a alocação de um orçamento de R$ 50.000,00 para realizar estudos de viabilidade técnica, legal e financeira para a expansão da plataforma para a Região Metropolitana. A primeira cidade a ser analisada será São José dos Pinhais, devido ao seu potencial industrial e residencial.</p>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Resultados do Estudo</h4>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                    <li>Identificação de 3 áreas com alto potencial para projetos solares de médio porte.</li>
                    <li>Análise preliminar da legislação municipal, que é favorável a projetos de energia renovável.</li>
                    <li>Mapeamento de potenciais parceiros comerciais e industriais na região.</li>
                </ul>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Próximos Passos</h4>
                <p>Com base nos resultados positivos, uma nova proposta será submetida em breve para aprovar o primeiro projeto piloto fora de Curitiba. A comunidade votou de forma esmagadora a favor da expansão, demonstrando um forte apetite por crescimento.</p>
            `,
            status: 'Aprovada',
            deadline: 'Finalizada',
            votesFor: 45000,
            votesAgainst: 2500,
            votesAbstain: 1500,
            totalVotes: 49000,
        },
        {
            id: 'prop-003',
            title: 'Aumentar a taxa da plataforma de 1% para 1.5%',
            summary: 'Reajustar a taxa de administração para cobrir custos operacionais crescentes e marketing.',
            details: `
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Descrição Completa</h4>
                <p class="mb-4">Esta proposta visava um aumento de 0.5% na taxa de administração cobrada sobre os rendimentos distribuídos. O valor seria destinado a cobrir o aumento dos custos de manutenção da plataforma, segurança cibernética e para financiar uma nova campanha de marketing para atrair mais investidores e projetos para Curitiba.</p>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Justificativa da Proposta</h4>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                    <li>Custos de servidor e desenvolvimento aumentaram 15% no último ano.</li>
                    <li>Necessidade de investir em marketing para acelerar o crescimento da plataforma.</li>
                </ul>
                <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Resultado</h4>
                <p>A comunidade votou majoritariamente contra, indicando uma preferência por manter a taxa atual para maximizar os retornos dos investidores. A equipe buscará outras formas de otimizar os custos operacionais.</p>
            `,
            status: 'Rejeitada',
            deadline: 'Finalizada',
            votesFor: 8000,
            votesAgainst: 41000,
            votesAbstain: 2000,
            totalVotes: 51000,
        },
    ];
    
    const platformStats: PlatformStats = {
        totalKWhGenerated: 1250000,
        totalCO2Avoided: 625, // tons
        totalInvested: 2350000,
        activeInvestors: 312,
        averageESGScore: 68,
    };
    
    const impactHistory = [
      { name: 'Jan', value: 15 }, { name: 'Fev', value: 25 }, { name: 'Mar', value: 40 },
      { name: 'Abr', value: 65 }, { name: 'Mai', value: 90 }, { name: 'Jun', value: 120 },
      { name: 'Jul', value: 150 }
    ];
    
    const achievements: Achievement[] = [
        {
            id: 'first_investment',
            title: 'Pioneiro Sustentável',
            icon: ICONS.money,
            metric: 'totalInvested',
            unit: 'BRL',
            getMetricValue: (p) => p.investments.length > 0 ? 1 : 0,
            levels: [
                { 
                    name: 'Bronze', 
                    threshold: 1, 
                    description: 'Faça seu primeiro aporte!',
                    detailedDescription: "Este marco celebra o seu primeiro passo na jornada de impacto. Ao fazer seu primeiro aporte, você não apenas iniciou seu caminho para a independência financeira, mas também se juntou a uma comunidade que está ativamente construindo um futuro mais sustentável para Curitiba.",
                    nextStep: "Diversifique seu portfólio! Explore outros tipos de projetos para maximizar seu impacto e seus retornos."
                },
            ]
        },
        {
            id: 'diversified_investor',
            title: 'Portfólio Diversificado',
            icon: ICONS.projects,
            metric: 'projectTypes',
            unit: 'tipos de projeto',
            getMetricValue: (p) => new Set(p.investments.map(inv => projects.find(proj => proj.id === inv.projectId)?.type)).size,
            levels: [
                 { 
                    name: 'Bronze', 
                    threshold: 2, 
                    description: 'Participe de 2 tipos de projeto.',
                    detailedDescription: 'Você está explorando diferentes fontes de energia limpa! Ao participar de projetos Solares e Eólicos, você diversifica seu risco e contribui para uma matriz energética mais robusta e resiliente para a cidade.',
                    nextStep: 'Continue a diversificar à medida que novas tecnologias, como biogás ou hidrogênio verde, forem adicionadas à plataforma.'
                },
            ]
        },
        {
            id: 'dao_activist',
            title: 'Ativista da DAO',
            icon: ICONS.dao,
            metric: 'governanceActivityScore',
            unit: 'pontos',
            levels: [
                { 
                    name: 'Bronze', 
                    threshold: 50, 
                    description: 'Atinja 50 pontos de governança.',
                    detailedDescription: "Sua voz importa! Ao participar das votações, você ajuda a guiar o futuro da plataforma. Este nível reconhece seu engajamento inicial na governança.",
                    nextStep: "Continue votando e se envolvendo nas discussões para se tornar um membro Prata."
                },
                { 
                    name: 'Prata', 
                    threshold: 85, 
                    description: 'Atinja 85 pontos de governança.',
                    detailedDescription: "Você é um membro ativo e influente da comunidade! Sua participação consistente nas votações da DAO demonstra um forte compromisso com a governança descentralizada e o sucesso coletivo.",
                    nextStep: "Que tal criar sua própria proposta? Se você tem uma ideia para um novo projeto ou melhoria, compartilhe com a comunidade!"
                },
            ]
        },
        {
            id: 'eco_warrior',
            title: 'Guerreiro Ecológico',
            icon: ICONS.co2,
            metric: 'personalCO2Impact',
            unit: 'kg de CO₂',
            levels: [
                { 
                    name: 'Bronze', 
                    threshold: 100, 
                    description: 'Evite 100 kg de CO₂.',
                    detailedDescription: "Seu impacto é real e mensurável. Esta conquista celebra o marco de ter evitado a emissão de mais de 100 kg de CO₂. É o equivalente a plantar várias árvores!",
                    nextStep: "Continue investindo em projetos de alto impacto para alcançar 500 kg de CO₂ evitado e ganhar o nível Prata."
                },
                { 
                    name: 'Prata', 
                    threshold: 500, 
                    description: 'Evite 500 kg de CO₂.',
                    detailedDescription: "Meia tonelada de CO₂ a menos na atmosfera, graças a você! Seu compromisso contínuo está fazendo uma diferença significativa na qualidade do ar e no combate às mudanças climáticas em nossa cidade.",
                    nextStep: "O próximo nível é Ouro! Continue sua jornada para evitar uma tonelada inteira de emissões."
                },
                 { 
                    name: 'Ouro', 
                    threshold: 1000, 
                    description: 'Evite 1.000 kg de CO₂.',
                    detailedDescription: "Uma tonelada de CO₂! Este é um marco monumental. Seus investimentos têm um impacto ambiental comparável a tirar um carro das ruas por meses. Você é um verdadeiro campeão da sustentabilidade.",
                    nextStep: "Você alcançou o nível mais alto! Continue a expandir seu legado verde e inspire outros a se juntarem à causa."
                },
            ]
        },
        {
            id: 'visionary_investor',
            title: 'Visionário Sustentável',
            icon: ICONS.myPortfolio,
            metric: 'totalInvested',
            unit: 'BRL',
            levels: [
                 { 
                    name: 'Bronze', 
                    threshold: 5000, 
                    description: 'Aporte um total de R$ 5.000.',
                    detailedDescription: "Você está construindo um portfólio verde sólido! Atingir este marco mostra seu compromisso em alinhar seus objetivos financeiros com um impacto ambiental positivo.",
                    nextStep: "Continue a aumentar seu portfólio para alcançar R$ 10.000 e se tornar um Visionário Prata."
                },
                 { 
                    name: 'Prata', 
                    threshold: 10000, 
                    description: 'Aporte um total de R$ 10.000.',
                    detailedDescription: "Você demonstrou um compromisso significativo com a causa da energia verde. Ao ultrapassar R$ 10.000, você se torna um pilar fundamental para o financiamento de projetos maiores e mais impactantes.",
                    nextStep: "O nível Ouro espera por você em R$ 25.000. Seu capital está acelerando de forma crucial a transição energética."
                },
                 { 
                    name: 'Ouro', 
                    threshold: 25000, 
                    description: 'Aporte um total de R$ 25.000.',
                    detailedDescription: "Um aporte desta magnitude faz de você um dos principais impulsionadores da energia renovável em Curitiba. Sua visão e confiança na plataforma permitem a realização de projetos que transformam a paisagem energética da cidade.",
                    nextStep: "Você é um líder na comunidade! Compartilhe sua jornada para inspirar novos participantes."
                },
            ]
        },
        {
            id: 'clean_energy_specialist',
            title: 'Especialista em Energia Limpa',
            icon: ICONS.trophy,
            metric: 'projectTypes', // Placeholder, logic is in getMetricValue
            getMetricValue: (p) => p.investments.length,
            unit: 'projetos',
            levels: [
                { 
                    name: 'Bronze', 
                    threshold: 3, 
                    description: 'Participe de 3 projetos diferentes.',
                    detailedDescription: "Você está se tornando um verdadeiro conhecedor do ecossistema de energia limpa! Ao participar de três projetos distintos, você demonstra um compromisso aprofundado e ajuda a fortalecer diferentes frentes da nossa matriz energética sustentável.",
                    nextStep: "Continue a expandir seu impacto! Alcance cinco projetos para se tornar um especialista Prata e diversificar ainda mais seu portfólio verde."
                },
                { 
                    name: 'Prata', 
                    threshold: 5, 
                    description: 'Participe de 5 projetos diferentes.',
                    detailedDescription: "Seu portfólio é um exemplo de diversificação e apoio à energia renovável. Com cinco projetos, você está financiando uma gama variada de tecnologias e localidades, maximizando seu impacto positivo em Curitiba.",
                    nextStep: "O nível Ouro está ao seu alcance! Participe de sete projetos para solidificar seu status como um dos principais apoiadores da energia verde na cidade."
                },
                { 
                    name: 'Ouro', 
                    threshold: 7, 
                    description: 'Participe de 7 projetos diferentes.',
                    detailedDescription: "Incrível! Com sete participações distintas, você não é apenas um investidor, mas um pilar da transição energética em Curitiba. Sua dedicação está ajudando a construir um futuro mais limpo e resiliente para todos nós.",
                    nextStep: "Você é uma inspiração para a comunidade! Continue a ser um líder, compartilhando sua experiência e incentivando novos participantes a se juntarem à causa."
                },
            ]
        },
    ];

    const communityGoal: CommunityGoal = {
        id: 'co2-q3-2024',
        title: 'Meta Comunitária: 3º Trimestre',
        description: 'Vamos juntos evitar 1.000 toneladas de CO₂ até o final de Setembro!',
        currentValue: platformStats.totalCO2Avoided,
        goalValue: 1000,
        unit: 'toneladas',
        icon: ICONS.trophy,
    };


    return { projects, userPortfolio, daoProposals, platformStats, impactHistory, achievements, communityGoal };
};