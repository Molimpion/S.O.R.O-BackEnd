/* eslint-disable no-console */
import { PrismaClient, Profile } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// --- 1. DADOS DE USUÁRIOS (NOVOS E DIFERENTES) ---
const NOVOS_USUARIOS = [
  // ADMINS (Oficiais Superiores/Comando)
  { nome: 'Coronel Moura', email: 'cel.moura@bombeiros.pe.gov.br', perfil: 'ADMIN' as Profile, matricula: '900101-A' },
  { nome: 'Major Dias', email: 'maj.dias@bombeiros.pe.gov.br', perfil: 'ADMIN' as Profile, matricula: '900102-B' },
  { nome: 'Capitão Nunes', email: 'cap.nunes@bombeiros.pe.gov.br', perfil: 'ADMIN' as Profile, matricula: '900103-C' },
  { nome: 'Capitão Braga', email: 'cap.braga@bombeiros.pe.gov.br', perfil: 'ADMIN' as Profile, matricula: '900104-D' },
  { nome: 'Tenente Castro', email: 'ten.castro@bombeiros.pe.gov.br', perfil: 'ADMIN' as Profile, matricula: '900105-E' },

  // CHEFES (Gestores de Turno/Unidade)
  { nome: 'Tenente Frota', email: 'ten.frota@bombeiros.pe.gov.br', perfil: 'CHEFE' as Profile, matricula: '900201-F' },
  { nome: 'Subtenente Lopes', email: 'st.lopes@bombeiros.pe.gov.br', perfil: 'CHEFE' as Profile, matricula: '900202-G' },
  { nome: 'Sargento Araújo', email: 'sgt.araujo@bombeiros.pe.gov.br', perfil: 'CHEFE' as Profile, matricula: '900203-H' },
  { nome: 'Sargento Vieira', email: 'sgt.vieira@bombeiros.pe.gov.br', perfil: 'CHEFE' as Profile, matricula: '900204-I' },
  { nome: 'Cabo Farias', email: 'cb.farias@bombeiros.pe.gov.br', perfil: 'CHEFE' as Profile, matricula: '900205-J' },

  // ANALISTAS (Despacho e Monitoramento)
  { nome: 'Sargento Mendes', email: 'sgt.mendes@bombeiros.pe.gov.br', perfil: 'ANALISTA' as Profile, matricula: '900301-K' },
  { nome: 'Sargento Pinto', email: 'sgt.pinto@bombeiros.pe.gov.br', perfil: 'ANALISTA' as Profile, matricula: '900302-L' },
  { nome: 'Cabo Teixeira', email: 'cb.teixeira@bombeiros.pe.gov.br', perfil: 'ANALISTA' as Profile, matricula: '900303-M' },
  { nome: 'Cabo Cavalcanti', email: 'cb.cavalcanti@bombeiros.pe.gov.br', perfil: 'ANALISTA' as Profile, matricula: '900304-N' },
  { nome: 'Soldado Batista', email: 'sd.batista@bombeiros.pe.gov.br', perfil: 'ANALISTA' as Profile, matricula: '900305-O' },

  // OPERADORES DE CAMPO (Na Viatura/Celular)
  { nome: 'Soldado Nascimento', email: 'sd.nascimento@bombeiros.pe.gov.br', perfil: 'OPERADOR_CAMPO' as Profile, matricula: '900401-P' },
  { nome: 'Soldado Santana', email: 'sd.santana@bombeiros.pe.gov.br', perfil: 'OPERADOR_CAMPO' as Profile, matricula: '900402-Q' },
  { nome: 'Soldado Aguiar', email: 'sd.aguiar@bombeiros.pe.gov.br', perfil: 'OPERADOR_CAMPO' as Profile, matricula: '900403-R' },
  { nome: 'Soldado Ribeiro', email: 'sd.ribeiro@bombeiros.pe.gov.br', perfil: 'OPERADOR_CAMPO' as Profile, matricula: '900404-S' },
  { nome: 'Soldado Machado', email: 'sd.machado@bombeiros.pe.gov.br', perfil: 'OPERADOR_CAMPO' as Profile, matricula: '900405-T' },
];

