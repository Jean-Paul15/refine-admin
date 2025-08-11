export const frTranslations = {
    pages: {
        login: {
            title: "Connexion",
            signin: "Se connecter",
            signup: "S'inscrire",
            divider: "ou",
            fields: {
                email: "Adresse e-mail",
                password: "Mot de passe",
            },
            errors: {
                validEmail: "Adresse e-mail invalide",
            },
            buttons: {
                submit: "Se connecter",
                forgotPassword: "Mot de passe oublié ?",
                noAccount: "Pas de compte ?",
                rememberMe: "Se souvenir de moi",
            },
        },
        forgotPassword: {
            title: "Mot de passe oublié",
            fields: {
                email: "Adresse e-mail",
            },
            errors: {
                validEmail: "Adresse e-mail invalide",
            },
            buttons: {
                submit: "Envoyer les instructions",
                back: "Retour à la connexion",
            },
        },
        register: {
            title: "Inscription",
            fields: {
                email: "Adresse e-mail",
                password: "Mot de passe",
                confirm: "Confirmer le mot de passe",
            },
            errors: {
                validEmail: "Adresse e-mail invalide",
                confirmPasswordNotMatch: "Les mots de passe ne correspondent pas",
            },
            buttons: {
                submit: "S'inscrire",
                haveAccount: "Déjà un compte ?",
            },
        },
        updatePassword: {
            title: "Nouveau mot de passe",
            fields: {
                password: "Nouveau mot de passe",
                confirmPassword: "Confirmer le nouveau mot de passe",
            },
            errors: {
                confirmPasswordNotMatch: "Les mots de passe ne correspondent pas",
            },
            buttons: {
                submit: "Mettre à jour",
            },
        },
        error: {
            info: "Vous avez oublié d'ajouter le composant %{component} à %{resource}.",
            404: "Désolé, la page que vous avez visitée n'existe pas.",
            resource404: "Êtes-vous sûr d'avoir créé la ressource %{resource} sur le composant %{component} ?",
            backHome: "Retour à l'accueil",
        },
    },
    actions: {
        list: "Liste",
        create: "Créer",
        edit: "Modifier",
        show: "Afficher",
        delete: "Supprimer",
        save: "Sauvegarder",
        cancel: "Annuler",
        clear: "Effacer",
        refresh: "Actualiser",
        close: "Fermer",
        createText: "Créer %{resource}",
        editText: "Modifier %{resource}",
        listText: "Liste des %{resource}",
        deleteText: "Supprimer %{resource}",
        showText: "Afficher %{resource}",
    },
    buttons: {
        add: "Ajouter",
        create: "Créer",
        save: "Sauvegarder",
        edit: "Modifier",
        delete: "Supprimer",
        show: "Afficher",
        cancel: "Annuler",
        confirm: "Êtes-vous sûr ?",
        filter: "Filtrer",
        clear: "Effacer",
        refresh: "Actualiser",
        close: "Fermer",
        export: "Exporter",
        import: "Importer",
    },
    loading: "Chargement",
    tags: {
        clone: "Dupliquer",
    },
    table: {
        actions: "Actions",
    },
    search: {
        placeholder: "Rechercher...",
        more: "plus",
    },
    status: {
        enable: "Activer",
        disable: "Désactiver",
    },
    warnWhenUnsavedChanges: "Êtes-vous sûr de vouloir quitter ? Vous avez des modifications non sauvegardées.",
    notifications: {
        success: "Réussi",
        error: "Erreur",
        undoable: "Vous avez %{seconds} secondes pour annuler",
        createSuccess: "Créé avec succès",
        createError: "Une erreur s'est produite lors de la création",
        deleteSuccess: "Supprimé avec succès",
        deleteError: "Erreur lors de la suppression (code de statut : %{statusCode})",
        editSuccess: "Modifié avec succès",
        editError: "Une erreur s'est produite lors de la modification (code de statut : %{statusCode})",
        importProgress: "Import en cours : %{processed}/%{total}",
    },
    dashboard: {
        title: "Tableau de bord",
    },
};
