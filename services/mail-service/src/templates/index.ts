export type EmailTemplate = 'TEMP_PASSWORD' | 'PASSWORD_CHANGED';

export function getEmailTemplate(
  template: EmailTemplate,
  data: Record<string, any>
): string {
  switch (template) {
    case 'TEMP_PASSWORD':
      return `
        <h1>Bienvenue sur PIM</h1>
        <p>Votre compte a été créé avec succès.</p>
        <p>Votre mot de passe temporaire est: <strong>${data.temporaryPassword}</strong></p>
        <p>Veuillez le changer lors de votre première connexion.</p>
      `;

    case 'PASSWORD_CHANGED':
      return `
        <h1>Mot de passe modifié</h1>
        <p>Votre mot de passe a été modifié avec succès.</p>
      `;

    default:
      throw new Error(`Template inconnu: ${template}`);
  }
}