// --- 2. DADOS OPERACIONAIS (BASEADOS NO DOCUMENTO) ---

const GRUPAMENTOS_DATA = [
  { sigla: 'GBAPH', nome: 'Grupamento de Busca e Salvamento' },
  { sigla: 'GBMar', nome: 'Grupamento de Bombeiros Marítimos' },
  { sigla: 'GBI', nome: 'Grupamento de Bombeiros de Incêndio' },
  { sigla: 'GBS', nome: 'Grupamento de Busca e Salvamento' },
];

const UNIDADES_TXT = [
  "CMan - 2ª SBMar", "SÃO LOURENÇO DA MATA - 3ª SBAPH", "GBI - 1ª SBI",
  "RECIFE - Pina – PGV 01/PO 01, Buraco da Velha", "GBAPH - 1ª SBAPH", 
  "IGARASSU - 2ª SBAPH", "CEASA", "GBS - 1ª SBS", "SBFN", "GBMAR - 1º SBMar",
  "RECIFE - Pina – PGV 02/PO 02, em frente à Rua Souto Filho",
  "OLINDA - Bairro Novo – PGV 01, antiga PE", "OLINDA - Casa Caiada – PGV 03, antigo G. Barbosa",
  "RECIFE - Boa Viagem – PGV 08, em frente à casa do Brigadeiro", "QCG - 2ª SBI", "ABMG",
  "RECIFE - Boa Viagem – PGV 06/PO 06, em frente ao edifício ACAIACA", "SUAPE - 3ª SBI",
  "JABOATÃO - Piedade - PGV 04/PO11, na igrejinha de Piedade",
  "JABOATÃO - Barra de Jangada – 06, em frente da Ilha do Amor",
  "RECIFE - Boa Viagem – PGV 05/PO 05, em frente ao edifício CATAMARÃ",
  "RECIFE - Boa Viagem – PGV 03/PO 03, quadra de tênis",
  "RECIFE - Boa Viagem – PGV 10, em frente à Praça de Boa Viagem",
  "JABOATÃO - Piedade - PGV 02/PO 10, em frente ao GBMar",
  "RECIFE - Boa Viagem – PGV 07/PO 07, em frente ao edifício OTHON",
  "OLINDA - Bairro Novo – PGV 02, em frente ao Colégio Dom",
  "RECIFE - Boa Viagem – PGV 04/PO 04, 2º Jardim", "CABO DE SANTO AGOSTINHO"
];

const VIATURAS_MAP: Record<string, string[]> = {
  'AAR': ['AA-973', 'AA-970'],
  'ABSA': ['022-AB', '381-AB'],
  'ABSC': ['082-SC', '921-SC'],
  'ABSL': ['008-SL', '093-SL'],
  'ABSM': ['1037-SM', '1040-SM'],
  'ABSP': ['956', '396'],
  'ABT': ['916-BT', '836-BT'],
  'ABTS': ['913-BTS', '1011-BTS'],
  'ACO': ['092-CO'],
  'AP': ['AP-032', 'AP-059'],
  'APP': ['974-PP', '970-PP'],
  'AR': ['973', '1013'],
  'ASV': ['097-SV', '036-SV'],
  'AT': ['At-342', 'At-423'],
  'ATP': ['004-L', '008-L'],
  'BIS': ['BIS-945', 'BIS-949'],
  'GUARDA_VIDAS': ['001-GV', '084-GV'],
  'INTERVENCAO': ['38-E', '62-E'],
  'MA': ['041', '044', '072', '491'],
  'MR': ['1022', '1023', '1019', '1028'],
  'MSA': ['MSA0980', 'MSA982'],
  'UTM': ['022-M', '194-M'],
  'OUTRO': ['O-992', 'O-842']
};

const NATUREZAS_LIST = [
  'APH', 'INCÊNDIO', 'SALVAMENTO', 'PRODUTOS PERIGOSOS', 'PREVENÇÃO', 'ATIVIDADE COMUNITÁRIA'
];

