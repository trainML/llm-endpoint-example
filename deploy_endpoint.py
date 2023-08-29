import asyncio
import argparse

from trainml import TrainML

parser = argparse.ArgumentParser(
    description="Large Language Model (LLM) Endpoint Example"
)

parser.add_argument(
    "--model",
    choices=[
        "Llama-2-7b-chat-hf",
        "Llama-2-13b-chat-hf",
        "falcon-7b-instruct",
    ],
    default="Llama-2-7b-chat-hf",
    help="The language model checkpoint to use",
)
parser.add_argument(
    "--gpu-count",
    type=int,
    default=1,
    help="Number of GPUs to attach (max 4)",
)


async def create_endpoint(trainml, model, gpu_count):
    max_tokens = 4096 if model.startswith("Llama-2") else 2048
    max_input_tokens = int(max_tokens * 0.75)
    job = await trainml.jobs.create(
        "LLM Endpoint Example",
        type="endpoint",
        gpu_types=["rtx3090"],
        gpu_count=gpu_count,
        disk_size=30,
        endpoint=dict(
            start_command=f"--model-id /opt/ml/checkpoint --dtype bfloat16 --trust-remote-code --port 80 --json-output --hostname 0.0.0.0 --max-input-length {max_input_tokens} --max-total-tokens {max_tokens}"
        ),
        model=dict(
            checkpoints=[dict(id=model, public=True)],
        ),
        environment=dict(
            type="CUSTOM",
            custom_image="ghcr.io/huggingface/text-generation-inference:0.9.4",
        ),
    )
    return job


if __name__ == "__main__":
    args = parser.parse_args()
    trainml = TrainML()
    job = asyncio.run(
        create_endpoint(
            trainml,
            args.model,
            args.gpu_count,
        )
    )
    print("Created Endpoint: ", job.id, " Waiting to Start...")
    asyncio.run(job.wait_for("running"))
    print("Job ID: ", job.id, " Running")
    print("URL", job.url)
