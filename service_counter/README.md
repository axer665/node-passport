## Счетчик

#### Разраобтка в контейнере
docker run -it --rm --name dev_counter -w /app -v "%cd%":/app -e PORT=3003 -p 80:3003 node:20.10 /bin/bash

#### Запуск сервиса счетчика в контейнере и redis в контейнере
- cd service_counter
- docker-compose -f docker-compose.dev.yml up -d         // для разработки
- docker-compose -f docker-compose.build.yml up -d       // тест контейнера
- docker-compose up -d                                   // финал