const GRUPOS_LIST = [
  'Emergências Clínicas Diversas', 'Queda', 'Acidente de Trânsito Colisão Abalroamento',
  'Acidente de Trânsito Choque', 'APH Diversos', 'Acidente de Trânsito Atropelamento',
  'Acidentes Diversos', 'Emergência Psiquiátrica', 'Emergência Cardíaca', 'Vítima de Agressão',
  'Queimadura Térmica', 'Emergência Respiratória', 'Acidente de Trânsito Capotamento',
  'Emergência Obstétrica', 'Queimadura Química', 'Trauma por Objeto Contundente',
  'Queimadura Elétrica / Choque', 'Incidente com Animal Aquático', 'Trem de Socorro',
  'Incidente com Animal Inseto', 'Trauma por Objeto Perfuro Cortante', 'Incêndio em Vegetação',
  'Incêndio em Edificação Residencial', 'Incêndio em Meio de Transporte Terrestre',
  'Incêndio em Via Pública', 'Incêndio em Edificação Especial', 'Incêndio em Edificação Comercial',
  'Incêndios Diversos', 'Incêndio em Edificação Industrial', 'Incêndio em Edificação Concentração de Público',
  'Incêndio em Edificação Escolar', 'Incêndio em Edificação Depósito', 'Incêndio em Edificação Outros',
  'Incêndio em Edificação Hospitalar', 'Incêndio em Área de Descarte', 'Incêndio em Edificação Transitória',
  'Evento com Pessoa', 'Evento com Árvore', 'Evento com Cadáver', 'Evento com Animal',
  'Salvamento Diverso', 'Evento com Meio de Transporte', 'Evento com Objeto', 'Vazamento',
  'Explosão', 'Derramamento', 'Prevenção Aquática', 'Evento Festivo', 'Evento Esportivo',
  'Apoio em Operações', 'Prevenção Diversos', 'Apoio Social', 'Atividade Comunitária Diversa',
  'Interação Educativa', 'Incidente com Animal com Peçonha', 'Incidente com Animal Sem Peçonha',
  'Incêndio', 'Diversos'
];

