const completeTaskButtonElements = document.querySelectorAll('.todo button');

async function completeTask(event) {
    const buttonElement = event.target;
    const taskId = buttonElement.dataset.taskid;

    const response = await fetch('/task/' + taskId, {
        method: 'POST'
    });

    if(!response.ok) {
        alert('Something went wrong!');
        return;
    }

    buttonElement.parentElement.remove();
}

for (const completeTaskButtonElement of completeTaskButtonElements) {
    completeTaskButtonElement.addEventListener('click', completeTask)
}