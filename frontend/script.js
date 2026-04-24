const input = document.querySelector('#input');
const chatContainer = document.querySelector('#chat-container');
const askBtn = document.querySelector('#ask');

// Unique thread id
const threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

input?.addEventListener('keyup', handleEnter);
askBtn?.addEventListener('click', handleAsk);

// Loading UI
const loading = document.createElement('div');
loading.className = 'my-6 animate-pulse text-gray-400';
loading.textContent = 'Thinking...';

async function generate(text) {
    try {
        // User message
        const msg = document.createElement('div');
        msg.className = 'my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit';
        msg.textContent = text;
        chatContainer?.appendChild(msg);

        input.value = '';

        // Show loading
        chatContainer?.appendChild(loading);

        // Call backend
        const assistantMessage = await callServer(text);

        // Bot response
        const assistantMsgElem = document.createElement('div');
        assistantMsgElem.className = 'max-w-fit bg-neutral-700 p-3 rounded-xl';
        assistantMsgElem.textContent = assistantMessage;

        loading.remove();
        chatContainer?.appendChild(assistantMsgElem);

        // Auto scroll
        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (error) {
        console.error(error);

        loading.remove();

        const errorMsg = document.createElement('div');
        errorMsg.className = 'text-red-500 my-4';
        errorMsg.textContent = '⚠️ Something went wrong. Try again.';

        chatContainer?.appendChild(errorMsg);
    }
}

// Smart API URL (works locally + deployed)
async function callServer(inputText) {
    const BASE_URL = window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "";

    const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            threadId: threadId,
            message: inputText
        }),
    });

    if (!response.ok) {
        throw new Error('Error generating the response.');
    }

    const result = await response.json();
    return result.message;
}

// Button click
async function handleAsk() {
    const text = input?.value.trim();
    if (!text) return;

    await generate(text);
}

// Enter key
async function handleEnter(e) {
    if (e.key === 'Enter') {
        const text = input?.value.trim();
        if (!text) return;

        await generate(text);
    }
}