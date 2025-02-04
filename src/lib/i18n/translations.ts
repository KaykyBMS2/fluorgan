export type Language = "en" | "es" | "pt-BR";

export const translations = {
  en: {
    common: {
      dashboard: "Dashboard",
      tasks: "Tasks",
      reports: "Reports",
      settings: "Settings",
      newTask: "New Task",
      logout: "Logout",
      colleagues: "Colleagues",
      noColleagues: "No colleagues yet",
      email: "Email",
      password: "Password",
      login: "Login",
      signup: "Sign Up",
      firstName: "First Name",
      lastName: "Last Name",
      username: "Username",
      error: "Error",
      success: "Success"
    },
    auth: {
      loginTitle: "Welcome back",
      signupTitle: "Create an account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      allFieldsRequired: "All fields are required",
      firstName: "First Name",
      lastName: "Last Name"
    },
    settings: {
      language: "Language",
      chooseLanguage: "Choose your preferred language",
      theme: "Theme",
      chooseTheme: "Choose your preferred theme",
      profile: "Profile",
      updateProfile: "Update your profile information",
      firstName: "First Name",
      lastName: "Last Name",
      save: "Save Changes",
      profileUpdated: "Profile updated successfully"
    }
  },
  es: {
    common: {
      dashboard: "Tablero",
      tasks: "Tareas",
      reports: "Informes",
      settings: "Configuración",
      newTask: "Nueva Tarea",
      logout: "Cerrar Sesión",
      colleagues: "Colegas",
      noColleagues: "Sin colegas aún",
      email: "Correo electrónico",
      password: "Contraseña",
      login: "Iniciar Sesión",
      signup: "Registrarse",
      firstName: "Nombre",
      lastName: "Apellido",
      username: "Nombre de usuario",
      error: "Error",
      success: "Éxito"
    },
    auth: {
      loginTitle: "Bienvenido de nuevo",
      signupTitle: "Crear una cuenta",
      noAccount: "¿No tienes una cuenta?",
      hasAccount: "¿Ya tienes una cuenta?",
      allFieldsRequired: "Todos los campos son requeridos",
      firstName: "Nombre",
      lastName: "Apellido"
    },
    settings: {
      language: "Idioma",
      chooseLanguage: "Elige tu idioma preferido",
      theme: "Tema",
      chooseTheme: "Elige tu tema preferido",
      profile: "Perfil",
      updateProfile: "Actualiza tu información de perfil",
      firstName: "Nombre",
      lastName: "Apellido",
      save: "Guardar Cambios",
      profileUpdated: "Perfil actualizado exitosamente"
    }
  },
  "pt-BR": {
    common: {
      dashboard: "Painel",
      tasks: "Tarefas",
      reports: "Relatórios",
      settings: "Configurações",
      newTask: "Nova Tarefa",
      logout: "Sair",
      colleagues: "Colegas",
      noColleagues: "Nenhum colega ainda",
      email: "E-mail",
      password: "Senha",
      login: "Entrar",
      signup: "Cadastrar",
      firstName: "Nome",
      lastName: "Sobrenome",
      username: "Nome de usuário",
      error: "Erro",
      success: "Sucesso"
    },
    auth: {
      loginTitle: "Bem-vindo de volta",
      signupTitle: "Criar uma conta",
      noAccount: "Não tem uma conta?",
      hasAccount: "Já tem uma conta?",
      allFieldsRequired: "Todos os campos são obrigatórios",
      firstName: "Nome",
      lastName: "Sobrenome"
    },
    settings: {
      language: "Idioma",
      chooseLanguage: "Escolha seu idioma preferido",
      theme: "Tema",
      chooseTheme: "Escolha seu tema preferido",
      profile: "Perfil",
      updateProfile: "Atualize suas informações de perfil",
      firstName: "Nome",
      lastName: "Sobrenome",
      save: "Salvar Alterações",
      profileUpdated: "Perfil atualizado com sucesso"
    }
  }
} as const;