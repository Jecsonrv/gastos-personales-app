// Textos de la aplicación en español
export const es = {
    // Navegación
    nav: {
        dashboard: "Dashboard",
        movements: "Movimientos",
        categories: "Categorías",
        reports: "Reportes",
        settings: "Configuración",
    },

    // Dashboard
    dashboard: {
        title: "Panel principal",
        totalIncome: "Total Ingresos",
        totalExpenses: "Total Gastos",
        balance: "Balance",
        movements: "Movimientos",
        accumulatedIncome: "Ingresos acumulados",
        accumulatedExpenses: "Gastos acumulados",
        incomeExpenseDiff: "Diferencia ingresos - gastos",
        totalTransactions: "Total de transacciones",
        summary: "Resumen",
        recentMovements: "Últimos Movimientos",
        recentMovementsDesc: "Los 5 movimientos más recientes",
        noRecentMovements: "No hay movimientos recientes",
        chartComingSoon: "Gráfico de evolución mensual (próximamente)",
        loadingMovements: "Cargando movimientos...",
        loading: "Cargando dashboard...",
    },

    // Movimientos
    movements: {
        title: "Movimientos",
        newMovement: "Nuevo Movimiento",
        editMovement: "Editar Movimiento",
        search: "Buscar movimientos...",
        allTypes: "Todos los tipos",
        income: "Ingresos",
        expenses: "Gastos",
        description: "Descripción",
        amount: "Monto",
        date: "Fecha",
        type: "Tipo",
        category: "Categoría",
        actions: "Acciones",
        selectCategory: "Selecciona una categoría",
        saving: "Guardando...",
        update: "Actualizar",
        create: "Crear",
        cancel: "Cancelar",
        deleteConfirm: "¿Estás seguro de que quieres eliminar este movimiento?",
        noMovements: "No hay movimientos registrados",
        noFilteredMovements:
            "No se encontraron movimientos con los filtros aplicados",
        loading: "Cargando movimientos...",
        expense: "Gasto",
        movement: "Movimiento",
        listTitle: "Lista de Movimientos",
    },

    // Categorías
    categories: {
        title: "Categorías",
        subtitle: "Organiza tus gastos e ingresos por categorías",
        newCategory: "Nueva Categoría",
        editCategory: "Editar Categoría",
        search: "Buscar categorías...",
        name: "Nombre",
        description: "Descripción",
        saving: "Guardando...",
        update: "Actualizar",
        create: "Crear",
        cancel: "Cancelar",
        deleteConfirm: "¿Estás seguro de que quieres eliminar esta categoría?",
        noCategories: "No hay categorías registradas",
        noFilteredCategories: "No se encontraron categorías con ese criterio",
        createFirst: "Crear primera categoría",
        loading: "Cargando categorías...",
        namePlaceholder: "Ej: Alimentación, Transporte...",
        descriptionPlaceholder: "Descripción opcional...",
        nameRequired: "Nombre *",
        descriptionOptional: "Descripción",
    },

    // Configuración
    settings: {
        title: "Configuración",
        subtitle: "Personaliza la aplicación según tus preferencias",
        saveChanges: "Guardar cambios",
        saving: "Guardando...",

        appearance: "Apariencia",
        theme: "Tema de la aplicación",
        light: "Claro",
        dark: "Oscuro",
        system: "Sistema",
        themeNote:
            "El tema se aplicará inmediatamente y se guardará para futuras sesiones",

        regional: "Configuración Regional",
        currency: "Moneda predeterminada",
        currencyNote: "Se usará para mostrar todos los importes monetarios",
        language: "Idioma de la interfaz",
        languageNote: "Cambia el idioma de toda la aplicación",
        dateFormat: "Formato de fecha",
        dateFormatNote: "Formato para mostrar fechas en toda la aplicación",

        // Opciones de moneda
        currencies: {
            usd: "Dólar estadounidense ($)",
            eur: "Euro (€)",
            gbp: "Libra esterlina (£)",
            mxn: "Peso mexicano (MX$)",
            cop: "Peso colombiano (COP$)",
            pen: "Sol peruano (S/)",
            clp: "Peso chileno (CLP$)",
            ars: "Peso argentino (ARS$)",
            brl: "Real brasileño (R$)",
            cad: "Dólar canadiense (C$)",
            aud: "Dólar australiano (A$)",
        },

        // Opciones de idioma
        languages: {
            spanish: "Español",
            english: "English",
        },

        preview: "Vista previa",
        previewSubtitle: "Ejemplo de cómo se verán los datos:",
        sampleMovement: "Movimiento de ejemplo",
        currentLanguage: "Idioma actual:",
        currentTheme: "Tema:",

        resetDefault: "Restablecer por defecto",
        saveSettings: "Guardar configuración",
    },

    // Reportes
    reports: {
        title: "Reportes",
        loading: "Cargando reportes...",
        categoryExpenses: "Gastos por Categoría",
        monthlyEvolution: "Evolución Mensual",
        year: "Año",
        totalExpenses: "Total de Gastos",
        noData: "No hay datos para mostrar",
        categoryBreakdown: "Desglose por categorías",
        monthlyTrend: "Tendencia mensual",
    },
    common: {
        appTitle: "Gastos Personales",
        closeSidebar: "Cerrar barra lateral",
        loading: "Cargando...",
        save: "Guardar",
        cancel: "Cancelar",
        edit: "Editar",
        delete: "Eliminar",
        search: "Buscar",
        filter: "Filtrar",
        invalidDate: "Fecha inválida",
        required: "Requerido",
        optional: "Opcional",
    },
};

