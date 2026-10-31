# Seringa de Massinha

Simulador interativo para apresentação em sala de aula: uma seringa cheia de massinha de modelar que, ao ser apertada, faz a massinha sair no formato do bico escolhido.

## Historinha

Ao abrir a página, começa uma historinha que apresenta a extrusão. O João, estudante de Engenharia de Produção da UFC, campus Russas, tem dúvida sobre o processo. A Maria explica com a seringa de massinha e depois liga cada parte ao processo industrial: o êmbolo é o pistão, a massinha é o material e o bico é a matriz.

- Clique na cena, em **Próximo**, ou aperte Enter ou → para avançar. A tecla ← volta.
- Na parte da seringa, aperte até a massinha sair para aparecer o **Continuar**.
- **Pular história** vai direto para o simulador. **Ver história** recomeça do início.

## Como usar

Abra o `index.html` no navegador (não precisa instalar nada).

- **Segure para apertar** (ou segure a barra de espaço): o êmbolo desce e a massinha sai.
- **Bico da seringa**: estrela, círculo, coração, quadrado, triângulo, fita ou cruz (teclas 1 a 7).
- **Cor da massinha**: seis cores.
- **Apertar tudo**: esvazia a seringa sozinha.
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
