import numpy as np
import random

class TicTacToe:
    def __init__(self, config: dict) -> None:
        """
        Inicia a classe do game
            Arguments:
                Dictionary config: Configurações do ambiente do jogo
            Returns:
                None
        """

        # Configurações do game
        self.config  =  config

        # Quantidade de jogadas por partida
        self.played  =  0     

        # Matriz da partida
        self.game    =  None

        # Situação do game
        self.done  =  True

        # Total de ações possíveis no game
        self.actionSpace  =  9

        # Chances de vencer
        self.chancesWinning = 0

        # Chances de perder
        self.chancesLoss    = 0

        # Direção em que o player ganhou no tabuleiro 
        self.winnerDirection =  -1

        # Represeta os jogadores na partida
        self.pX      =  1
        self.pO      =  2

    def newGame(self) -> np.ndarray:
        """
        Inicia uma nova partida
            Returns:
                np.ndarray
        """

        # Seta que o game não terminou
        self.done    =  False

        # Gera a matriz do game
        self.game    =  np.zeros(9).astype(int)

        # Reseta a quantidade de jogadas para zero
        self.played  =  0

        # Retorna a matriz do game
        return self.getObservable()

    def getObservable(self) -> np.ndarray:
        """
        Retorna a matriz atual do game
            Returns:
                np.ndarray
        """

        # Retorna o estado
        return self.game        

    def getActionSpace(self) -> int:
        """
        Retorna a quantidade de ações validas no game
            Returns:
                Int
        """        
        # Retorna o total de ações possíveis no game
        return self.actionSpace

    def getAction(self, randomAction: bool = True) -> int:
        """
        Retorna uma ação para o ambiente
            Arguments:
                Bool randomAction: Se a ação será gerada de forma randômica
                                True  - Ação randômica
                                False - Ação baseada em movimentos válidos
            Returns:
                Int
        """

        # Verifica se a opção
        if randomAction:

            # Gera a ação
            return random.randrange( self.spaceAction )

        # Retorna uma ação baseada em movimentos válidos
        return random.choice( self.getOnlyValidAction() )

    def getOnlyValidAction(self) -> list:
        """
        Retorna somente os locais válidos para jogar
        Returns:
            List
        """

        # Lista com ações validas
        valid = []

        # Contador da lista
        j = 0

        # Loop na matriz do jogo
        for i in self.game:
            
            # Verifica as posições validas
            if i == 0:

                # Coloca o item na lista
                valid.append(j)

            # Incrementa o contador
            j += 1

        # Retorna a lista com as ações válidas
        return valid
    
    def checkWinner( self, player: str ) -> bool:
        """
        Verifica se a partida tem um vencedor
            Arguments:
                Str player: Usuário que será verificado
            Returns:
                Bool
        """

        # Obtem o valor do player repsentado na matriz
        p = self.pX if player == 'X' else self.pO      

        # Formata o tabuleiro de 1 dimensão para 8 dimensões
        for board in self.getGameBoard():

            # Aplica a função que não considera itens repetidos e retorna os itens encontrados
            data = list(set( board ))

            # Incrementa o flag que indica qual a direção que o player venceu
            self.winnerDirection +=  1

            # Verifica se a lista contém apenas 1 valor e se esse valor é igual ao valor de "p"
            # se sim, significa que nas 3 posições da matriz, só existe 1 valor, que nesse caso seria o valor de "p"
            if len(data) == 1 and data[0] == p:

                # Seta a partida como terminada
                self.done  =  True

                # Significa que o player venceu o jogo
                return self.done

        # Reseta a direção de vitória
        self.winnerDirection  =  -1

        # Retorna o status da partida
        return self.done
    
    def getWinnerDirection(self) -> int:
        """
        Retorna a direção vencedora no tabuleiro
            Returns:
                Int
        """        
        return self.winnerDirection    
    
    def getGameBoard(self) -> np.ndarray:
        """
        Retorna o tabuleiro do game com as linhas horizontais,
        verticais e diagonais em uma matriz 8x3
            Returns:
                np.ndarray
        """

        # Adiciona a tabela
        board  =  self.game

        # Seta as colunas
        board  =  np.append( board, self.game[[0,3,6]])
        board  =  np.append( board, self.game[[1,4,7]])
        board  =  np.append( board, self.game[[2,5,8]])

        # Seta as diagonais
        board  =  np.append( board, self.game[[0,4,8]])
        board  =  np.append( board, self.game[[2,4,6]])

        # Retorna o np.ndarray
        return board.reshape(8, 3)
    
    def checkChancesWinning(self, player: str) -> int:
        """
        Verifica se o player tem chances claras de vencer na partida
            Arguments:
                Str player: Usuário que será verificado
            Returns:
                Int
        """

        # Inicializa as chances
        chances  =  0

        # Obtem o valor do player repsentado na matriz
        p = self.pX if player == 'X' else self.pO      

        # Formata o tabuleiro de 1 dimensão para 8 dimensões
        for board in self.getGameBoard():

            # Aplica a função que não considera itens repetidos e retorna os itens encontrados
            data = list(set( board ))

            # Verifica se a lista contém apenas 2 valores e se o segundo indice é igual ao valor de "p"
            if len(data) == 2 and data[0] == 0 and data[1] == p:

                # Incrementa as chances de vitória
                chances  +=  1

        # Retorna as chances
        return chances
    
    def getReward(self, player: str) -> float:
        """
        Calcula a recomensa que o ambiente vai retornar com base na ação executada pelo player
            Arguments:
                Str player: Usuário que executou a ação
            Returns:
                Float
        """

        # Define o fator de perda
        factorLoss  =  0.5

        # Define o fator de vitória
        factorwinn  =  0.3

        # Determina o player atual
        currPlayer  =  self.pX if player == 'X' else self.pO

        # Determina o player adversário
        oppoPlayer  =  self.pO if player == 'X' else self.pX

        # Calcula as chances do player atual vencer
        chancesWinning  =  self.checkChancesWinning( currPlayer )

        # Calcula as chances do player adversário de vencer
        chancesLoss     =  self.checkChancesWinning( oppoPlayer )

        # Verifica se as chances de perder existem
        if chancesLoss > 0:

            # Se existirem, calcula a recompensa com base nas chances de vitória, derrota e os fatores
            return (factorLoss*(self.chancesLoss*-1))+(factorwinn*(self.chancesWinning)) + (factorLoss*(chancesLoss*-1))+(factorwinn*(chancesWinning))
        elif self.chancesLoss == 1 and chancesLoss == 0:

            # Chances de derrota antes da ação era 1 e agora é nenhuma, calcula a recompensa
            return ((factorLoss*(self.chancesLoss*-1)+1)+(factorwinn*self.chancesWinning)) + ((factorLoss*(chancesLoss*-1))+((factorwinn*chancesWinning)+(factorwinn*-1)))

        # Se não entrar em nenhum dos ifs, retorna a recompensa com a nova formula
        return (factorLoss*(chancesLoss*-1))+(factorwinn*chancesWinning)

    def getGameStatus(self) -> bool:
        """
        Verifica se a partida já terminou com base na quantidade de ações executadas no ambiente
            Returns:
                Bool
        """

        # Verifica se a quantidade de ações executadas é igual a quantidade total de ações disponíveis no ambiente
        if self.played == self.actionSpace:

            # Se sim, seta como true
            self.done = True

        # Retorna o status
        return self.done
    
    def checkPlayerWinner(self, player: str) -> list:
        """
        Verifica se a partida tem um vencedor
            Arguments:
                Str player: Usuário a ser verificado
            Returns:
                List
        """

        if self.checkWinner( player ):
            
            # Player venceu
            return [self.getObservable(), self.config['rewardPositive'], self.done]            
        elif self.getGameStatus():

            # Empate
            return [self.getObservable(), self.config['rewardDraw'], self.done]

        # Ninguém venceu e o jogo não terminou
        return [self.getObservable(), self.getReward( player ), self.done]

    def step(self, action: int, player: str) -> list:
        """
        Executa as jogadas na partida atual
            Arguments:
                Int action: Ação executada no ambiente
                Str player: Player que executa a ação
            Returns:
                List
        """

        # Determina o jogador
        p   =  self.pX if player == 'X' else self.pO

        # Incrementa a quantidade de jogadas na partida
        self.played += 1

        # Verifica se é uma ação valida
        if self.game[action] == 0:

            # Determina o player atual
            currPlayer  =  self.pX if player == 'X' else self.pO

            # Determina o player adversário            
            oppoPlayer  =  self.pO if player == 'X' else self.pX

            # Calcula as chances do player atual vencer
            self.chancesWinning  =  self.checkChancesWinning( currPlayer )

            # Calcula as chances do player adversário de vencer
            self.chancesLoss     =  self.checkChancesWinning( oppoPlayer )
            
            # Faz a jogada na posição da matriz
            self.game[action]    =  p   

            # Retorna o status
            return self.checkPlayerWinner( player )

        # Finaliza o jogo
        self.done = True

        # Movimento inválido
        return [self.getObservable(), self.config['rewardInvalidStep'], self.done]

    def render(self) -> str:
        """
        Retorna o tabuleiro do game
            Returns:
                Str
        """

        # Game atual
        data = ''

        # Separador
        separator   = ''

        # Formata a matriz do game para 3x3
        for board in self.game.reshape(3, 3):

            # Quebra linha
            data += '\n'

            # Contador
            j = 0

            # Loop na linha atual
            for i in board:

                # Seta o separador
                separator = ' | ' if j < 2 else ''

                # Se for X, seta ele e o separador
                if i == self.pX:
                    # Seta o dado
                    data += 'X'+separator
                elif i == self.pO:

                    # Seta o dado
                    data += 'O'+separator
                else:

                    # Seta o dado
                    data += ' '+separator

                # Incrementa o contador
                j += 1
        
        # Retorna
        return data