// Textos de la aplicación en inglés
export const en = {
    // Navigation
    nav: {
        dashboard: "Dashboard",
        movements: "Transactions",
        categories: "Categories",
        reports: "Reports",
        settings: "Settings",
    },

    // Dashboard
    dashboard: {
        title: "Main Dashboard",
        totalIncome: "Total Income",
        totalExpenses: "Total Expenses",
        balance: "Balance",
        movements: "Transactions",
        accumulatedIncome: "Accumulated income",
        accumulatedExpenses: "Accumulated expenses",
        incomeExpenseDiff: "Income - expenses difference",
        totalTransactions: "Total transactions",
        summary: "Summary",
        recentMovements: "Recent Transactions",
        recentMovementsDesc: "Last 5 recent transactions",
        noRecentMovements: "No recent transactions",
        chartComingSoon: "Monthly evolution chart (coming soon)",
        loadingMovements: "Loading transactions...",
        loading: "Loading dashboard...",
    },

    // Movements
    movements: {
        title: "Transactions",
        newMovement: "New Transaction",
        editMovement: "Edit Transaction",
        search: "Search transactions...",
        allTypes: "All types",
        income: "Income",
        expenses: "Expenses",
        description: "Description",
        amount: "Amount",
        date: "Date",
        type: "Type",
        category: "Category",
        actions: "Actions",
        selectCategory: "Select a category",
        saving: "Saving...",
        update: "Update",
        create: "Create",
        cancel: "Cancel",
        deleteConfirm: "Are you sure you want to delete this transaction?",
        noMovements: "No transactions recorded",
        noFilteredMovements: "No transactions found with the applied filters",
        loading: "Loading transactions...",
        expense: "Expense",
        movement: "Transaction",
        listTitle: "Transactions List",
    },

    // Categories
    categories: {
        title: "Categories",
        subtitle: "Organize your expenses and income by categories",
        newCategory: "New Category",
        editCategory: "Edit Category",
        search: "Search categories...",
        name: "Name",
        description: "Description",
        saving: "Saving...",
        update: "Update",
        create: "Create",
        cancel: "Cancel",
        deleteConfirm: "Are you sure you want to delete this category?",
        noCategories: "No categories registered",
        noFilteredCategories: "No categories found with that criteria",
        createFirst: "Create first category",
        loading: "Loading categories...",
        namePlaceholder: "E.g.: Food, Transportation...",
        descriptionPlaceholder: "Optional description...",
        nameRequired: "Name *",
        descriptionOptional: "Description",
    },

    // Settings
    settings: {
        title: "Settings",
        subtitle: "Customize the application according to your preferences",
        saveChanges: "Save changes",
        saving: "Saving...",

        appearance: "Appearance",
        theme: "Application theme",
        light: "Light",
        dark: "Dark",
        system: "System",
        themeNote:
            "Theme will apply immediately and be saved for future sessions",

        regional: "Regional Settings",
        currency: "Default currency",
        currencyNote: "Will be used to display all monetary amounts",
        language: "Interface language",
        languageNote: "Changes the language of the entire application",
        dateFormat: "Date format",
        dateFormatNote:
            "Format for displaying dates throughout the application",

        // Currency options
        currencies: {
            usd: "US Dollar ($)",
            eur: "Euro (€)",
            gbp: "British Pound (£)",
            mxn: "Mexican Peso (MX$)",
            cop: "Colombian Peso (COP$)",
            pen: "Peruvian Sol (S/)",
            clp: "Chilean Peso (CLP$)",
            ars: "Argentine Peso (ARS$)",
            brl: "Brazilian Real (R$)",
            cad: "Canadian Dollar (C$)",
            aud: "Australian Dollar (A$)",
        },

        // Language options
        languages: {
            spanish: "Español",
            english: "English",
        },

        preview: "Preview",
        previewSubtitle: "Example of how data will look:",
        sampleMovement: "Sample transaction",
        currentLanguage: "Current language:",
        currentTheme: "Theme:",

        resetDefault: "Reset to default",
        saveSettings: "Save settings",
    },

    // Reports
    reports: {
        title: "Reports",
        loading: "Loading reports...",
        categoryExpenses: "Expenses by Category",
        monthlyEvolution: "Monthly Evolution",
        year: "Year",
        totalExpenses: "Total Expenses",
        noData: "No data to display",
        categoryBreakdown: "Category breakdown",
        monthlyTrend: "Monthly trend",
    },

    // Common
    common: {
        appTitle: "Personal Expenses",
        closeSidebar: "Close sidebar",
        loading: "Loading...",
        save: "Save",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        search: "Search",
        filter: "Filter",
        invalidDate: "Invalid date",
        required: "Required",
        optional: "Optional",
    },
};

// Tipos para TypeScript
export type TranslationKey = keyof typeof es;
export type Language = "es" | "en";
