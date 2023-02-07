import numpy as np
import torch
import torch
import torch.nn.functional as F
from .NeuralNetwork import NeuralNetwork

class Agent:
    def __init__(self, device: torch.device ) -> None:
        '''
        Seta o dispositivo e instancia a rede neural
            Arguments:
                torch.device device: Dispositivo que será usado para computar a rede neural (GPU ou CPU)
        '''

        # Seta o dispositivo
        self.device = device

        # Define o modelo
        self.policy_net = NeuralNetwork().to( self.device )

    def loadModel(self, model: str) -> None:
        '''
        Faz o carregamento de um modelo pré treinado
            Arguments:
                model: Caminho para o modelo
        '''

        # Faz o carregamento de um modelo pré treinado
        self.policy_net.load_state_dict( torch.load( model ))

    def selectAction(self, s: np.ndarray) -> int:
        '''
        Determina uma ação com base na rede neural
            Arguments:
                np.ndarray s: Estado atual do ambiente
            Returns:
                Int
        '''

        # Prepara o tensor para o formato esperado pela rede neural
        state = self.prepareStateTensor( s )

        # Sem computar gradientes
        with torch.no_grad():

            # t.max(1) retorna o maior valor da coluna de cada linha
            # a segunda coluna no resultado máximo é o índice de onde o elemento máximo estava
            # então escolhemos a ação com a maior recompensa esperada.
            action = self.policy_net(state).max(1)[1].view(1, 1)

            # Retorna a ação
            return action.item()

    def prepareStateTensor(self, s: np.ndarray ) -> torch.tensor:
        '''
        Retorna o tensor no padrão suportado pelo modelo
            Arguments:
                np.ndarray s: Estado do ambiente
            Returns:
                torch.tensor              
        '''

        # Cria o tensor a partir de um array numpy
        state  =  torch.from_numpy( s ).to(self.device, dtype=torch.long)

        # Aplica o One Hot
        state  =  F.one_hot(state, num_classes=3).to(dtype=torch.float32)

        # Retorna o tensor
        return torch.reshape(state, (-1,)).unsqueeze(0)