const SUBGRUPOS_LIST = [
  'Outro', 'Queda da Própria Altura', 'Auto Passeio x Motocicleta', 'Queda de Nível Acima de 2M',
  'Motocicleta', 'Queda de Moto', 'Auto Passeio', 'Diversos', 'Auto Passeio x Ônibus ou Micro-Ônibus',
  'Auto Passeio x Auto Passeio', 'Desmaio /Síncope', 'Motocicleta x Motocicleta', 'Convulsão',
  'Ônibus ou Micro-Ônibus', 'Distúrbio Mental com Risco', 'Queda de Bicicleta', 'Problemas Cardíacos',
  'Arma Branca', 'Fogo', 'Queda de Nível Abaixo de 2M', 'Moto', 'Motocicleta x Veículo de Carga Não Perigosa',
  'Auto Passeio x Van ou Similar', 'Auto Passeio x Bicicleta', 'Crise Hipertensiva', 'Intoxicação Endógena',
  'Física', 'Motocicleta x Ônibus ou Micro-Ônibus', 'Bicicleta', 'Veículo de Carga Não Perigosa x Veículo de Carga Não Perigosa',
  'Auto Passeio x Caminhão', 'Insuficiência Respiratória', 'Envenenamento', 'Ônibus ou Micro-Ônibus x Ônibus ou Micro-Ônibus',
  'Crise Traumática', 'Distúrbio Mental Sem Risco', 'Ônibus ou Micro-Ônibus x Veículo de Carga Perigosa',
  'Ônibus ou Micro-Ônibus x Veículo de Carga Não Perigosa', 'Queda de Animal', 'Caminhão', 'Vítima de Desastre',
  'Gravidez', 'Auto Passeio x Veículo de Carga Não Perigosa', 'Superfície Quente', 'Arma de Fogo',
  'Hipoglicemia', 'Parto', 'Engasgo', 'Acidente Vascular Cerebral', 'Motocicleta x Van ou Similar',
  'Atendimento Secundário', 'Veículo de Carga Não Perigosa', 'Van ou Similar x Veículo de Carga Não Perigosa',
  'Animal', 'Motocicleta x Veículo de Carga Perigosa', 'Hipotermia', 'nan', 'Objeto Contundente',
  'Hemorragia', 'Máquina Agrícola x Ônibus ou Micro-Ônibus', 'Auto Passeio x Trem', 'Fios Energizados de Postes',
  'Abelha', 'Auto Passeio x Metrô', 'Carroça', 'Ônibus ou Micro-Ônibus x Van ou Similar', 'Coma Alcoólico',
  'Fios Energizados de Casa', 'Engavetamento Diverso', 'Motocicleta x Veículo de Emerg., Policial ou Similar',
  'Parada Cardiorrespiratória', 'Mato', 'Unifamiliar Casa Residência', 'Mata ou Floresta Nativa',
  'Multifamiliar Edificação Elevada', 'Protesto', 'Terreno Baldio, Lote Vago ou Similar', 'Loja de Departamentos',
  'Fiação Elétrica de Poste', 'Mangue', 'Madeireira', 'Ensino Fundamental ou Médio', 'Têxtil',
  'Eletrodoméstico ou Similar', 'Metalúrgica', 'Multifamiliar Casas Conjugadas', 'Armazém, Galpão ou Similar',
  'Veículo de Carga Perigosa', 'Estação de Tratamento ou Distribuição de Água', 'Hospital', 'Van ou Similar',
  'Mercado', 'Oficina', 'Ensino Superior', 'Bar, Lanchonete ou Similar', 'Padaria ou Similar', 'Supermercado',
  'Aglomerado Subnormal Favela', 'Agência Bancária', 'Igreja, Templo ou Similar', 'Local Especial para Tratamento e Reciclagem',
  'Policlínica, Clínica ou Similar', 'Farmácia, Perfumaria ou Similar', 'Prédio Público', 'Plástico ou Similar',
  'Máquina Agrícola', 'Laboratório', 'Borracha, Pneu ou Similar', 'Destilaria, Refinaria ou Similar',
  'Arborização Pública', 'Táxi', 'Quartel Da Polícia, Bombeiro, Forças Armadas ou Afim', 'Lixão', 'Monturo',
  'Alimentícia', 'Creche', 'Barbearia, Salão de Beleza ou Similar', 'Galeria', 'Agência de Câmbio ou Similar',
  'Coletivo Pensionato', 'Cinema', 'Estação ou Subestação de Distribuição de Energia Elétrica', 'Escritório',
  'Fábrica ou Revenda de Fogos de Artifício ou Artefato Explosivo', 'Pousada', 'Açougue, Frigorífico, Matadouro ou Similar',
  'Papel, Livros ou Similar', 'Preso em Elevador', 'Afogamento', 'Queda de Árvore sobre Imóveis', 'Busca',
  'Felino Gato', 'Pessoa Perdida / Desaparecida', 'Tentativa de Suicídio', 'Canino Cão', 'Recuperação',
  'Equino', 'Preso em Ferragem de Veículo', 'Diverso', 'Silvestre Cobra', 'Resgate Aquático', 'Retirada de Anel ou Similar',
  'Inseto Abelha', 'Silvestre Jacaré', 'Inseto Maribondo', 'Queda', 'Pessoa em Local de Difícil Acesso (Trilha/Montanha/Caverna)',
  'Inseto Outro', 'Queda de Árvore em Via Pública', 'Pessoa Ilhada', 'Silvestre Outro', 'Deslizamento / Escorregamento',
  'Queda de Árvore sobre Veículos', 'Preso em Espaço Confinado', 'Transporte de Vítima', 'Aves', 'Preso em Máquina ou Equipamento',
  'Remoção de Objeto', 'Preso em Altura', 'Objeto em Local de Risco', 'Explosão', 'Alagamento', 'Desabamento / Desmoronamento',
  'Canino Outro', 'Caprino', 'Soterramento', 'Bovino', 'Salvamento em Incêndio', 'Silvestre Bicho Preguiça',
  'Tombamento', 'Gás Liquefeito de Petróleo', 'Outros Gases', 'Gás Natural / Gás Natural Veicular', 'Gases',
  'Líquidos Inflamáveis', 'Substâncias Tóxicas', 'Líquidos não Inflamáveis', 'Não Identificado',
  'Ativa e Reativa (Orientação ao Banhista)', 'Ativação de Posto com Embarcação', 'Ativação de Posto com Viatura',
  'Prevenção em Orla Marítima', 'Estádio de Futebol', 'Lavagem de Pista', 'Prevenção em Instrução', 'Carnavalesco',
  'Pouso e Decolagem', 'Composição de Comboios de Veículos', 'Semana Santa', 'Reunião de Público', 'Junino',
  'Criança Perdida', 'Banho de Neblina', 'Apoio à Instituição', 'Palestra', 'Abastecimento de Água', 'Exercício Simulado',
  'Exposição', 'Treinamento', 'Transporte de bem ou Produto', 'Hotel ou Apart Hotel', 'Escorpião', 'Gato',
  'Máquina Agrícola x Veículo de Carga Não Perigosa', 'Fogos de Artifício', 'Metal Qualquer', 'Química',
  'Canteiro de Obras', 'Metrô', 'Restaurante', 'Abertura Forçada', 'Substâncias Explosivas', 'Desfile Cívico-Militar',
  'Demonstração'
];

