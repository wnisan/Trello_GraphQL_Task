Получить всех пользователей:
query {
  users {
    id
    firstname
    lastname
    email
    projects {
      id
      title
      tasks {
        id
        title
        status
      }
    }
  }
}

Создать нового пользователя:
mutation {
  createUser(input: {
    firstname: "Test"
    lastname: "User"
    email: "test@example.com"
  }) {
    id
    firstname
    lastname
    email
  }
}

Получить все проекты:
query {
  projects {
    id
    title
    description
    user {
      firstname
      lastname
    }
    tasks {
      title
      status
    }
  }
}

Создать проект:
mutation {
  createProject(input: {
    title: "Мой первый проект"
    description: "Описание проекта"
    userId: "692975ba5923c94a2fabc9b6"
  }) {
    id
    title
    description
  }
}

