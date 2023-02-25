# Jogo da velha com I.A.
#### Uma implementação com Pytorch
<br />

Usando **aprendizagem por reforço**, treinei um agente imbatível para jogar o jogo da velha.
<br />

Como você deve saber, o jogo da velha não é complexo, ele é relativamente simples. Então, para a minha primeira implementação prática com redes neurais, eu escolhi o jogo da velha.
<br />

## Como funciona ?

### Ambiente
O **ambiente** simula o jogo usando uma matriz simples de 9 posições.
O Jogador **X** é representado pelo número ``1``
O Jogador **O** é representado pelo número ``2``
Vazio é representado pelo número `0`

#### Ação e jogador
* A ação é um inteiro entre 0 e 8
* O jogador é **X** ou **O**

##### Ações dentro do ambiente
* O espaço de ações dentro do ambiente é de tamanho ``9`` (0-8)
* Se enviar uma ação fora do espaço previsto, perde a partida
* Se enviar uma ação em um local já ocupado, perde a partida

#### Iniciando a partida e enviando ações
```python
# Define o jogador
player =  'X'

# Define a ação
action =   4

# Instancia o game
env    =  TicTacToe( config )

# Inicia uma nova partida e recebe o estado atual (Matriz em branco)
state  =  env.newGame()

# Envia a ação e retorna o estado atual, recompensa e um flag se o game terminou
next_state, reward, done  = env.step(action, player)
```

#### Retornos
* `next_state`: Uma matriz de 9 posições, é o tabuleiro atual da partida do jogo
* `reward`: Recompensa recebida com base na ação executada no ambiente
* `done`: flag boleano que indica se a partida finalizou (False - A partida não terminou)

#### Como são calculadas as recompensas ?
Eu "patinei" bastante nessa questão, a modelagem das recompensas que o ambiente retorna é crucial para permitir que o modelo aprenda e evolua, se tornando cada vez melhor.

Então, as recompensas estão baseadas na seguinte equação:
`reward = (fatorPerda*(chancesDePerder*(-1)))+(fatorVitoria*chancesVitoria)`

* **fatorPerda**: É uma constante de valor `0,7`
* **fatorVitoria**: É uma constante de valor `0,3`
* **chancesDePerder**: Quantidade de locais em que o jogador atual pode perder
* **chancesVitoria**: Quantidade de locais em que o jogador atual pode ganhar e finalizar a partida


### Agente
O agente se chama `AlphaTicTacToe`, ele foi treinado sem nenhum conhecimento prévio do jogo.

#### Rede Neural
O agente é implementado com uma rede neural densa (totalmente conectada).
Com o total de 4 camadas, 1 de entrada, 2 camadas ocultas e 1 comada de saída, a estrutura fica da seguinte forma:
```python
----------------------------------------------------------------
        Layer (type)               Output Shape         Param #
================================================================
            Linear-1              [-1, 1, 1024]          28,672
            Linear-2               [-1, 1, 512]         524,800
            Linear-3               [-1, 1, 256]         131,328
            Linear-4                 [-1, 1, 9]           2,313
================================================================
Total params: 687,113
Trainable params: 687,113
Non-trainable params: 0
----------------------------------------------------------------
Input size (MB): 0.00
Forward/backward pass size (MB): 0.01
Params size (MB): 2.62
Estimated Total Size (MB): 2.63
----------------------------------------------------------------
None
```

Acredito que a estrutura da rede neural atualmente está inflada, acredito que podemos resolver o problema do jogo com menos neurônios e até mesmo uma camada oculta.
Vou deixar a otimização para depois, mas a ideia é ir melhorando cada vez mais o modelo

#### Treinamento
Se você chegou até aqui, vou assumir que você leu todo o texto acima e deve ter notado que eu disse que o ambiente (jogo), retorna uma matriz de 9 posições, porém, a camada de entrada de rede neural tem 27 neurônios, e você deve estar se perguntando o motivo hehe.
Depois de testar inúmeras implementações, os testes corroboram que mandar a matriz de 9 posições não faz a rede neural aprender como eu espero que ela aprenda, então busquei novas técnicas e a que funcionou perfeitamente foi o `one hot encoding`.

