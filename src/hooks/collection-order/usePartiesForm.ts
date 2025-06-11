
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CollectionOrderFormData } from '@/components/collectionOrder/schema';
import { User } from '@/types';

export const usePartiesForm = (
  form: UseFormReturn<CollectionOrderFormData>,
  user: User | null
) => {
  const [showReceiverForm, setShowReceiverForm] = useState(false);

  const handleAddReceiver = () => {
    setShowReceiverForm(true);
  };

  const handleCancelReceiver = () => {
    setShowReceiverForm(false);
    // Reset receiver fields
    form.setValue('receiverName', '');
    form.setValue('receiverPhone', '');
    form.setValue('receiverEmail', '');
    form.setValue('receiverAddress', '');
  };

  const handleSaveReceiver = () => {
    setShowReceiverForm(false);
  };

  // Auto-fill transporter info with user data
  const autoFillTransporter = () => {
    if (user) {
      form.setValue('transporterName', user.name || '');
      form.setValue('transporterPhone', user.phone || '');
      form.setValue('transporterEmail', user.email || '');
      // Note: We no longer have cnpj or companyLogo in user profile
      // Using cpf instead if available
      if (user.cpf) {
        form.setValue('transporterDocument', user.cpf);
      }
    }
  };

  return {
    showReceiverForm,
    handleAddReceiver,
    handleCancelReceiver,
    handleSaveReceiver,
    autoFillTransporter,
  };
};
