FROM ubuntu:20.04

USER root

# Install Python
RUN apt update -y && \
	apt install git curl python3 python3-dev python3-pip -y --no-install-recommends

# Install python packages
RUN pip3 install --upgrade pip
RUN pip3 install torch==1.10.1 torchvision==0.11.2 torchaudio==0.10.1 -f https://download.pytorch.org/whl/torch_stable.html
RUN pip3 install numpy \
				 Flask \
				 Flask-Cors \
				 tqdm \
				 pillow

# Install Node.js
ENV NODE_VERSION=16
RUN apt update -y
RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
RUN apt install -y nodejs --no-install-recommends

# Seta o diretório de trabalho
RUN mkdir /home/node
WORKDIR /home/node

# Copia o entrypoint
COPY entrypoint.sh /home/node/entrypoint.sh
RUN chmod +x /home/node/entrypoint.sh