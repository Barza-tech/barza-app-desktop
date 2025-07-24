export type Language = "en" | "pt" | "fr"

export interface Translations {
  // Common
  loading: string
  cancel: string
  confirm: string
  save: string
  delete: string
  edit: string
  back: string
  next: string
  previous: string
  search: string
  filter: string

  // Auth
  welcome: string
  welcomeBack: string
  joinBarza: string
  login: string
  register: string
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phoneNumber: string
  signIn: string
  signUp: string
  createAccount: string
  signingIn: string
  creatingAccount: string
  forgotPassword: string
  verify: string
  verify_account: string
  verification_code: string
  enter_6_digit_code: string
  enter_full_name: string
  enter_phone: string
  enter_email: string
  enter_password: string
  account_type: string
  dont_have_account: string
  already_have_account: string
  phone: string

  // User Types
  client: string
  professional: string
  professionalBarberBeauty: string
  iAmA: string

  // Verification
  verifyAccount: string
  verificationCodeSent: string
  enterSixDigitCode: string
  verifying: string
  verifyAccount2: string
  backToRegistration: string
  verificationMethod: string

  // Dashboard Common
  dashboard: string
  profile: string
  settings: string
  logout: string
  available: string
  offline: string

  // Client Dashboard
  findPerfectBarber: string
  searchServices: string
  mapView: string
  listView: string
  bookNow: string
  availableNow: string
  busy: string
  services: string
  noProfsFound: string
  adjustSearch: string

  // Professional Dashboard
  professionalDashboard: string
  totalEarnings: string
  pendingCommissions: string
  completedServices: string
  rating: string
  bookingRequests: string
  commissionPayments: string
  serviceHistory: string
  pendingRequests: string
  noPendingRequests: string
  newBookingRequests: string
  accept: string
  reject: string

  // Booking
  bookWith: string
  service: string
  selectService: string
  date: string
  time: string
  selectTime: string
  additionalNotes: string
  specialRequests: string
  estimatedPrice: string
  sendRequest: string
  sending: string
  bookingRequestSent: string
  bookingApprovalSent: string

  // Commission
  payCommission: string
  paymentMethod: string
  transactionId: string
  paymentReceipt: string
  clickUploadReceipt: string
  additionalInfo: string
  submitting: string
  submitPayment: string
  commissionDue: string
  serviceAmount: string

  // Admin
  adminDashboard: string
  platformManagement: string
  totalUsers: string
  professionals: string
  totalBookings: string
  totalRevenue: string
  pendingReviews: string
  commissionPaymentReviews: string
  platformReports: string
  downloadUserReport: string
  downloadRevenueReport: string
  downloadCommissionReport: string
  approve: string
  viewReceipt: string
  paymentReceiptTitle: string

  // Landing Page
  findYourPerfectBarber: string
  discoverTalentedBarbers: string
  getStarted: string
  watchDemo: string
  whyChooseBarza: string
  everythingYouNeed: string
  realTimeLocation: string
  findAvailableBarbers: string
  easyBooking: string
  bookInstantly: string
  securePayments: string
  safeSecurePayment: string
  howItWorks: string
  getStartedSteps: string
  signUpVerify: string
  createAccountVerify: string
  findBook: string
  browseAndBook: string
  enjoyService: string
  professionalGrooming: string

  // Services
  haircut: string
  beardTrim: string
  styling: string
  hairStyling: string
  color: string
  treatment: string
  shave: string
  beardCare: string
  fullService: string

  // Messages
  loginSuccessful: string
  welcomeBackToBarza: string
  registrationSuccessful: string
  verificationSuccessful: string
  accountVerified: string
  invalidCode: string
  checkVerificationCode: string
  bookingAccepted: string
  clientNotified: string
  bookingRejected: string
  serviceCompleted: string
  commissionAdded: string
  nowOffline: string
  clientsCantSee: string
  nowAvailable: string
  clientsCanFind: string
  paymentSubmitted: string
  commissionSubmittedReview: string
  commissionApproved: string
  professionalNotified: string
  commissionRejected: string
  locationAccessDenied: string
  enableLocationAccess: string

