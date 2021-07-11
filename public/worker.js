onmessage = (e) => {
  let tasks = e.data;

  const interval = setInterval(() => {
    // console.log(tasks);
    tasks.forEach((task) => {
      // console.log(task);
      const dueDate = new Date(task.reminder);
      const now = new Date();

      if (
        dueDate.getDate() === now.getDate() &&
        dueDate.getFullYear() === now.getFullYear() &&
        dueDate.getMonth() === now.getMonth() &&
        dueDate.getHours() === now.getHours() &&
        dueDate.getMinutes() === now.getMinutes()
      ) {
        postMessage(task);
      }
    });
  }, 60000);
};
