# WebCode Dev

这是 Web Code 的服务端开发项目，提供了基本的文件操作，为隔离一些危险操作，采用 Docker 容器方式运行。

## 使用方法

### 运行容器并进入

1. 安装 `docker` 及 `docker-compose`
2. `$ docker-compose build` 
3. `$ docker-compose up`
4. `$ docker-compose start cli`
5. `$ docker-compose exec cli /bin/zsh`

---

### 容器中运行

1. `$ cd coder`
2. `$ npm install`
3. `$ npm start`

运行后，再启动前端项目即可