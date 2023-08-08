import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import React, { useContext, useEffect, useRef, useState } from 'react';

export function Title() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const { t } = useTranslation();
  const modalCtrl = useModal();
}
