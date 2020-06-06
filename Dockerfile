FROM ubuntu
RUN apt-get update
RUN apt upgrade -y
RUN apt install -y curl
RUN apt-get install -y build-essential
# nodejs
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN npm config set registry https://registry.npm.taobao.org
# git and zsh
RUN apt install -y git
RUN apt install -y zsh
RUN apt-get install -y powerline fonts-powerline
# softwares
RUN mkdir /softwares
WORKDIR /softwares
# redis
RUN curl -O http://download.redis.io/releases/redis-5.0.7.tar.gz
RUN tar xzf redis-5.0.7.tar.gz
WORKDIR redis-5.0.7
RUN make
RUN src/redis-server --daemonize yes
# oh my zsh
WORKDIR /softwares
COPY zsh.sh /softwares/
RUN chmod u+r+x zsh.sh
RUN sh -c ./zsh.sh
RUN chsh -s /bin/zsh
# 创建工作目录
RUN mkdir /workspace
WORKDIR /workspace
# COPY coder ./coder
# 工作
# WORKDIR /workspace/coder
# RUN npm install
# 
RUN echo "hello"