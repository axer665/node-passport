#### Разработка в контейнере

- docker run -it --rm --name dev_books -w /app -v "%cd%":/app -e PORT=3002 -p 80:3002 node:20.10 /bin/bash
- docker run -it --rm --name dev_books -w /app -v "%cd%":/app -e PORT=3002 -p 80:3002 node:20.10 npm run dev  
