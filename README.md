# Seringa de Massinha

Simulador interativo para apresentação em sala de aula: uma seringa cheia de massinha de modelar que, ao ser apertada, faz a massinha sair no formato do bico escolhido.

## Historinha

Ao abrir a página, começa uma historinha que apresenta a extrusão. Depois do **COMEÇAR**, você escolhe o aluno: Lívia, Lídia, Davi, Eduarda ou Marcele. O aluno, estudante de Engenharia de Produção da UFC, campus Russas, tem dúvida sobre o processo. O professor Pedro explica com a seringa de massinha e depois liga cada parte ao processo industrial: o êmbolo é o pistão, a massinha é o material e o bico é a matriz.

- A página abre numa tela inicial, como a de um jogo, com a frase "Extrusão, Tópicos de Fabricação - UFC" e o botão **COMEÇAR**. O clique é necessário porque o navegador só deixa o som tocar depois de uma interação.
- Na tela inicial toca uma musiquinha baixa, gerada pelo próprio navegador. Ela começa no primeiro clique ou tecla na página e para quando a história começa.
- O aluno usa a farda branca da UFC e o professor, camisa social com crachá. As falas usam as vozes do navegador em português: voz masculina para o Davi e o professor Pedro (com tons diferentes) e feminina para as alunas.
- A aparência de cada aluno fica no começo de `historia.js` (`ALUNOS`): pele, tipo e cor do cabelo, óculos e altura.
- O botão do alto-falante, no canto de baixo à esquerda, liga e desliga o som (falas e música). A escolha fica salva no navegador.
- Depois do **Começar**, a história segue sozinha: cada fala começa 1 s depois que a anterior termina.
- Antes do simulador, a história para e mostra **Ir para o simulador**. No simulador, quem controla é você; nada avança sozinho. Para seguir, clique em **Continuar a história**. Essas são as únicas ações pedidas depois do **COMEÇAR**.
- **Pular história** vai direto para o simulador. Para ver a história de novo, recarregue a página.

## Como usar

Abra o `index.html` no navegador (não precisa instalar nada).

- **Segure para apertar** (ou segure a barra de espaço): o êmbolo desce e a massinha sai.
- **Bico da seringa**: estrela, círculo, coração, quadrado, triângulo, fita ou cruz (teclas 1 a 7).
- **Cor da massinha**: seis cores.
- **Encher de novo** (tecla R): recomeça.
- **Tela cheia**: para mostrar no projetor.

Trocar o bico ou a cor muda o formato e a cor de toda a massinha.

## Arquivos

- `index.html`: estrutura da página
- `style.css`: visual (tema claro e escuro)
- `script.js`: desenho da cena no `<canvas>` e animação
- `historia.js`: roteiro e animação da historinha
- `favicon.svg`: ícone da aba

Sem internet, tudo funciona; só a fonte dos textos troca por uma do sistema.
