
// Utilitário para fornecer dados padrão de empresa quando necessário
// já que removemos os dados de empresa do perfil do usuário

export const getDefaultCompanyData = (user: any) => {
  return {
    companyName: user?.name || 'Empresa',
    cnpj: '', // Não temos mais CNPJ no perfil
    companyLogo: user?.avatar || '',
  };
};

export const getCompanyDisplayName = (user: any) => {
  return user?.name || 'Empresa';
};
