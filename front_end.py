import gradio as gr
import requests
import json

SYS_PROMPT = """<s> [INST] <<SYS>>
You are a helpful, respectful and honest assistant. Always answer as helpfully as possible.

If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.
<</SYS>> [/INST] </s>\n\n"""

CHAT_HISTORY_PROMPT = """<s>[INST] {prompt} [/INST] {answer} </s>\n\n"""

PROMPT = """<s>[INST] {prompt} [/INST]""".strip()


def user(user_message, history):
    return "", history + [[user_message, None]]


def build_prompt(chat_history):
    prompt = SYS_PROMPT
    for chat in chat_history[:-1]:
        prompt += CHAT_HISTORY_PROMPT.format(prompt=chat[0], answer=chat[1])
    prompt += PROMPT.format(prompt=chat_history[-1][0])

    return prompt


theme = gr.themes.Default(
    font=[gr.themes.GoogleFont("Rubik"), "sans-serif"],
)

title = """<h1 align="center"><a href="https://www.trainml.ai"><div style="display:flex; justify-content: center;"><img style="max-width:250px" src="https://www.trainml.ai/static/img/trainML-logo-purple.png" /></div></a></h1><h2 align="center"> Large Language Model Endpoint Demo</h2>"""
description = """<br>
Disclaimer - Generative Language Models are currently known to have considerable limitations, such as factual/mathematical logic errors, possible generation of harmful/biased content, weak contextual ability, and self-awareness confusion.
"""

with gr.Blocks(
    title="trainML LLM Endpoint Demo",
    theme=theme,
) as demo:
    gr.HTML(title)
    with gr.Row():
        api_endpoint = gr.Textbox(label="API Endpoint")
    with gr.Row():
        with gr.Column():
            chatbot = gr.Chatbot()
            msg = gr.Textbox()

    with gr.Row():
        clear = gr.Button("Clear")

    with gr.Accordion(label="Generation Parameters", open=False):
        with gr.Row():
            with gr.Column(scale=8):
                max_new_tokens = gr.Slider(
                    minimum=-0,
                    maximum=1024,
                    value=512,
                    step=1,
                    interactive=True,
                    label="Max New Tokens",
                    visible=True,
                )
        with gr.Row():
            with gr.Column(scale=8):
                temperature = gr.Slider(
                    minimum=-0,
                    maximum=2.0,
                    value=0.8,
                    step=0.1,
                    interactive=True,
                    label="Temperature",
                    visible=True,
                )
            with gr.Column(scale=8):
                top_p = gr.Slider(
                    minimum=-0,
                    maximum=1.0,
                    value=0.95,
                    step=0.05,
                    interactive=True,
                    label="Top-p",
                    visible=True,
                )
        with gr.Row():
            with gr.Column(scale=8):
                typical_p = gr.Slider(
                    minimum=-0,
                    maximum=1.0,
                    value=0.95,
                    step=0.05,
                    interactive=True,
                    label="Typical-p",
                    visible=True,
                )
    gr.Markdown(description)

    def bot(
        history,
        api_endpoint,
        max_new_tokens,
        temperature,
        top_p,
        typical_p,
    ):
        if not api_endpoint or api_endpoint == "":
            raise Exception("API Endpoint Not Configured")
        prompt = history[-1][0]
        history[-1][1] = ""

        prompt = build_prompt(history)
        payload = dict(
            # https://huggingface.github.io/text-generation-inference/#/Text%20Generation%20Inference/compat_generate
            inputs=prompt,
            parameters=dict(
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                top_p=top_p,
                typical_p=typical_p,
            ),
            stream=True,
        )
        s = requests.Session()
        with s.post(
            f"{api_endpoint}/generate_stream",
            json=payload,
            headers={
                "Content-Type": "application/json",
            },
            stream=True,
        ) as resp:
            for line in resp.iter_lines():
                if line:
                    clean_line = line.decode("utf-8").removeprefix("data:")
                    response = json.loads(clean_line)
                    if response.get("generated_text"):
                        history[-1][1] = response.get("generated_text")
                        yield history
                    else:
                        history[-1][1] += response.get("token").get("text")
                        yield history

    msg.submit(user, [msg, chatbot], [msg, chatbot], queue=False).then(
        bot,
        [
            chatbot,
            api_endpoint,
            max_new_tokens,
            temperature,
            top_p,
            typical_p,
        ],
        [
            chatbot,
        ],
    )
    clear.click(
        lambda: None,
        None,
        [
            chatbot,
        ],
        queue=False,
    )


demo.queue()

if __name__ == "__main__":
    demo.launch(
        show_api=False,
    )