const MUNICIPIOS_BAIRROS: Record<string, string[]> = {
  'Recife': [
    'Santo Amaro', 'Boa Vista', 'Afogados', 'Areias', 'Arruda', 'Barro', 'Beberibe', 'Boa Viagem',
    'Bomba do Hemetério', 'Bongi', 'Brasília Teimosa', 'Brejo da Guabiraba', 'Brejo de Beberibe',
    'Brum', 'Cajueiro', 'Campina do Barreto', 'Campo Grande', 'Casa Amarela', 'Casa Forte',
    'Caxangá', 'Cidade Universitária', 'Cohab', 'Coqueiral', 'Cordeiro', 'Curado', 'Derby',
    'Dois Irmãos', 'Dois Unidos', 'Engenho do Meio', 'Espinheiro', 'Estância', 'Fundão',
    'Graças', 'Guarani', 'Guabiraba', 'Hipódromo', 'Ibura', 'Ilha do Leite', 'Ilha do Retiro',
    'Imbiribeira', 'Iputinga', 'Jaqueira', 'Jardim São Paulo', 'Jiquiá', 'Joana Bezerra',
    'Jordão', 'Linha do Tiro', 'Macaxeira', 'Madalena', 'Mangabeira', 'Mangueira', 'Mustardinha',
    'Nova Descoberta', 'Paissandu', 'Parnamirim', 'Passarinho', 'Pau Ferro', 'Peixinhos', 'Pina',
    'Poço da Panela', 'Ponte dos Carvalhos', 'Porto da Madeira', 'Rosarinho', 'Sancho',
    'Santa Luzia', 'Santo Antônio', 'São José', 'Sítio dos Pintos', 'Soledade', 'Tamarineira',
    'Tejipío', 'Torre', 'Torreão', 'Totó', 'Várzea', 'Vasco da Gama', 'Zona Rural', 'Água Fria',
    'Água de Meninos'
  ],
  'Olinda': [
    'Aguazinha', 'Alto da Bondade', 'Alto da Conquista', 'Alto da Nação', 'Alto do Sol Nascente',
    'Alto Jardim Conquista', 'Alto Nova Olinda', 'Amaro Branco', 'Amparo', 'Bairro Novo',
    'Bonsucesso', 'Bultrins', 'Caixa D\'Água', 'Carmo', 'Casa Caiada', 'Córrego do Abacaxi',
    'Fragoso', 'Guadalupe', 'Jardim Atlântico', 'Jardim Brasil', 'Jardim Fragoso', 'Jatobá',
    'Monte', 'Ouro Preto', 'Peixinhos', 'Rio Doce', 'Salgadinho', 'Santa Tereza', 'Sapucaia',
    'São Benedito', 'Sítio Novo', 'Tabajara', 'Umuarama', 'Varadouro', 'Vila Popular', 'Zona Rural',
    'Águas Compridas', '70/RO'
  ],
  'Abreu e Lima': [
    'Alto da Bela Vista', 'Alto São Miguel', 'Caetés I', 'Caetés II', 'Caetés III', 'Caetés Velho',
    'Centro', 'Desterro', 'Fosfato (Boa Esperança)', 'Jardim Caetés', 'Matinha (Cohab)',
    'Pitanga', 'Planalto', 'Timbó', 'Zona Rural'
  ],
  'Aracoiaba': ['Centro', 'Loteamento Esperança'],
  'Cabo de Santo Agostinho': [
    'Centro', 'Charneca', 'Charnequinha', 'Cohab', 'Destilaria', 'Distrito Industrial Diper',
    'Distrito Industrial Santo Estevão', 'Engenho Ilha', 'Enseada dos Corais', 'Gaibu',
    'Garapu', 'Itapuama', 'Jardim Santo Inácio', 'Malaquias', 'Mercês', 'Paiva', 'Pirapama',
    'Ponte dos Carvalhos', 'Pontezinha', 'Rosário', 'Suape', 'São Francisco'
  ],
  'Camaragibe': [
    'Alberto Maia', 'Aldeia', 'Aldeia de Baixo', 'Aldeia de Cima', 'Alto da Boa Vista',
    'Areeiro', 'Areinha', 'Bairro dos Estados', 'Bairro Novo', 'Borralho', 'Carmelitas',
    'Celeiro', 'Coimbral', 'Céu Azul', 'Estação Nova', 'Jardim Primavera', 'João Paulo II',
    'Nazaré', 'Santa Mônica', 'Santa Teresa', 'Santana', 'São João e São Paulo', 'São Pedro',
    'Tabatinga', 'Timbi', 'Vale das Pedreiras', 'Vera Cruz', 'Viana', 'Vila da Fábrica',
    'Vila da Inabi'
  ],
  'Carpina': ['Loteamento Bom Jesus', 'Paudalho'],
  'Cumaru': ['Não Informado', 'Vila Umari'],
  'Escada': ['São Sebastião'],
  'Fernando de Noronha': [
    'Baía de Santo Antônio', 'Baía do Sancho', 'Baía Sueste', 'Praia da Cacimba do Padre',
    'Praia da Conceição', 'Praia do Americano', 'Praia do Bode', 'Praia do Boldró',
    'Praia do Cachorro', 'Praia do Meio', 'Outro'
  ],
  'Igarassu': [
    'Agamenon Magalhães', 'Ana de Albuquerque', 'Bela Vista', 'Boa Vista', 'Bonfim', 'Centro',
    'Cortegada', 'Cruz de Rebouças', 'Encanto Igarassu', 'Inhamã', 'Jabacó', 'Monjope',
    'Nova Cruz', 'Posto de Monta', 'Santa Maria', 'Santa Rita', 'Santo Antônio', 'Sítio dos Marcos',
    'Tabatinga', 'Três Ladeiras', 'Umbura', 'Vila Rural', 'Vila Saramandaia'
  ],
  'Ilha de Itamaraca': [
    'Bom Jesus', 'Engenho São João', 'Forno da Cal', 'Forte Orange', 'Fortinho', 'Jaguaribe',
    'Pilar', 'Rio Âmbar', 'Socorro', 'Vila Velha'
  ],
  'Ipojuca': [
    'Camela', 'Distrito-Sede', 'Engenho Maranhão', 'Engenho Queluz', 'Nossa Senhora do Ó',
    'Praia de Gamboa', 'Praia de Maracaípe', 'Praia de Muro Alto', 'Praia de Porto de Galinhas',
    'Praia de Serrambi', 'Praia do Cupe', 'Rurópolis'
  ],
  'Itapissuma': [
    'Botafogo', 'Cajueiro', 'Centro', 'Grêmio', 'Loteamento Cidade Industrial', 'Mangabeira', 'São Gonçalo'
  ],
  'Jaboatao dos Guararapes': [
    'Barra de Jangada', 'Bulhões', 'Cajueiro Seco', 'Candeias', 'Cavaleiro', 'Centro',
    'Comportas', 'Curado I', 'Curado II', 'Curado III', 'Curado IV', 'Dois Carneiros',
    'Engenho Velho', 'Floriano', 'Guararapes', 'Jardim Jordão', 'Jardim Piedade', 'Manassu',
    'Marcos Freire', 'Muribeca', 'Muribequinha', 'Piedade', 'Prazeres', 'Rio das Velhas',
    'Santana', 'Santo Aleixo', 'Socorro', 'Sucupira', 'Vila Rica', 'Vista Alegre', 'Zumbi do Pacheco'
  ],
  'Moreno': [
    'Alta Maternidade', 'Alto da Liberdade', 'Alto de Santo Antônio', 'Alto Liberdade',
    'Alto Santo Antônio', 'Ator Santo Antônio', 'Bela Vista', 'Bonança', 'Centro', 'João Paulo II',
    'Mangueira', 'Moreno', 'Nossa Senhora Conceição', 'Nossa Senhora de Fátima', 'Olaria',
    'Pedreiras', 'Zona Rural'
  ],
  'Oroco': ['Caraíbas', 'Não informado'],
  'Passira': ['Bengalas'],
  'Paulista': [
    'Arthur Lundgren I', 'Arthur Lundgren II', 'Centro', 'Engenho Maranguape', 'Fragoso',
    'Jaguarana', 'Jaguaribe', 'Janga', 'Jardim Maranguape', 'Jardim Paulista', 'Maranguape I',
    'Maranguape II', 'Maria Farinha', 'Mirueira', 'Nobre', 'Nossa Senhora de Conceição',
    'Nossa Senhora do Ó', 'Paratibe', 'Pau Amarelo', 'Tabajara', 'Torres Galvão', 'Outro'
  ],
  'Petrolina': ['Jardim São Paulo'],
  'Salgueiro': ['Água de Meninos', 'Não Informado', 'Nossa Senhora das Graças', 'Nossa Senhora de Fátima'],
  'Sao Caetano': ['Não informado'],
  'Sao Lourenco da Mata': [
    'Não Informado', 'Pau Brasil', 'Santo Aleixo', 'Tiúma', 'Vila da Fábrica', 'Vila do Pau Brasil',
    'Vila Pau Brasil', 'Zona Rural'
  ],
  'Serra Talhada': ['Não informado'],
  'Surubim': ['Não informado'],
  'Vitoria de Santo Antao': ['Não informado']
};

