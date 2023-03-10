import logging
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    AutoModelForQuestionAnswering,
    GPTNeoXTokenizerFast,
    StoppingCriteria,
    StoppingCriteriaList,
)
import os
import torch
import sys
import re

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler(sys.stderr))

endpoint_type = os.environ.get("ENDPOINT_TYPE") or "completion"
model_type = os.environ.get("MODEL_TYPE") or "gpt-neox-20b"
device_count = torch.cuda.device_count()
model_kwargs = dict(device_map="auto")

if model_type == "gpt-neox-20b":
    if device_count < 4:
        model_kwargs["load_in_8bit"] = True
        if device_count == 2:
            model_kwargs["max_memory"] = {0: "12GB", 1: "20GB"}
    else:
        model_kwargs["max_memory"] = {
            0: "12GB",
            1: "20GB",
            2: "20GB",
            3: "20GB",
        }


if model_type == "gpt-j-6b":
    model_kwargs = dict(torch_dtype=torch.float16)

print(f"{model_kwargs}")

if endpoint_type == "summarization":
    model = AutoModelForQuestionAnswering.from_pretrained(
        os.environ.get("TRAINML_CHECKPOINT_PATH"), **model_kwargs
    )
else:
    model = AutoModelForCausalLM.from_pretrained(
        os.environ.get("TRAINML_CHECKPOINT_PATH"), **model_kwargs
    )

if model_type == "gpt-neox-20b":
    tokenizer = GPTNeoXTokenizerFast.from_pretrained(
        os.environ.get("TRAINML_CHECKPOINT_PATH")
    )
else:
    tokenizer = AutoTokenizer.from_pretrained(
        os.environ.get("TRAINML_CHECKPOINT_PATH")
    )

# ## https://stackoverflow.com/a/72003392/17842013
class KeywordsStoppingCriteria(StoppingCriteria):
    def __init__(self, keywords_ids: list):
        self.keywords = [
            dict(ids=keyword, length=keyword.size()[1])
            for keyword in keywords_ids
        ]

    def __call__(
        self, input_ids: torch.LongTensor, scores: torch.FloatTensor, **kwargs
    ) -> bool:
        for keyword in self.keywords:
            if (input_ids[0][-keyword["length"] :] == keyword["ids"]).all():
                return True
        return False


def completion(prompt, max_tokens=4096, temperature=1, top_p=1, stop=["\n"]):
    print(
        f"max_tokens: {max_tokens}, temperature: {temperature}, top_p: {top_p}, stop: {stop}, prompt: {prompt}"
    )
    input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to("cuda:0")

    stop.append(tokenizer.eos_token)
    stop_phrase_ids = [
        tokenizer(keyword, return_tensors="pt").input_ids.to("cuda:0")
        for keyword in stop
    ]
    stop_phrase_criteria = KeywordsStoppingCriteria(stop_phrase_ids)

    stopping_criteria = StoppingCriteriaList(
        [
            stop_phrase_criteria,
        ]
    )

    generate_kwargs = dict(
        do_sample=True,
        temperature=temperature,
        top_p=top_p,
        stopping_criteria=stopping_criteria,
        max_length=max_tokens,
    )

    if not tokenizer.pad_token_id:
        generate_kwargs["pad_token_id"] = tokenizer.eos_token_id

    gen_tokens = model.generate(input_ids, **generate_kwargs)

    response_count = gen_tokens.size()[1] - input_ids.size()[1]

    print(f"total_tokens: {gen_tokens.size()[1]}")
    print(f"prompt_tokens: {input_ids.size()[1]}")
    print(f"completion_tokens: {response_count}")

    gen_text = tokenizer.batch_decode([gen_tokens[0][-response_count:]])[0]
    text_trimmed = gen_text.strip()
    for phrase in stop:
        if text_trimmed.endswith(phrase):
            return text_trimmed[: -len(phrase)]
    return text_trimmed


def chat(messages, max_tokens, temperature=1, top_p=1, stop=["\n"]):

    new_line = "\n"
    prompt = (
        new_line.join(
            [
                f'{message.get("role")}: {message.get("content")}{new_line if message.get("role") in ["system","assistant"] else ""}'
                for message in messages
            ]
        )
        + new_line
    )
    stop.append("\nuser:")
    result = completion(prompt, max_tokens, temperature, top_p, stop)
    content = re.sub(r"(system:|assistant:)", "", result).strip()

    return dict(role="assistant", content=content)


def summarization(question, text):
    raise Exception("Not implemented")
