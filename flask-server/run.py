import sys
import os
import flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin
from .environment.TicTacToe import TicTacToe
from .agent.AlphaTicTacToe import Agent

import torch
import torch.nn as nn
import torch.nn.functional as F

# Objeto persistente do servidor
app  =  flask.Flask(__name__)

# Path do arquivo atual
pwd  =  os.path.dirname(__file__)

# Verifica a disponibilidade de GPU (CUDA), se não tiver, usa CPU
# Verifica se existe GPU ativa
isGpu    =  torch.cuda.is_available()

# Determina o dispositivo (GPU ou CPU)
device   =  torch.device("cuda" if isGpu else "cpu")

# Instancia o agente
app.agent  =  Agent( device )

# Faz o carregamento do modelo treinado
app.agent.loadModel( "/".join([pwd, 'model/AlphaTicTacToe.pth']) )

# Instancia o ambiente
app.game = TicTacToe({
    "rewardInvalidStep": -1,
    "rewardNegative": -1,
    "rewardPositive": 1,    
    "rewardDraw": 0
})

# Variáveis de cors
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.secret_key = 'Up3429B1S11mP619fjgueYofmsaSAcM37jvXF'
app.config['SESSION_TYPE'] = 'filesystem'



@app.route('/api/v1/savemodel', methods=['GET'])
@cross_origin()
def save_model():
    app.game.save_model()
    return jsonify({"error": False})

@app.route('/api/v1/newgame', methods=['GET'])
@cross_origin()
def new_game():
    app.game.newGame()
    return jsonify({"error": False})

@app.route('/api/v1/step', methods=['POST'])
@cross_origin()
def step():

    response =  {}
    data     =  request.get_json(force=True)
    mode     =  data["mode"]
    player   =  data["player"]
    done     =  True

    response["direction_winner"] = 0
    response["winner"] = ""

    if mode == 1:
        action   =  data["last_action"]
        # IA vs Human Player
        _, _, done  =  app.game.step(action, player='O')        
        if not done:

            # Obtem o estado atual
            state    =  app.game.getObservable()

            # A rede neural retorna a melhor ação para essa jogada
            action  =  app.agent.selectAction( state )

            # Executa a ação
            _, _, done = app.game.step(action, player="X")

            # Seta a ação
            response["action"] = action

    response["table"]  =  app.game.getObservable().tolist()            
    if done:
        response["direction_winner"]  =  app.game.getWinnerDirection()
        response["winner"] = 1 #app.game.getWinner()
    response["done"]  =  done
    return jsonify(response)

app.run(debug=True, host="0.0.0.0", port=3001)