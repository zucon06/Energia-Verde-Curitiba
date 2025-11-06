import React, { useState } from 'react';
import Card from '../ui/Card';
import InteractiveTour from './InteractiveTour';
import Modal from '../ui/Modal';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    idPrefix: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, idPrefix }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelId = `${idPrefix}-panel`;
    const headerId = `${idPrefix}-header`;

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <h3 id={headerId} className="text-lg font-semibold text-gray-900 dark:text-white w-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex justify-between items-center w-full py-5 text-left"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                >
                    <span className="pr-4">{title}</span>
                    <svg
                        className={`w-6 h-6 transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true" 
                        focusable="false"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </h3>
            <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="pb-5 text-gray-600 dark:text-gray-300 space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const learningContent = {
    apy: {
        title: "O que significa APY (Rendimento Percentual Anual)?",
        content: `
            <p>APY, ou Rendimento Percentual Anual, é a taxa de retorno real que você ganha em um investimento ao longo de um ano, incluindo o efeito dos juros compostos.</p>
            <p>Em nossa plataforma, o APY representa a rentabilidade estimada que cada projeto pode gerar anualmente. É uma métrica crucial para comparar o potencial de retorno entre diferentes oportunidades de investimento.</p>
        `
    },
    dao: {
        title: "Como funciona uma DAO na prática?",
        content: `
            <p>Uma DAO (Organização Autônoma Descentralizada) é como uma cooperativa digital. Em vez de uma diretoria central, as decisões são tomadas pelos próprios membros (investidores).</p>
            <p>Na Energia Verde Curitiba, cada token de investimento que você possui equivale a um voto. Você pode usar seus votos para aprovar ou rejeitar propostas, como a seleção de novos projetos, mudanças nas taxas da plataforma ou parcerias estratégicas. Isso garante que a comunidade tenha um papel ativo na governança e no futuro da plataforma.</p>
        `
    },
    rwa: {
        title: "O que são RWAs (Real World Assets)?",
        content: `
            <p>RWAs, ou 'Ativos do Mundo Real', são uma forma de representar ativos físicos (como um painel solar ou uma turbina eólica) como um token digital na blockchain. Esse processo é chamado de tokenização.</p>
            <p>Ao investir em um projeto na nossa plataforma, você está comprando tokens que representam uma fração daquele ativo real. Isso torna o investimento mais acessível, transparente e líquido, permitindo que você invista em grandes projetos de infraestrutura com pequenas quantias.</p>
        `
    },
    profitability: {
        title: "Como a Rentabilidade é Calculada?",
        content: `
            <p>A rentabilidade dos projetos vem principalmente da <strong>venda da energia gerada</strong>. Essa energia pode ser vendida para a rede elétrica local ou diretamente para consumidores, como empresas e condomínios, através de contratos de longo prazo (PPAs - Power Purchase Agreements) que garantem um fluxo de receita estável.</p>
            <p>Outras fontes de receita podem incluir <strong>incentivos governamentais</strong> para energia limpa ou a venda de <strong>créditos de carbono</strong>.</p>
            <p>Após a dedução dos custos operacionais (manutenção, seguros, taxas da plataforma), o lucro líquido é distribuído aos investidores na forma de rendimentos, proporcionalmente à participação de cada um no projeto.</p>
        `
    },
    selection: {
        title: "Como os Projetos são Selecionados?",
        content: `
            <p>A segurança e a viabilidade dos investimentos são nossa prioridade. Todos os projetos passam por um rigoroso processo de <strong>due diligence</strong> (diligência prévia) antes de serem listados:</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Análise Técnica:</strong> Avaliamos a viabilidade da tecnologia, os estudos de irradiação solar ou de vento no local, e a qualidade dos equipamentos.</li>
                <li><strong>Análise Financeira:</strong> Verificamos as projeções de custos, receitas e a rentabilidade (APY) esperada, além da saúde financeira dos parceiros envolvidos.</li>
                <li><strong>Análise Legal e Regulatória:</strong> Garantimos que o projeto possui todas as licenças necessárias (ambientais, de construção) e está em total conformidade com a legislação.</li>
                <li><strong>Análise de Impacto:</strong> Damos preferência a projetos que, além do retorno financeiro, geram um impacto ambiental e social positivo para a comunidade local.</li>
            </ul>
            <p>Apenas os projetos que são aprovados em todas essas etapas são disponibilizados para investimento na plataforma.</p>
        `
    },
    process: {
        title: "Como Funciona o Processo de Participação?",
        content: `
            <p>O ciclo de vida da sua participação é simples e transparente:</p>
            <ol class="list-decimal pl-5 space-y-2">
                <li><strong>Fase de Captação:</strong> Você escolhe um projeto e adquire sua participação com o valor desejado enquanto a meta de financiamento está aberta.</li>
                <li><strong>Execução do Projeto:</strong> Assim que a meta é atingida, os fundos são utilizados para construir e iniciar a operação da usina de energia.</li>
                <li><strong>Geração de Receita:</strong> O projeto começa a gerar e vender energia, produzindo receita.</li>
                <li><strong>Distribuição de Rendimentos:</strong> Periodicamente (geralmente mensal ou trimestralmente), os lucros líquidos são calculados e distribuídos para a sua conta na plataforma.</li>
                <li><strong>Acompanhamento Contínuo:</strong> Você pode monitorar o desempenho das suas participações, seus rendimentos e seu impacto ambiental diretamente no seu 'Meu Portfólio'.</li>
            </ol>
        `
    },
    risks: {
        title: "Quais são os Riscos Envolvidos?",
        content: `
            <p>Como todo investimento, existem riscos, e a transparência é fundamental. Os principais riscos associados são:</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Riscos do Projeto:</strong> Podem ocorrer atrasos na construção, custos acima do esperado, ou a performance da usina pode ser inferior à projetada (ex: menos dias de sol).</li>
                <li><strong>Riscos de Mercado:</strong> Flutuações no preço da energia ou mudanças na regulamentação do setor elétrico podem afetar a rentabilidade.</li>
                <li><strong>Riscos Operacionais:</strong> Falhas de equipamento ou necessidade de manutenções não previstas.</li>
            </ul>
            <p><strong>Como mitigamos esses riscos?</strong> Nosso processo de seleção rigoroso visa minimizar essas incertezas. Além disso, os projetos contam com seguros e contratos de manutenção preventiva para garantir a maior estabilidade operacional possível.</p>
        `
    },
    faqs: {
        title: "Perguntas Frequentes (FAQs)",
        content: `
            <div class="space-y-4">
                <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-100">Qual o valor mínimo para participar?</h4>
                    <p>O valor mínimo pode variar de projeto para projeto, mas nosso objetivo é tornar a participação o mais acessível possível. Geralmente, os aportes iniciais começam em torno de R$ 100,00. Você pode verificar o valor mínimo específico na página de detalhes de cada projeto.</p>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-100">Como recebo meus rendimentos?</h4>
                    <p>Seus rendimentos são depositados diretamente na sua carteira aqui na plataforma. Os pagamentos são feitos periodicamente (geralmente mensal ou trimestralmente), conforme a geração de receita do projeto. Você pode acompanhar todos os depósitos no seu histórico de transações e usar o saldo para participar de outros projetos ou sacá-lo para sua conta bancária (funcionalidade futura).</p>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-100">Posso resgatar meu valor aportado a qualquer momento?</h4>
                    <p>As participações em projetos de infraestrutura são, por natureza, de longo prazo, atrelados ao prazo de cada projeto (ex: 10 anos). Atualmente, não há um mecanismo de resgate antecipado. No entanto, estamos desenvolvendo um mercado secundário que permitirá que você venda seus tokens para outros participantes no futuro, trazendo mais liquidez para seus ativos.</p>
                </div>
            </div>
        `
    },
    glossary: {
        title: "Glossário de Termos",
        content: `
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Blockchain:</strong> Um livro-razão digital, distribuído e imutável, que registra transações de forma segura e transparente.</li>
                <li><strong>Token:</strong> Um ativo digital que representa propriedade, utilidade ou valor dentro de um ecossistema blockchain.</li>
                <li><strong>APY (Annual Percentage Yield):</strong> Rendimento Percentual Anual. A taxa de retorno de um investimento em um ano, incluindo juros compostos.</li>
                <li><strong>DAO (Decentralized Autonomous Organization):</strong> Organização Autônoma Descentralizada. Uma organização governada por regras codificadas em software e controlada por seus membros.</li>
                <li><strong>RWA (Real World Asset):</strong> Ativo do Mundo Real. Um ativo físico ou tradicional que foi tokenizado para ser representado na blockchain.</li>
            </ul>
        `
    }
};

const LearningCenter: React.FC = () => {
    const [isTourOpen, setTourOpen] = useState(false);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Central de Aprendizagem</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Tire suas dúvidas sobre os conceitos-chave da nossa plataforma e do mercado de investimentos sustentáveis.
                </p>
            </div>
            
            <Card>
                <button onClick={() => setTourOpen(true)} className="w-full text-left p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-green">
                    <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-brand-green">Novo por aqui?</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">Faça nosso tour interativo para conhecer as principais funcionalidades da plataforma em poucos minutos.</p>
                        </div>
                        <div className="flex-shrink-0 bg-brand-green text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md pointer-events-none">
                            Iniciar Tour Guiado
                        </div>
                    </div>
                </button>
            </Card>

            <Card>
                <AccordionItem title={learningContent.apy.title} idPrefix="apy">
                    <div dangerouslySetInnerHTML={{ __html: learningContent.apy.content }} />
                </AccordionItem>
                <AccordionItem title={learningContent.dao.title} idPrefix="dao">
                    <div dangerouslySetInnerHTML={{ __html: learningContent.dao.content }} />
                </AccordionItem>
                <AccordionItem title={learningContent.rwa.title} idPrefix="rwa">
                    <div dangerouslySetInnerHTML={{ __html: learningContent.rwa.content }} />
                </AccordionItem>
                <AccordionItem title={learningContent.profitability.title} idPrefix="profitability">
                    <div dangerouslySetInnerHTML={{ __html: learningContent.profitability.content }} />
                </AccordionItem>
                 <AccordionItem title={learningContent.selection.title} idPrefix="selection">
                    <div dangerouslySetInnerHTML={{ __html: learningContent.selection.content }} />
                </AccordionItem>
                 <AccordionItem title={learningContent.process.title} idPrefix="process">
                    <div dangerouslySetInnerHTML={{ __html: learningContent.process.content }} />
                </AccordionItem>
                <AccordionItem title={learningContent.risks.title} idPrefix="risks">
                    <div dangerouslySetInnerHTML={{ __html: learningContent.risks.content }} />
                </AccordionItem>
                <AccordionItem title={learningContent.faqs.title} idPrefix="faqs">
                    <div dangerouslySetInnerHTML={{ __html: learningContent.faqs.content }} />
                </AccordionItem>
                <AccordionItem title={learningContent.glossary.title} idPrefix="glossary">
                     <div dangerouslySetInnerHTML={{ __html: learningContent.glossary.content }} />
                </AccordionItem>
            </Card>

            <Modal isOpen={isTourOpen} onClose={() => setTourOpen(false)} title="Tour Interativo">
                {/* FIX: Pass the onComplete prop to InteractiveTour to handle closing the modal. */}
                <InteractiveTour onComplete={() => setTourOpen(false)} />
            </Modal>
        </div>
    );
};

export default LearningCenter;