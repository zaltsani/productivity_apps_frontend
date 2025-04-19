import AxiosInstance from "./axiosInstance"

// // // //
// TASK  //
// // // //
export const fetchMe = async () => {
  const res = await AxiosInstance.get(`api/v1/users/me`)
  return res.data
}

export const postRegister = async (username, password1, password2) => {
  console.log(username, password1, password2)
  const res = await AxiosInstance.post(`api/v1/dj-rest-auth/registration/`, {
    username: username,
    password1: password1,
    password2: password2
  })
  return res
}

export const fetchTask = async () => {
  const res = await AxiosInstance.get(`api/v1/task`)
  return res.data
}

export const fetchTaskId = async(taskId) => {
  const res = await AxiosInstance.get(`api/v1/task/${taskId}`)
  return res.data
}

export const updateTaskBody = async ( task ) => {
  console.log("Task Body Update", task)
  const res = await AxiosInstance.patch(`api/v1/task/body/${task.id}/`,
    task
  )
  return res
}

export const updateTaskTitle = async ( task ) => {
  console.log("Task Title Update", task)
  await AxiosInstance.patch(`api/v1/task/${task.id}/`, {
    title: task.title
  })
}

export const addTaskBody = async (task) => {
  console.log("Add Task", task)
  const res = await AxiosInstance.post(`api/v1/task/${task.id}/body/`, {
    body: "",
    is_done: false,
    task: task.id
  })
  console.log("Add Task Body", res.data)
  return res.data
}

export const addSubTaskBody = async(task) => {
  const res = await AxiosInstance.post(`api/v1/task/body/`, {
    body: "",
    is_done: false,
    task: task.task,
    parent: task.id
  })
  return res
}

export const deleteTaskBody = async (task) => {
  console.log("Delete Task", task)
  await AxiosInstance.delete(`api/v1/task/body/${task.id}/`)
}

export const addTask = async (user) => {
  const res = await AxiosInstance.post(`api/v1/task/`, {
    owner: user.id
  })
  console.log("Add Task", res)
}

export const deleteTask = async (task) => {
  await AxiosInstance.delete(`api/v1/task/${task.id}/`)
}


// // // // // // // // //
// Article and Journal
// // // // // // // // //

export const fetchArticleList = async () => {
  const res = await AxiosInstance.get(`api/v1/article/?category=article`)
  return res.data
}

export const fetchJournalList = async () => {
  const res = await AxiosInstance.get(`api/v1/article/?category=journal`)
  return res.data
}

export const addArticle = async (user) => {
  console.log("Add Article")
  const res = await AxiosInstance.post(`api/v1/article/`, {
    owner: user.id,
    category: "article"
  })
  console.log("Add Article Status:", res.status)
  return res.data
}

export const addJournal = async (user) => {
  console.log("Add Article")
  const res = await AxiosInstance.post(`api/v1/article/`, {
    owner: user.id,
    category: "journal"
  })
  return res.data
}

export const fetchArticleDetail = async (articleId) => {
  const res = await AxiosInstance.get(`api/v1/article/${articleId}`)
  return res.data
}

export const updateArticle = async (article) => {
  const res = await AxiosInstance.patch(`api/v1/article/${article.id}/`, article)
  console.log("Article was Updated")
  return res
}

export const deleteArticle = async(article) => {
  const res = await AxiosInstance.delete(`api/v1/article/${article.id}/`)
  return res
}


// // // // // // //
// Calendar To Do //
// // // // // // //

export const fetchTodoList = async () => {
  const res = await AxiosInstance.get(`api/v1/todo/`)
  return res.data
}

// export const addTodo = async (user, date) => {
//   const res = await AxiosInstance.post(`api/v1/todo/`, {
//     owner: user.id,
//     title: "",
//     date_time: date
//   })
//   return res.data
// }

export const addTodo = async (data) => {
  const res = await AxiosInstance.post(`api/v1/todo/`, data)
  console.log("Add Todo Status", res.status)
}

export const deleteTodo = async (todo) => {
  const res = await AxiosInstance.delete(`api/v1/todo/${todo.id}/`)
  return res.data
}

// export const updateTodo = async (todo) => {
//   const res = await AxiosInstance.patch(`api/v1/todo/${todo.id}/`, {
//     title: todo.title,
//     description: todo.description,
//     status: todo.status
//   })
//   return res
// }

export const updateTodo = async (data) => {
  const res = await AxiosInstance.patch(`api/v1/todo/${data.id}/`, data)
  console.log("Update Todo Status", res.status)
  return res.data
}


// Finance
export const fetchTransaction = async(limit, page) => {
  const offset = limit * page
  console.log("limit",limit,"offset",offset)
  const res = await AxiosInstance.get(`api/v1/finance/transaction/?limit=${limit}&offset=${offset}`)
  return res.data
}

export const fetchFinanceSummary = async() => {
  const res = await AxiosInstance.get(`api/v1/finance/`)
  return res.data
}

export const fetchCategory = async() => {
  const res = await AxiosInstance.get(`api/v1/finance/category/`)
  return res.data
}

export const addCategory = async(user, category) => {
  console.log("Add Category")
  const res = await AxiosInstance.post(`api/v1/finance/category/`, {
    name: category,
    user: user.id
  })
  return res.data
}

export const addTransaction = async(data) => {
  const res = await AxiosInstance.post(`api/v1/finance/transaction/create/`, data)
  return res.data
}

export const deleteTransaction = async(data) => {
  const res = await AxiosInstance.delete(`api/v1/finance/transaction/${data.id}/`)
  return res
}

export const fetchDailyTransaction = async() => {
  const res = await AxiosInstance.get(`api/v1/finance/daily-transaction/`)
  return res.data
}


// // // //
// Story
// // // //
export const fetchStories = async() => {
  const res = await AxiosInstance.get(`api/v1/story/`)
  return res.data
}

export const postStory = async(data) => {
  const res = await AxiosInstance.post(`api/v1/story/`, data)
  return res
}

export const patchStory = async(data) => {
  const res = await AxiosInstance.patch(`api/v1/story/${data.id}/`, data)
  return res
}

export const deleteStory = async(storyId) => {
  const res = await AxiosInstance.delete(`api/v1/story/${storyId}/`)
  return res
}