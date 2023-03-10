import asyncio
import argparse
import os

from trainml.trainml import TrainML

parser = argparse.ArgumentParser(
    description="Large Language Model (LLM) Endpoint Example"
)

parser.add_argument(
    "--endpoint-type",
    choices=["completion", "summarization"],
    default="completion",
    help="The type of interaction to deploy as an endpoint",
)

parser.add_argument(
    "--model-type",
    choices=["bloomz-7b1", "gpt-j-6b", "gpt-j-6b-float16", "gpt-neox-20b"],
    default="gpt-neox-20b",
    help="The language model checkpoint to use",
)
parser.add_argument(
    "--gpu-count",
    type=int,
    default=2,
    help="Number of GPUs to attach (max 4)",
)


async def create_endpoint(trainml, endpoint_type, model_type, gpu_count):
    if endpoint_type == "summarization":
        routes = [
            dict(
                path=f"/{endpoint_type}",
                verb="POST",
                function=endpoint_type,
                file="endpoint",
                positional=True,
                body=[
                    dict(
                        name="question",
                        type="str",
                    ),
                    dict(name="text", type="str"),
                ],
            )
        ]

    else:
        routes = [
            dict(
                path=f"/completion",
                verb="POST",
                function="completion",
                file="endpoint",
                positional=True,
                body=[
                    dict(
                        name="prompt",
                        type="str",
                    ),
                    dict(
                        name="max_tokens",
                        type="int",
                    ),
                    dict(
                        name="temperature",
                        type="float",
                    ),
                    dict(
                        name="top_p",
                        type="float",
                    ),
                    dict(
                        name="stop",
                        type="list",
                    ),
                ],
            ),
            dict(
                path=f"/chat",
                verb="POST",
                function="chat",
                file="endpoint",
                positional=True,
                body=[
                    dict(
                        name="messages",
                        type="list",
                    ),
                    dict(
                        name="max_tokens",
                        type="int",
                    ),
                    dict(
                        name="temperature",
                        type="float",
                    ),
                    dict(
                        name="top_p",
                        type="float",
                    ),
                    dict(
                        name="stop",
                        type="list",
                    ),
                ],
            ),
        ]

    job = await trainml.jobs.create(
        "LLM Endpoint Example",
        type="endpoint",
        gpu_types=["rtx3090"],
        gpu_count=gpu_count,
        disk_size=10,
        endpoint=dict(routes=routes),
        model=dict(
            source_type="git",
            source_uri="https://github.com/trainML/llm-endpoint-example.git",
            checkpoints=[dict(id=model_type, public=True)],
        ),
        environment=dict(
            type="DEEPLEARNING_PY39",
            env=[
                dict(key="ENDPOINT_TYPE", value=endpoint_type),
                dict(key="MODEL_TYPE", value=model_type),
            ],
        ),
    )
    return job


if __name__ == "__main__":
    args = parser.parse_args()
    trainml = TrainML()
    job = asyncio.run(
        create_endpoint(
            trainml,
            args.endpoint_type,
            args.model_type,
            args.gpu_count,
        )
    )
    print("Created Endpoint: ", job.id, " Waiting to Start...")
    asyncio.run(job.wait_for("running"))
    print("Job ID: ", job.id, " Running")
    print("URL", job.url)