Para entender como funciona o one hot encoding, deixo o artigo do Arthur Lamblet [One-hot-encoding, o que é?](https://arthurlambletvaz.medium.com/one-hot-encoding-o-que-%C3%A9-cd2e8d302ae0)

Então, como você deve ter lido no começo da documentação, a matriz tem 9 posições, e os valores 0, 1 e 2, para representar vazio, player X e player O.
Logo, temos 3 classes diferentes e com isso 9*3 == 27, por esse motivo temos 27 entradas na nossa rede neural.

Ainda não é tudo, no treinamento, existe um método que tem como objetivo avaliar a ação do jogador com base nas ações do oponente.
Se o oponente fizer boas ações, as ações do oponente vão reduzir a recompensa do agente, mesmo que para o ambiente, o agente tenha feito bons movimentos.

Essa avaliação dos movimentos, é feita apenas no final de cada partida, onde temos todos os movimentos que levaram a partida a terminar.

```python
def avaliaJogadas(jogadas):
    for i in reversed(range(len(jogadas))):
        if i < len(jogadas)-1:
            jogadas[i] += jogadas[i+1]*(-1)
    return jogadas
```
Então, basicamente, se a jogada do oponente for boa, a jogada do agente será considerada não tão boa, podendo ficar até negativa, dependendo da recompensa recebida do ambiente

#### Replay de experiência
No treinamento do agente, existe um repositório de ações, estados e recompensas.
Esse "replay" é usado para treinar o agente com situações que ele já passou, com as ações que ele já executou, com isso o agente consegue aprender quais as ações são boas e quais as ações são ruins.

##### Epsilon Ganancioso (Epsilon e-Greedy)
O agente trabalha com um valor de epsilon que decai cada vez que o agente tem que tomar uma ação, porém, existem 2 conceitos que em português são bem confusos a tradução, então vou manter em inglês mesmo para facilitar a explicação e o seu entendimento.
* Exploitation
	* Com base em uma condição satisfeita, o agente tem que escolher uma ação, onde no nosso caso, é uma ação no intervalo de 0-8. O Agente tem uma lista com as ações disponíveis na partida atual, sem levar em consideração nenhuma estratégia, o agente simplesmente seleciona uma ação válida para a partida atual.
* Exploration
	* Nesse caso, quem toma a ação é a rede neural, com base em tudo que ela já tem treinado, ela sugere uma ação. Se estiver no começo do treinamento, isso vai resultar em uma ação ruim ou muito ruim (jogar em casa já ocupada), o que resulta em uma recompensa ruim e a recompensa pela ação será ainda pior com a avaliação com base na jogada do oponente (Se existir jogada anterior)

Abaixo um trecho do código do agente e como ele toma a decisão se vai fazer `Exploitation` ou `Exploration`
```python

# Obtém um valor randômico
sample = random.random()

# Calcula o valor de eps limite (threshold)
eps_threshold = self.epsEnd + (self.epsStart - self.epsEnd) * \
			    math.exp(-1. * self.stepDone / self.epsDecay)

# Incremente as jogadas
self.stepDone += 1

# Verifica a proposta do epsilon e-greedy
if sample > eps_threshold:
	with torch.no_grad():
		# Exploration
		return self.policy_net(state).max(1)[1].view(1, 1)
else:
	# Exploitation
	return torch.tensor([[random.choice( actions )]], device=self.device, dtype=torch.long)
```

##### Otimizando a rede neural
Agora que vocês entenderam como funciona a estratégia aplicada no treinamento, essa é a equação aplicada para otimizar a rede neural:

$$\underbrace{Q(s,a)}_{\scriptstyle\text{Novo valor de Q}}=\underbrace{Q(s,a)}_{\scriptstyle\text{Valor atual de Q}}+\mkern-56mu\underset{\text{Taxa de aprendizagem}}{\underset{\Bigl|}{\alpha}}\mkern-50mu[\underbrace{R(s,a)}_{\scriptstyle\text{Recompensa}}+\mkern-30mu\underset{\text{Taxa de desconto}}{\underset{\Biggl|}{\gamma}}\mkern-75mu\overbrace{\max Q'(s',a')}^{\scriptstyle\substack{\text{A melhor recompensa, dado} \\ \text{o novo estado e todas as ações possíveis}}}\mkern-45mu-\underbrace{Q(s,a)}_{\scriptstyle\text{Valor atual de Q}}]$$

## Experiências com a implementação
Eu aprendi bastante com esse projeto, por mais simples que seja, a medida que eu treinava o agente, ele começou a apresentar alguns comportamentos que eu não esperava.

### Comportamento 1
O agente aprendia a jogar, mas ainda perdia algumas partidas, ele estava "quase" perfeito.
O agente ficou viciado em ganhar sempre na mesma sequência, ele basicamente ficou viciado em ganhar em apenas uma posição.
Quando o oponente jogava em uma casa onde o agente estava viciado, o agente perdia ou empatava partida.
Como explicado algumas linhas acima, usei para treinar o agente a estratégia de epsilon e-greedy, o valor de epsilon inicial era de 0,9, epsilon decay: 1000 e o epsilon final: 0,3, onde dava cerca de 69% das ações.
Quando entrava no if `Exploitation`, o agente usava o código:
```python

# Gera um valor pseudo randomico
sample = random.random()
eps_threshold = self.epsEnd + (self.epsStart - self.epsEnd) * \
	math.exp(-1. * self.stepDone / self.epsDecay)

# Incremente as jogadas
self.stepDone += 1

# Verifica a proposta do epsilon e-greedy
if sample > eps_threshold:
	# Exploration
	with torch.no_grad():		
		return self.policy_net(state).max(1)[1].view(1, 1)
else:
	# Exploitation
	return torch.tensor([[random.randrange( self.envActionSpace )]], device=self.device, dtype=torch.long)
```
Esse método seleciona uma ação pseudo randômica, onde poderiam ser geradas ações em casas já ocupadas e o que resultava em uma recompensa muito ruim e a perda da partida.

#### Correção
A correção foi enviar uma lista de ações previstas dentro da partida atual e usar uma função para selecionar uma ação
Essa estratégia fez com que o agente consiga testar mais locais no tabuleiro, sem que esse teste gere uma recompensa muito negativa.
O código ficou assim:
```python
...
# actions - Lista com as ações válidas dentro da partida atual
# Explotation
return torch.tensor([[random.choice( actions )]], device=self.device, dtype=torch.long)
```


### Comportamento 2
Imagine o seguinte cenário, onde é a vez do agente (X) jogar:
```text
O |   | O
  | X | X
  |   | X
```
O agente deveria obrigatóriamente vencer a partida, jogando na posição `3`, porém, optava por jogar na posição `1`.
Eu me perguntava, mas porque esse comportamento, sendo que a vitória iria dar a ele uma recompensa maior do que bloquear o oponente ?
A resposta veio no método `store`, onde ele armazena os estados, ação, recompensa e o flag de termino:
```python
def store(self, state, nextState, action, reward, done):
	# Transforma para tensor
	reward = torch.tensor([reward], device=self.device)

	# Verifica se a partida terminou
	if done:
		# Se sim, seta como None o próximo estado
		next_state = None
	else:
		# Se não, transforma o
		next_state = torch.tensor(nextState, dtype=torch.float32, device=self.device).unsqueeze(0)
		
	# Store the transition in memory
	self.memory.push(state, action, next_state, reward)
```
Perceba que esse código verifica se a partida terminou, se terminou, adiciona None ao next_state.
Na rotina que otimiza a rede neural, o estado com valor None recebe 0 como sendo a melhor recompensa, porém o bloqueio do oponente na partida, recebe uma recompensa maior que 0, devido a esse equivoco na hora de armazenar os estados, o agente optava por bloquear o oponente, mesmo quando ele podia vencer a partida.

#### Correção
O problema foi corrigido considerando todos os estados terminais
```python
def store(self, state, nextState, action, reward, done):
	# Transforma para tensor
	reward = torch.tensor([reward], device=self.device)

	next_state = torch.tensor(nextState, dtype=torch.float32, device=self.device).unsqueeze(0)
		
	# Store the transition in memory
	self.memory.push(state, action, next_state, reward)
```

## Como rodar isso na sua máquina ?
Treinei 2 modelos, um deles com suporte a a `GPU (CUDA)` e outro com suporte `CPU`
Se você não tem uma GPU nvidia com a API cuda instalada, não tem problema, você também vai conseguir rodar esse código.
### Requisitos
Git
Linux: [Docker para Linux](https://docs.docker.com/desktop/install/linux-install/)
Windows: [Docker para Windows](https://docs.docker.com/desktop/install/windows-install)

### Executando
Depois que você instalou o docker, hora de baixar o código para o seu caso.
#### CPU
``` 
git clone --branch cpu https://github.com/adaoduque/pytorch-tictactoe.git
```
#### GPU
``` 
git clone https://github.com/adaoduque/pytorch-tictactoe.git
```

Depois de clonado, navegue até o diretório do projeto e execute:
```bash
docker-compose up --build
```

#### Testando
Aguarde a mensagem
```text
...
tictactoe-ai  |  * Running on all addresses (0.0.0.0)
tictactoe-ai  |  * Running on http://127.0.0.1:3001
...
tictactoe-ai  | You can now view tic-tac-toe in the browser.
tictactoe-ai  |
tictactoe-ai  |   Local:            http://localhost:3000
...
```
Se tudo correu bem, acesse o jogo no seu navegador:
```txt
http://localhost:3000/tic-tac-toe
```