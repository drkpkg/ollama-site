const inputText = document.getElementById("input-text");
const inputQuestion = document.getElementById("input-question");
const submitButton = document.getElementById("submit");
const outputResponse = document.getElementById("output-response");
const buttonCancel = document.getElementById("output-cancel");
let response = "";
let isCancelled = false;

function appendResponse(text) {
  response += text;
  outputResponse.innerHTML = marked.parse(response)
  outputResponse.scrollTop = outputResponse.scrollHeight;
}

inputText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitButton.click();
  }
});

buttonCancel.addEventListener("click", () => {
  isCancelled = true;
});

submitButton.addEventListener("click", () => {
  const text = inputText.value;
  if (!text) {
    return;
  }
  response = "";
  outputResponse.innerHTML = "";
  outputResponse.innerText = "";
  inputQuestion.innerText = text;
  inputText.value = "";
  fetch("/v1-ask-question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  })
    .then((response) => {
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          function push() {
            if (isCancelled) {
              controller.close();
              return;
            }
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            });
          }
          push();
        },
        cancel() {
          reader.cancel();
        }
      });
      return new Response(stream);
    })
    .then((response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      function read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            return;
          }
          appendResponse(decoder.decode(value));
          read();
        });
      }
      read();
    })
    .catch((error) => {
      console.error(error);
      outputResponse.innerHTML = "Error occurred";
    }).finally(() => {
      inputText.value = "";
    });
});
