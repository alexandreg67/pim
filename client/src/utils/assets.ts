export const getAssetUrl = (url: string | null, type: 'images' | 'logos') => {
  if (!url) return '';

  // Vérifiez que type est défini
  if (!type) {
    console.error("Type non défini pour l'image:", url);
    type = 'images'; // Valeur par défaut
  }

  // Utiliser la variable d'environnement
  return `/${type}/${url}`;
};
