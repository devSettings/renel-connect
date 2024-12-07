const convertToGourde = (price: number) => Math.round(price * 122);

export const receiptData = {
  salonName: 'La Pause Inn',
  address: '54, Rue Jacques 1er Delmas 31',
  phone1: '(509) 3704-0400',
  email: 'lapauseinn@gmail',
  transactionId: 'SM2023001',
  date: new Date().toLocaleString('fr-FR'),
  stylists: [
    { name: 'Emma Styles', service: 'Coupe et Coiffure' },
    { name: 'Sophie Couleur', service: 'Coloration des Cheveux' },
    { name: 'Marie Manucure', service: 'Manucure' },
    { name: 'Léa Sourcils', service: 'Épilation des Sourcils' },
  ],
  cashier: 'Jean Caisse',
  services: [
    { name: 'Coupe et Coiffure', price: convertToGourde(65.0) },
    { name: 'Coloration des Cheveux', price: convertToGourde(120.0) },
    { name: 'Manucure', price: convertToGourde(35.0) },
    { name: 'Épilation des Sourcils', price: convertToGourde(20.0) },
  ],
  products: [
    { name: 'Shampooing', quantity: 1, price: convertToGourde(25.0) },
    { name: 'Sérum Capillaire', quantity: 1, price: convertToGourde(30.0) },
  ],
  subtotal: convertToGourde(295.0),
  discount: convertToGourde(29.5),
  tax: convertToGourde(22.13),
  total: convertToGourde(287.63),
  amountReceived: convertToGourde(300.0),
  change: convertToGourde(12.37),
  paymentMethod: 'Espèces',
};
