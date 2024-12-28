# Running Ollama

Ollama is an AI service to run locally.

## Docker compose

```yaml
version: '3'
services:
  ollama:
    image: ollama/ollama:rocm
    volumes:
      - ollama:/root/.ollama
    ports:
      - "11434:11434"
    devices:
      - "/dev/kfd:/dev/kfd"
      - "/dev/dri:/dev/dri"

volumes:
  ollama:
```

## Docker run

```bash
sudo docker compose up -d
```

## Check if the instance is running

```bash
curl http://localhost:11434
```

Will return:

```bash
Ollama is running
```

## Execute a LLM
    
```bash
sudo docker exec -it ollama-ollama-1 ollama run llama2
```

## Integrating with vscode plugin

```json
{
    "ollama.server": "http://localhost:11434"
}
```