  // Errors
  error: string
  somethingWentWrong: string
  passwordsDoNotMatch: string
  verificationFailed: string
  failedSendBooking: string
  failedSubmitPayment: string

  // Time and Date
  km: string
  completed: string
  pending: string
  approved: string
  rejected: string

  // Language
  changeLanguage: string
  language: string
}

const translations: Record<Language, Translations> = {
  en: {
    // Common
    loading: "Loading...",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    next: "Next",
    previous: "Previous",
    search: "Search",
    filter: "Filters",

    // Auth
    welcome: "Welcome",
    welcomeBack: "Welcome Back",
    joinBarza: "Join Barza",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    signingIn: "Signing in...",
    creatingAccount: "Creating Account...",
    forgotPassword: "Forgot Password?",
    verify: "Verify",
    verify_account: "Verify Account",
    verification_code: "Verification Code",
    enter_6_digit_code: "Enter 6-digit code",
    enter_full_name: "Enter your full name",
    enter_phone: "Enter your phone number",
    enter_email: "Enter your email",
    enter_password: "Enter your password",
    account_type: "Account Type",
    dont_have_account: "Don't have an account? Register",
    already_have_account: "Already have an account? Login",
    phone: "Phone",

    // User Types
    client: "Client",
    professional: "Professional",
    professionalBarberBeauty: "Professional (Barber/Beauty)",
    iAmA: "I am a",

    // Verification
    verifyAccount: "Verify Your Account",
    verificationCodeSent: "We sent a verification code to your",
    enterSixDigitCode: "Enter 6-digit code",
    verifying: "Verifying...",
    verifyAccount2: "Verify Account",
    backToRegistration: "Back to Registration",
    verificationMethod: "Verification Method",

    // Dashboard Common
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    available: "Available",
    offline: "Offline",

    // Client Dashboard
    findPerfectBarber: "Find your perfect barber",
    searchServices: "Search for services or professionals...",
    mapView: "Map",
    listView: "List",
    bookNow: "Book Now",
    availableNow: "Available Now",
    busy: "Busy",
    services: "services",
    noProfsFound: "No professionals found",
    adjustSearch: "Try adjusting your search or filters",

    // Professional Dashboard
    professionalDashboard: "Professional Dashboard",
    totalEarnings: "Total Earnings",
    pendingCommissions: "Pending Commissions",
    completedServices: "Completed Services",
    rating: "Rating",
    bookingRequests: "Booking Requests",
    commissionPayments: "Commission Payments",
    serviceHistory: "Service History",
    pendingRequests: "Pending Requests",
    noPendingRequests: "No pending requests",
    newBookingRequests: "New booking requests will appear here",
    accept: "Accept",
    reject: "Reject",

    // Booking
    bookWith: "Book with",
    service: "Service",
    selectService: "Select a service",
    date: "Date",
    time: "Time",
    selectTime: "Select a time",
    additionalNotes: "Additional Notes (Optional)",
    specialRequests: "Any special requests or notes...",
    estimatedPrice: "Estimated Price:",
    sendRequest: "Send Request",
    sending: "Sending...",
    bookingRequestSent: "Booking request sent!",
    bookingApprovalSent: "Your booking with {name} has been sent for approval.",

    // Commission
    payCommission: "Pay Commission",
    paymentMethod: "Payment Method",
    transactionId: "Transaction ID",
    paymentReceipt: "Payment Receipt",
    clickUploadReceipt: "Click to upload receipt",
    additionalInfo: "Any additional information...",
    submitting: "Submitting...",
    submitPayment: "Submit Payment",
    commissionDue: "Commission Due:",
    serviceAmount: "Service Amount:",

    // Admin
    adminDashboard: "Admin Dashboard",
    platformManagement: "Platform Management",
    totalUsers: "Total Users",
    professionals: "Professionals",
    totalBookings: "Total Bookings",
    totalRevenue: "Total Revenue",
    pendingReviews: "Pending Reviews",
    commissionPaymentReviews: "Commission Payment Reviews",
    platformReports: "Platform Reports",
    downloadUserReport: "Download User Report",
    downloadRevenueReport: "Download Revenue Report",
    downloadCommissionReport: "Download Commission Report",
    approve: "Approve",
    viewReceipt: "View Receipt",
    paymentReceiptTitle: "Payment Receipt",

    // Landing Page
    findYourPerfectBarber: "Find Your Perfect Barber",
    discoverTalentedBarbers:
      "Discover talented mobile barbers in your area. Professional expertise, modern convenience.",
    getStarted: "Get Started",
    watchDemo: "Watch Demo",
    whyChooseBarza: "Why Choose Barza?",
    everythingYouNeed: "Everything you need for the perfect grooming experience",
    realTimeLocation: "Real-time Location",
    findAvailableBarbers: "Find available barbers near you with live GPS tracking",
    easyBooking: "Easy Booking",
    bookInstantly: "Book appointments instantly with your preferred professional",
    securePayments: "Secure Payments",
    safeSecurePayment: "Safe and secure payment processing with commission tracking",
    howItWorks: "How It Works",
    getStartedSteps: "Get started in just a few simple steps",
    signUpVerify: "Sign Up & Verify",
    createAccountVerify: "Create your account and verify via email or phone",
    findBook: "Find & Book",
    browseAndBook: "Browse available professionals and book your service",
    enjoyService: "Enjoy Service",
    professionalGrooming: "Get professional grooming at your preferred location",

    // Services
    haircut: "Haircut",
    beardTrim: "Beard Trim",
    styling: "Styling",
    hairStyling: "Hair Styling",
    color: "Color",
    treatment: "Treatment",
    shave: "Shave",
    beardCare: "Beard Care",
    fullService: "Full Service",

    // Messages
    loginSuccessful: "Login successful",
    welcomeBackToBarza: "Welcome back to Barza!",
    registrationSuccessful: "Registration successful",
    verificationSuccessful: "Verification successful",
    accountVerified: "Your account has been verified!",
    invalidCode: "Invalid code",
    checkVerificationCode: "Please check your verification code",
    bookingAccepted: "Booking accepted",
    clientNotified: "The client has been notified",
    bookingRejected: "Booking rejected",
    serviceCompleted: "Service completed",
    commissionAdded: "Commission has been added to pending payments",
    nowOffline: "You're now offline",
    clientsCantSee: "Clients won't see you on the map",
    nowAvailable: "You're now available",
    clientsCanFind: "Clients can now find and book you",
    paymentSubmitted: "Payment submitted!",
    commissionSubmittedReview: "Your commission payment has been submitted for review.",
    commissionApproved: "Commission approved",
    professionalNotified: "The professional has been notified",
    commissionRejected: "Commission rejected",
    locationAccessDenied: "Location access denied",
    enableLocationAccess: "Please enable location access to find nearby professionals",

    // Errors
    error: "Error",
    somethingWentWrong: "Something went wrong. Please try again.",
    passwordsDoNotMatch: "Passwords do not match",
    verificationFailed: "Verification failed. Please try again.",
    failedSendBooking: "Failed to send booking request. Please try again.",
    failedSubmitPayment: "Failed to submit payment. Please try again.",

    // Time and Date
    km: "km",
    completed: "Completed",
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",

    // Language
    changeLanguage: "Change Language",
    language: "Language",
  },

  pt: {
    // Common
    loading: "Carregando...",
    cancel: "Cancelar",
    confirm: "Confirmar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    back: "Voltar",
    next: "Próximo",
    previous: "Anterior",
    search: "Pesquisar",
    filter: "Filtros",

    // Auth
    welcome: "Bem-vindo",
    welcomeBack: "Bem-vindo de Volta",
    joinBarza: "Junte-se ao Barza",
    login: "Entrar",
    register: "Registar",
    email: "Email",
    password: "Palavra-passe",
    confirmPassword: "Confirmar Palavra-passe",
    fullName: "Nome Completo",
    phoneNumber: "Número de Telefone",
    signIn: "Entrar",
    signUp: "Registar",
    createAccount: "Criar Conta",
    signingIn: "A entrar...",
    creatingAccount: "A criar conta...",
    forgotPassword: "Esqueceu a palavra-passe?",
    verify: "Verificar",
    verify_account: "Verificar Conta",
    verification_code: "Código de Verificação",
    enter_6_digit_code: "Introduza o código de 6 dígitos",
    enter_full_name: "Introduza o seu nome completo",
    enter_phone: "Introduza o seu número de telefone",
    enter_email: "Introduza o seu email",
    enter_password: "Introduza a sua palavra-passe",
    account_type: "Tipo de Conta",
    dont_have_account: "Não tem conta? Registar",
    already_have_account: "Já tem conta? Entrar",
    phone: "Telefone",

    // User Types
    client: "Cliente",
    professional: "Profissional",
    professionalBarberBeauty: "Profissional (Barbeiro/Beleza)",
    iAmA: "Sou um",

    // Verification
    verifyAccount: "Verificar a Sua Conta",
    verificationCodeSent: "Enviámos um código de verificação para o seu",
    enterSixDigitCode: "Introduza o código de 6 dígitos",
    verifying: "A verificar...",
    verifyAccount2: "Verificar Conta",
    backToRegistration: "Voltar ao Registo",
    verificationMethod: "Método de Verificação",

    // Dashboard Common
    dashboard: "Painel",
    profile: "Perfil",
    settings: "Definições",
    logout: "Sair",
    available: "Disponível",
    offline: "Offline",

    // Client Dashboard
    findPerfectBarber: "Encontre o seu barbeiro perfeito",
    searchServices: "Pesquisar serviços ou profissionais...",
    mapView: "Mapa",
    listView: "Lista",
    bookNow: "Reservar Agora",
    availableNow: "Disponível Agora",
    busy: "Ocupado",
    services: "serviços",
    noProfsFound: "Nenhum profissional encontrado",
    adjustSearch: "Tente ajustar a sua pesquisa ou filtros",

    // Professional Dashboard
    professionalDashboard: "Painel Profissional",
    totalEarnings: "Ganhos Totais",
    pendingCommissions: "Comissões Pendentes",
    completedServices: "Serviços Concluídos",
    rating: "Classificação",
    bookingRequests: "Pedidos de Reserva",
    commissionPayments: "Pagamentos de Comissão",
    serviceHistory: "Histórico de Serviços",
    pendingRequests: "Pedidos Pendentes",
    noPendingRequests: "Sem pedidos pendentes",
    newBookingRequests: "Novos pedidos de reserva aparecerão aqui",
    accept: "Aceitar",
    reject: "Rejeitar",

    // Booking
    bookWith: "Reservar com",
    service: "Serviço",
    selectService: "Selecionar um serviço",
    date: "Data",
    time: "Hora",
    selectTime: "Selecionar uma hora",
    additionalNotes: "Notas Adicionais (Opcional)",
    specialRequests: "Pedidos especiais ou notas...",
    estimatedPrice: "Preço Estimado:",
    sendRequest: "Enviar Pedido",
    sending: "A enviar...",
    bookingRequestSent: "Pedido de reserva enviado!",
    bookingApprovalSent: "A sua reserva com {name} foi enviada para aprovação.",

    // Commission
    payCommission: "Pagar Comissão",
    paymentMethod: "Método de Pagamento",
    transactionId: "ID da Transação",
    paymentReceipt: "Recibo de Pagamento",
    clickUploadReceipt: "Clique para carregar recibo",
    additionalInfo: "Informações adicionais...",
    submitting: "A submeter...",
    submitPayment: "Submeter Pagamento",
    commissionDue: "Comissão Devida:",
    serviceAmount: "Valor do Serviço:",

    // Admin
    adminDashboard: "Painel Admin",
    platformManagement: "Gestão da Plataforma",
    totalUsers: "Total de Utilizadores",
    professionals: "Profissionais",
    totalBookings: "Total de Reservas",
    totalRevenue: "Receita Total",
    pendingReviews: "Revisões Pendentes",
    commissionPaymentReviews: "Revisões de Pagamento de Comissão",
    platformReports: "Relatórios da Plataforma",
    downloadUserReport: "Descarregar Relatório de Utilizadores",
    downloadRevenueReport: "Descarregar Relatório de Receitas",
    downloadCommissionReport: "Descarregar Relatório de Comissões",
    approve: "Aprovar",
    viewReceipt: "Ver Recibo",
    paymentReceiptTitle: "Recibo de Pagamento",

    // Landing Page
    findYourPerfectBarber: "Encontre o Seu Barbeiro Perfeito",
    discoverTalentedBarbers:
      "Descubra barbeiros móveis talentosos na sua área. Experiência profissional, conveniência moderna.",
    getStarted: "Começar",
    watchDemo: "Ver Demo",
    whyChooseBarza: "Porquê Escolher o Barza?",
    everythingYouNeed: "Tudo o que precisa para a experiência de cuidado perfeita",
    realTimeLocation: "Localização em Tempo Real",
    findAvailableBarbers: "Encontre barbeiros disponíveis perto de si com rastreamento GPS ao vivo",
    easyBooking: "Reserva Fácil",
    bookInstantly: "Reserve consultas instantaneamente com o seu profissional preferido",
    securePayments: "Pagamentos Seguros",
    safeSecurePayment: "Processamento de pagamentos seguro com rastreamento de comissões",
    howItWorks: "Como Funciona",
    getStartedSteps: "Comece em apenas alguns passos simples",
    signUpVerify: "Registar e Verificar",
    createAccountVerify: "Crie a sua conta e verifique via email ou telefone",
    findBook: "Encontrar e Reservar",
    browseAndBook: "Navegue pelos profissionais disponíveis e reserve o seu serviço",
    enjoyService: "Desfrute do Serviço",
    professionalGrooming: "Obtenha cuidados profissionais no local da sua preferência",

    // Services
    haircut: "Corte de Cabelo",
    beardTrim: "Aparar Barba",
    styling: "Penteado",
    hairStyling: "Penteado de Cabelo",
    color: "Cor",
    treatment: "Tratamento",
    shave: "Barbear",
    beardCare: "Cuidado da Barba",
    fullService: "Serviço Completo",

    // Messages
    loginSuccessful: "Login bem-sucedido",
    welcomeBackToBarza: "Bem-vindo de volta ao Barza!",
    registrationSuccessful: "Registo bem-sucedido",
    verificationSuccessful: "Verificação bem-sucedida",
    accountVerified: "A sua conta foi verificada!",
    invalidCode: "Código inválido",
    checkVerificationCode: "Por favor, verifique o seu código de verificação",
    bookingAccepted: "Reserva aceite",
    clientNotified: "O cliente foi notificado",
    bookingRejected: "Reserva rejeitada",
    serviceCompleted: "Serviço concluído",
    commissionAdded: "A comissão foi adicionada aos pagamentos pendentes",
    nowOffline: "Está agora offline",
    clientsCantSee: "Os clientes não o verão no mapa",
    nowAvailable: "Está agora disponível",
    clientsCanFind: "Os clientes podem agora encontrá-lo e reservar",
    paymentSubmitted: "Pagamento submetido!",
    commissionSubmittedReview: "O seu pagamento de comissão foi submetido para revisão.",
    commissionApproved: "Comissão aprovada",
    professionalNotified: "O profissional foi notificado",
    commissionRejected: "Comissão rejeitada",
    locationAccessDenied: "Acesso à localização negado",
    enableLocationAccess: "Por favor, ative o acesso à localização para encontrar profissionais próximos",

    // Errors
    error: "Erro",
    somethingWentWrong: "Algo correu mal. Por favor, tente novamente.",
    passwordsDoNotMatch: "As palavras-passe não coincidem",
    verificationFailed: "Verificação falhada. Por favor, tente novamente.",
    failedSendBooking: "Falha ao enviar pedido de reserva. Por favor, tente novamente.",
    failedSubmitPayment: "Falha ao submeter pagamento. Por favor, tente novamente.",

    // Time and Date
    km: "km",
    completed: "Concluído",
    pending: "Revisão Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",

    // Language
    changeLanguage: "Alterar Idioma",
    language: "Idioma",
  },

  fr: {
    // Common
    loading: "Chargement...",
    cancel: "Annuler",
    confirm: "Confirmer",
    save: "Enregistrer",
    delete: "Supprimer",
    edit: "Modifier",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    search: "Rechercher",
    filter: "Filtres",

    // Auth
    welcome: "Bienvenue",
    welcomeBack: "Bon Retour",
    joinBarza: "Rejoindre Barza",
    login: "Connexion",
    register: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",
    phoneNumber: "Numéro de téléphone",
    signIn: "Se connecter",
    signUp: "S'inscrire",
    createAccount: "Créer un compte",
    signingIn: "Connexion...",
    creatingAccount: "Création du compte...",
    forgotPassword: "Mot de passe oublié ?",

    // User Types
    client: "Client",
    professional: "Professionnel",
    professionalBarberBeauty: "Professionnel (Coiffeur/Beauté)",
    iAmA: "Je suis un",

    // Verification
    verifyAccount: "Vérifiez votre compte",
    verificationCode: "Code de vérification",
    verificationCodeSent: "Nous avons envoyé un code de vérification à votre",
    enterSixDigitCode: "Entrez le code à 6 chiffres",
    verifying: "Vérification...",
    verifyAccount2: "Vérifier le compte",
    backToRegistration: "Retour à l'inscription",
    verificationMethod: "Méthode de vérification",

    // Dashboard Common
    dashboard: "Tableau de bord",
    profile: "Profil",
    settings: "Paramètres",
    logout: "Déconnexion",
    available: "Disponible",
    offline: "Hors ligne",

    // Client Dashboard
    findPerfectBarber: "Trouvez votre coiffeur parfait",
    searchServices: "Rechercher des services ou des professionnels...",
    mapView: "Carte",
    listView: "Liste",
    bookNow: "Réserver maintenant",
    availableNow: "Disponible maintenant",
    busy: "Occupé",
    services: "services",
    noProfsFound: "Aucun professionnel trouvé",
    adjustSearch: "Essayez d'ajuster votre recherche ou vos filtres",

    // Professional Dashboard
    professionalDashboard: "Tableau de bord professionnel",
    totalEarnings: "Gains totaux",
    pendingCommissions: "Commissions en attente",
    completedServices: "Services terminés",
    rating: "Note",
    bookingRequests: "Demandes de réservation",
    commissionPayments: "Paiements de commission",
    serviceHistory: "Historique des services",
    pendingRequests: "Demandes en attente",
    noPendingRequests: "Aucune demande en attente",
    newBookingRequests: "Les nouvelles demandes de réservation apparaîtront ici",
    accept: "Accepter",
    reject: "Rejeter",

    // Booking
    bookWith: "Réserver avec",
    service: "Service",
    selectService: "Sélectionner un service",
    date: "Date",
    time: "Heure",
    selectTime: "Sélectionner une heure",
    additionalNotes: "Notes supplémentaires (Optionnel)",
    specialRequests: "Demandes spéciales ou notes...",
    estimatedPrice: "Prix estimé :",
    sendRequest: "Envoyer la demande",
    sending: "Envoi...",
    bookingRequestSent: "Demande de réservation envoyée !",
    bookingApprovalSent: "Votre réservation avec {name} a été envoyée pour approbation.",

    // Commission
    payCommission: "Payer la commission",
    paymentMethod: "Méthode de paiement",
    transactionId: "ID de transaction",
    paymentReceipt: "Reçu de paiement",
    clickUploadReceipt: "Cliquez pour télécharger le reçu",
    additionalInfo: "Informations supplémentaires...",
    submitting: "Soumission...",
    submitPayment: "Soumettre le paiement",
    commissionDue: "Commission due :",
    serviceAmount: "Montant du service :",

    // Admin
    adminDashboard: "Tableau de bord admin",
    platformManagement: "Gestion de la plateforme",
    totalUsers: "Total des utilisateurs",
    professionals: "Professionnels",
    totalBookings: "Total des réservations",
    totalRevenue: "Chiffre d'affaires total",
    pendingReviews: "Avis en attente",
    commissionPaymentReviews: "Avis de paiement de commission",
    platformReports: "Rapports de plateforme",
    downloadUserReport: "Télécharger le rapport utilisateur",
    downloadRevenueReport: "Télécharger le rapport de revenus",
    downloadCommissionReport: "Télécharger le rapport de commission",
    approve: "Approuver",
    viewReceipt: "Voir le reçu",
    paymentReceiptTitle: "Reçu de paiement",

    // Landing Page
    findYourPerfectBarber: "Trouvez votre coiffeur parfait",
    discoverTalentedBarbers:
      "Découvrez des coiffeurs mobiles talentueux dans votre région. Expertise professionnelle, commodité moderne.",
    getStarted: "Commencer",
    watchDemo: "Voir la démo",
    whyChooseBarza: "Pourquoi choisir Barza ?",
    everythingYouNeed: "Tout ce dont vous avez besoin pour une expérience de toilettage parfaite",
    realTimeLocation: "Localisation en temps réel",
    findAvailableBarbers: "Trouvez des coiffeurs disponibles près de chez vous avec le suivi GPS en direct",
    easyBooking: "Réservation facile",
    bookInstantly: "Réservez instantanément des rendez-vous avec votre professionnel préféré",
    securePayments: "Paiements sécurisés",
    safeSecurePayment: "Traitement des paiements sûr et sécurisé avec suivi des commissions",
    howItWorks: "Comment ça marche",
    getStartedSteps: "Commencez en quelques étapes simples",
    signUpVerify: "S'inscrire et vérifier",
    createAccountVerify: "Créez votre compte et vérifiez par email ou téléphone",
    findBook: "Trouver et réserver",
    browseAndBook: "Parcourez les professionnels disponibles et réservez votre service",
    enjoyService: "Profitez du service",
    professionalGrooming: "Obtenez un toilettage professionnel à l'endroit de votre choix",

    // Services
    haircut: "Coupe de cheveux",
    beardTrim: "Taille de barbe",
    styling: "Coiffage",
    hairStyling: "Coiffage",
    color: "Couleur",
    treatment: "Traitement",
    shave: "Rasage",
    beardCare: "Soin de la barbe",
    fullService: "Service complet",

    // Messages
    loginSuccessful: "Connexion réussie",
    welcomeBackToBarza: "Bon retour sur Barza !",
    registrationSuccessful: "Inscription réussie",
    verificationSuccessful: "Vérification réussie",
    accountVerified: "Votre compte a été vérifié !",
    invalidCode: "Code invalide",
    checkVerificationCode: "Veuillez vérifier votre code de vérification",
    bookingAccepted: "Réservation acceptée",
    clientNotified: "Le client a été notifié",
    bookingRejected: "Réservation rejetée",
    serviceCompleted: "Service terminé",
    commissionAdded: "La commission a été ajoutée aux paiements en attente",
    nowOffline: "Vous êtes maintenant hors ligne",
    clientsCantSee: "Les clients ne vous verront pas sur la carte",
    nowAvailable: "Vous êtes maintenant disponible",
    clientsCanFind: "Les clients peuvent maintenant vous trouver et vous réserver",
    paymentSubmitted: "Paiement soumis !",
    commissionSubmittedReview: "Votre paiement de commission a été soumis pour examen.",
    commissionApproved: "Commission approuvée",
    professionalNotified: "Le professionnel a été notifié",
    commissionRejected: "Commission rejetée",
    locationAccessDenied: "Accès à la localisation refusé",
    enableLocationAccess: "Veuillez activer l'accès à la localisation pour trouver des professionnels à proximité",

    // Errors
    error: "Erreur",
    somethingWentWrong: "Quelque chose s'est mal passé. Veuillez réessayer.",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    verificationFailed: "Échec de la vérification. Veuillez réessayer.",
    failedSendBooking: "Échec de l'envoi de la demande de réservation. Veuillez réessayer.",
    failedSubmitPayment: "Échec de la soumission du paiement. Veuillez réessayer.",

    // Time and Date
    km: "km",
    completed: "Terminé",
    pending: "En attente d'examen",
    approved: "Approuvé",
    rejected: "Rejeté",

    // Language
    changeLanguage: "Changer de langue",
    language: "Langue",
  },
}

export function getBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en"

  const browserLang = navigator.language.toLowerCase()

  if (browserLang.startsWith("pt")) return "pt"
  if (browserLang.startsWith("fr")) return "fr"
  if (browserLang.startsWith("en")) return "en"

  // Default to English for any other language
  return "en"
}

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.en
}

export function t(key: keyof Translations, language: Language, replacements?: Record<string, string>): string {
  let text = getTranslations(language)[key] || key

  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(`{${placeholder}}`, value)
    })
  }

  return text
}
