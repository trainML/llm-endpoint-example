<div align="center">
  <a href="https://www.trainml.ai/"><img src="https://www.trainml.ai/static/img/trainML-logo-purple.png"></a><br>
</div>

# Large Language Model Endpoint Example

This repository walks through how to use the [trainML platform](https://www.trainml.ai) to deploy a large language model for use in text completion or interactive chat tasks similar to [ChatGPT](https://platform.openai.com/docs/guides/chat). Running the default endpoint in the example as described will consume 1.96 credits ($1.96 USD) per hour of runtime.

![image](assets/chat-example.png)

### Prerequisites

Before beginning this example, ensure that you have satisfied the following prerequisites.

- A valid [trainML account](https://auth.trainml.ai/login?response_type=code&client_id=536hafr05s8qj3ihgf707on4aq&redirect_uri=https://app.trainml.ai/auth/callback) with a non-zero [credit balance](https://docs.trainml.ai/reference/billing-credits/)
- A python [virtual environment](https://docs.python.org/3/library/venv.html) with the [trainML CLI/SDK](https://github.com/trainML/trainml-cli) installed and [configured](https://docs.trainml.ai/reference/cli-sdk#authentication).
- A current version of [Node.js](https://nodejs.org/en/) installed.

## Create the endpoint

trainML currently provides [BLOOMZ (7b1)](https://huggingface.co/bigscience/bloomz-7b1), [GPT-NeoX-20B](https://huggingface.co/EleutherAI/gpt-neox-20b), and [GPT-J-6B](https://huggingface.co/EleutherAI/gpt-j-6B) as [public checkpoints](https://docs.trainml.ai/reference/checkpoints#public-checkpoints) to attach to jobs for free. To create a new endpoint using one of these checkpoints, run the following command in the base of this repository:

```
python deploy_endpoint.py --model-type=[bloomz-7b1,gpt-j-6b,gpt-j-6b-float16,gpt-neox-20b]
```

Once the endpoint is running, the script will output the endpoint URL.

## Launch the UI

Go to the `front-end` folder of the repository in a terminal window and type `npm install`. Once that process completes, type `npm start`. This will open a web browser to http://localhost:3000 and load the example front end.

Enter the endpoint URL from the above section in the `Endpoint Address` field, modify any other configuration settings, and click `Update` at the bottom of the configuration section. Begin entering prompts to test the results.