async function main() {
  console.log('🚀 Iniciando SEED COMPLETO (S.O.R.O.)...');

  // 1. CRIAR USUÁRIOS REAIS
  console.log('👤 Criando Usuários...');
  const passwordRaw = '123456';
  const passwordHash = await bcrypt.hash(passwordRaw, 10);

  for (const user of NOVOS_USUARIOS) {
    const userExists = await prisma.user.findUnique({ where: { email: user.email } });
    if (!userExists) {
      await prisma.user.create({
        data: { 
          nome: user.nome, 
          email: user.email, 
          matricula: user.matricula, 
          senha_hash: passwordHash, 
          tipo_perfil: user.perfil, 
          id_unidade_operacional_fk: null 
        }
      });
      console.log(`✅ Usuário criado: ${user.nome}`);
    } else {
      console.log(`⚠️  Usuário já existe: ${user.email}`);
    }
  }

  // 2. CRIAR GRUPAMENTOS
  console.log('🏢 Criando Grupamentos...');
  const grupamentosCriados = [];
  for (const g of GRUPAMENTOS_DATA) {
    const grupamento = await prisma.grupamento.upsert({
      where: { sigla: g.sigla },
      update: {},
      create: { nome_grupamento: g.nome, sigla: g.sigla },
    });
    grupamentosCriados.push(grupamento);
  }

  // 3. CRIAR UNIDADES OPERACIONAIS
  console.log('🏭 Criando Unidades Operacionais...');
  const unidadesCriadas = [];
  let gIndex = 0;
  for (const nomeUnidade of UNIDADES_TXT) {
    // Tenta vincular inteligentemente
    let grupamentoId = grupamentosCriados[gIndex].id_grupamento;
    
    const matchSigla = GRUPAMENTOS_DATA.find(g => nomeUnidade.includes(g.sigla));
    if (matchSigla) {
        const found = grupamentosCriados.find(g => g.sigla === matchSigla.sigla);
        if (found) grupamentoId = found.id_grupamento;
    }

    const unidade = await prisma.unidadeOperacional.create({
      data: {
        nome_unidade: nomeUnidade,
        id_grupamento_fk: grupamentoId,
        endereco_base: 'Endereço padrão (Seed)'
      }
    });
    unidadesCriadas.push(unidade);
    gIndex = (gIndex + 1) % grupamentosCriados.length;
  }

  // 4. CRIAR VIATURAS
  console.log('🚒 Criando Viaturas...');
  let uIndex = 0;
  for (const [tipo, numeros] of Object.entries(VIATURAS_MAP)) {
    for (const numero of numeros) {
      const exists = await prisma.viatura.findUnique({ where: { numero_viatura: numero }});
      if (!exists) {
        await prisma.viatura.create({
          data: {
            tipo_vt: tipo,
            numero_viatura: numero,
            id_unidade_operacional_fk: unidadesCriadas[uIndex].id_unidade
          }
        });
        uIndex = (uIndex + 1) % unidadesCriadas.length;
      }
    }
  }

  // 5. NATUREZAS E GRUPOS E SUBGRUPOS
  console.log('📋 Criando Classificações...');
  
  const naturezasCriadas: Record<string, string> = {}; 
  for (const descNat of NATUREZAS_LIST) {
    const nat = await prisma.natureza.upsert({
        where: { descricao: descNat },
        update: {},
        create: { descricao: descNat }
    });
    naturezasCriadas[descNat] = nat.id_natureza;
  }

  const gruposCriadosIds: string[] = [];
  
  for (const descGrupo of GRUPOS_LIST) {
      let natId = naturezasCriadas['OUTROS'] || Object.values(naturezasCriadas)[0];
      const gUpper = descGrupo.toUpperCase();

      if (gUpper.includes('INCÊNDIO') || gUpper.includes('FOGO')) natId = naturezasCriadas['INCÊNDIO'];
      else if (gUpper.includes('EMERGÊNCIA') || gUpper.includes('ACIDENTE') || gUpper.includes('TRAUMA') || gUpper.includes('VÍTIMA')) natId = naturezasCriadas['APH'];
      else if (gUpper.includes('SALVAMENTO') || gUpper.includes('RESGATE') || gUpper.includes('BUSCA')) natId = naturezasCriadas['SALVAMENTO'];
      else if (gUpper.includes('PREVENÇÃO')) natId = naturezasCriadas['PREVENÇÃO'];
      else if (gUpper.includes('ATIVIDADE') || gUpper.includes('APOIO')) natId = naturezasCriadas['ATIVIDADE COMUNITÁRIA'];
      else if (gUpper.includes('VAZAMENTO') || gUpper.includes('EXPLOSÃO')) natId = naturezasCriadas['PRODUTOS PERIGOSOS'];

      const grupo = await prisma.grupo.create({
          data: { descricao_grupo: descGrupo, id_natureza_fk: natId }
      });
      gruposCriadosIds.push(grupo.id_grupo);
  }

  let grpIndex = 0;
  for (const descSub of SUBGRUPOS_LIST) {
      const targetGrupoId = gruposCriadosIds[grpIndex]; 
      
      await prisma.subgrupo.create({
          data: { descricao_subgrupo: descSub, id_grupo_fk: targetGrupoId }
      });
      grpIndex = (grpIndex + 1) % gruposCriadosIds.length;
  }

  // 6. MUNICÍPIOS E BAIRROS
  console.log('🌍 Criando Municípios e Bairros...');
  for (const [municipioNome, bairros] of Object.entries(MUNICIPIOS_BAIRROS)) {
    const municipio = await prisma.municipio.upsert({
      where: { nome_municipio: municipioNome },
      update: {},
      create: { nome_municipio: municipioNome }
    });

    for (const bairroNome of bairros) {
        const bairroExists = await prisma.bairro.findFirst({ where: { nome_bairro: bairroNome }});
        if (!bairroExists) {
            await prisma.bairro.create({
                data: {
                    nome_bairro: bairroNome,
                    id_municipio_fk: municipio.id_municipio
                }
            });
        }
    }
  }

  console.log('✅ Seed completo finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });